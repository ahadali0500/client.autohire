"use client";

import { useState, useMemo, useEffect } from "react";
import { Pause, Ban, Clock, ExternalLink, Mail, Phone, MapPin, Github, Linkedin, Globe, Calendar, Video, MessageSquare, Briefcase, GraduationCap, Award, Code, CheckCircle2, XCircle, Info } from "lucide-react";
import AgentPipeline, { Step } from "./AgentPipeline";
import { useParams } from "next/navigation";
import { useGetAgent } from "@/hooks/useGetAgent";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Candidate } from "@/types/agent";
import { socket } from "@/lib/socket";

const strengthColor = {
  Strong: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Weak: "bg-red-100 text-red-700",
};

const SettingItem = ({ label, value }: { label: string; value: string }) => (
  <div className="text-sm">
    <p className="text-subtext text-xs">{label}</p>
    <p>{value}</p>
  </div>
);

const StatusBadge = ({ label, status, color }: { label: string; status: string; color: string }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-[10px] text-subtext uppercase font-medium">{label}</span>
    <div className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${color}`}>
      {status}
    </div>
  </div>
);

export default function AgentSessionPage() {
  const params = useParams();
  const { slug } = params;
  const agentId = Array.isArray(slug) ? slug[0] : slug;
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [liveSteps, setLiveSteps] = useState<Step[]>([]);

  const { data, isLoading, isError, error, refetch } = useGetAgent(agentId as string);

  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");

  useEffect(() => {
    if (!agentId) return;

    // 1️⃣ Connect socket
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);

      // 2️⃣ Ping test
      socket.emit("ping_server", { hello: "world" });

      // 3️⃣ Join agent room
      socket.emit("join_agent_room", { agent_id: agentId });
    });

    // 4️⃣ Listen pong
    socket.on("pong_client", (data) => {
      console.log("🔥 Pong received:", data);
    });

    // 5️⃣ Listen joined confirmation
    socket.on("joined", (data) => {
      console.log("📌 Room joined:", data);
    });

    // 6️⃣ MAIN: Listen agent logs
    socket.on("agent_log", (log) => {
      console.log("📡 New log:", log);

      setActivityLogs((prev) => {
        // ❌ Prevent duplicates (VERY IMPORTANT)
        const exists = prev.some(
          (l) =>
            l.message === log.message &&
            l.timestamp === log.timestamp
        );

        if (exists) return prev;

        return [
          {
            id: Date.now(), // temporary id
            message: log.message,
            status: log.status,
            timestamp: log.timestamp,
          },
          ...prev, // ✅ append on top
        ];
      });
    });

    socket.on("agent_state", (payload) => {
      if (payload?.steps) {
        setLiveSteps(payload.steps);
        refetch();
      }


    });

    return () => {
      socket.disconnect();
    };
  }, [agentId]);

  const getStageStyle = (c: Candidate, agentStatus: string, stage: 'screening' | 'scoring' | 'outreach' | 'interview') => {
    let stageStatus = 'pending';
    let color = 'bg-gray-100 text-gray-500 border-gray-200';

    if (stage === 'screening') {
      if (c.parse_status === 'parsed') { stageStatus = 'completed'; color = 'bg-green-100 text-green-700 border-green-200'; }
      else if (c.parse_status === 'failed') { stageStatus = 'failed'; color = 'bg-red-100 text-red-700 border-red-200'; }
      else if (agentStatus === 'resume-screening') { stageStatus = 'in-progress'; color = 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse'; }
    } else if (stage === 'scoring') {
      if (c.score_status === 'scored') { stageStatus = 'completed'; color = 'bg-green-100 text-green-700 border-green-200'; }
      else if (c.score_status === 'failed') { stageStatus = 'failed'; color = 'bg-red-100 text-red-700 border-red-200'; }
      else if (agentStatus === 'shortlisting' && c.parse_status === 'parsed') { stageStatus = 'in-progress'; color = 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse'; }
    } else if (stage === 'outreach') {
      if (c.outreach_status === 'sent') { stageStatus = 'completed'; color = 'bg-green-100 text-green-700 border-green-200'; }
      else if (c.outreach_status === 'failed') { stageStatus = 'failed'; color = 'bg-red-100 text-red-700 border-red-200'; }
      else if (agentStatus === 'outreaching' && c.score_status === 'scored') { stageStatus = 'in-progress'; color = 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse'; }
    } else if (stage === 'interview') {
      if (c.interview_status === 'scheduled') { stageStatus = 'completed'; color = 'bg-green-100 text-green-700 border-green-200'; }
      else if (agentStatus === 'interview-scheduling' && c.outreach_status === 'sent') { stageStatus = 'in-progress'; color = 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse'; }
    }
    return { stageStatus, color };
  };

  const stageFilters = [
    { label: "All Candidates", value: "All" },
    { label: "Screening", value: "screening" },
    { label: "Shortlisted", value: "shortlisted" },
    { label: "Outreach Sent", value: "sent" },
    { label: "Scheduled", value: "scheduled" }
  ];

  const allSteps = useMemo(() => [
    { id: 1, label: "Resume Screening", apiStatus: "resume-screening" },
    { id: 2, label: "Shortlisting", apiStatus: "shortlisting" },
    { id: 3, label: "Outreach", apiStatus: "outreaching" },
    { id: 4, label: "Interview Scheduling", apiStatus: "interview-scheduling" },
    { id: 5, label: "Summary", apiStatus: "summary" },
  ], []);

  const steps = useMemo(() => {
    if (!data?.result.status) return [];

    const currentStepIndex = allSteps.findIndex(step => step.apiStatus === data.result.status);

    if (data.result.status === 'completed' || data.result.status === 'summary') {
      return allSteps.map(step => ({ id: step.id, label: step.label, status: 'completed' as const }));
    }

    return allSteps.map((step, index) => {
      let status: "completed" | "running" | "pending" | "failed" = "pending";
      if (currentStepIndex === -1) {
        status = "pending";
      } else if (index < currentStepIndex) {
        status = "completed";
      } else if (index === currentStepIndex) {
        status = "running";
      }
      return { id: step.id, label: step.label, status };
    });
  }, [data, allSteps]);

  const filteredCandidates = useMemo(() => {
    if (!data?.result.candidates) return [];
    let list = [...data.result.candidates];

    if (search.trim()) {
      list = list.filter(
        (c) =>
          c.candidate_data && c.candidate_data.header.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (stageFilter !== "All") {
      list = list.filter((c) => {
        switch (stageFilter) {
          case "screening":
            return c.parse_status?.toLowerCase() === "parsed";
          case "shortlisted":
            return c.score_status === 'scored' && c.scored_data?.recommended === true;
          case "sent":
            return c.outreach_status?.toLowerCase() === "sent";
          case "scheduled":
            return c.interview_status?.toLowerCase() === "scheduled";
          default:
            return false;
        }
      });
    }

    return list;
  }, [
    search,
    stageFilter,
    data
  ]);

  useEffect(() => {
    if (data?.result?.logs) {
      const formattedLogs = [...data?.result?.logs]
        .reverse()
        .map((log) => ({
          id: log.logs_id,
          message: log.text,
          status: log.status,
          timestamp: log.timestamp,
        }));

      setActivityLogs(formattedLogs);
    }
  }, [data]);


  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const openCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setActiveTab('overview');
  };

  const AgentDetailSkeleton = () => (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-8 bg-border rounded-lg w-64 opacity-80" />
        <div className="flex gap-3">
          <div className="h-10 bg-border rounded-lg w-24 opacity-80" />
          <div className="h-10 bg-border rounded-lg w-24 opacity-80" />
        </div>
      </div>

      <div className="h-48 bg-border border border-theme rounded-2xl opacity-80" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="h-[330px] bg-border border border-theme rounded-xl opacity-80" />
        </div>
        <div>
          <div className="h-[330px] bg-border border border-theme rounded-xl opacity-80" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-20 bg-border border border-theme rounded-xl opacity-80" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-border border border-theme rounded-xl opacity-80" />
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <AgentDetailSkeleton />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const agent = data?.result;

  if (!agent) {
    return <div>No agent data found.</div>;
  }


  return (
    <>
      <div className="max-w-6xl mx-auto mt-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">{agent.job_title}</h1>

          {/* {agent.state !== 'pending' && agent.state !== 'completed' && agent.state !== 'stopped' && (
            <div className="flex items-center gap-3">
              <button className="flex gap-1 px-4 py-2 text-sm border border-theme rounded-lg hover-theme">
                <Pause size={15} /> Pause
              </button>
              <button className="flex gap-1 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                <Ban size={15} /> Stop
              </button>
            </div>
          )} */}
        </div>

        {/* PIPELINE */}
        <AgentPipeline
          steps={liveSteps.length ? liveSteps : steps}
          stats={agent.stats}
          state={agent.state}
        />
      </div>

      {agent.state === 'pending' ? (
        <div className="max-w-6xl mx-auto p-4 md:p-6 text-center bg-card border border-theme rounded-2xl border-dashed mt-4">
          <div className="w-16 h-16 bg-bg border border-theme rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={24} className="text-subtext animate-pulse" />
          </div>
          <h4 className="font-bold text-text text-lg">Agent is initializing...</h4>
          <p className="text-sm text-subtext mt-1 max-w-sm mx-auto">
            The agent will start in a few minutes automatically. It will begin searching and screening candidates according to your settings.
          </p>
        </div>
      ) : (
        <>
          <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="md:col-span-2 space-y-6">

              <div className="border border-theme bg-card rounded-xl p-6 h-[330px] overflow-y-auto">
                <h2 className="font-medium mb-4">Activity Log</h2>

                <ul className="space-y-4 text-sm">
                  <ul className="space-y-4 text-sm">
                    {activityLogs.length > 0 ? (
                      activityLogs.map((log, index) => (
                        <li key={index}>
                          <div className="flex items-start gap-2">
                            <span
                              className={`w-2 h-2 rounded-full mt-1 ${log.status === "ERROR"
                                ? "bg-red-500"
                                : log.status === "SUCCESS"
                                  ? "bg-green-500"
                                  : log.status === "STEP"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                                }`}
                            ></span>

                            <div>
                              <p className="font-medium">{log.message}</p>
                              <p className="text-subtext text-[10px]">
                                {log.status} • {log.timestamp}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-subtext text-xs">No activity yet...</p>
                    )}
                  </ul>
                </ul>
              </div>
            </div>

            <div className="space-y-4">

              <div className="p-6 rounded-xl border border-theme bg-card space-y-4">
                <h2 className="font-semibold text-md">Agent Settings</h2>
                <SettingItem label="Job Title" value={agent.job_title} />
                <SettingItem label="Min Score" value={`${agent.min_resume_score}%`} />
                <SettingItem label="Maximum Candidates" value={agent.max_candidate.toString()} />
                <SettingItem label="Experience Range" value={`${agent.experience_range} years`} />
              </div>

            </div>


          </div>

          <div className="max-w-6xl mx-auto p-4 md:p-6">

            <div className="border border-theme rounded-xl bg-card p-4 space-y-3 mb-4">

              <input
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-theme bg-bg text-sm"
              />


              <div className="flex flex-wrap justify-between mt-2">
                <div className="flex flex-wrap gap-2 mt-2">
                  {stageFilters.map(
                    (s) => (
                      <button key={s.value} onClick={() => setStageFilter(s.value)} className={`px-3 py-1.5 rounded-lg text-xs capitalize ${stageFilter === s.value ? "bg-amber-400 text-white" : "bg-surface border border-theme text-subtext"}`}>
                        {s.label}
                      </button>
                    )
                  )}
                </div>
                <div>
                  <button
                    onClick={() => refetch()}
                    className="px-3 cursor-pointer py-1.5 rounded-lg text-xs capitalize bg-surface border border-theme text-subtext"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>

            </div>

            <div className="space-y-4 pr-1">
              {filteredCandidates.map((c) => {
                const hasData = c.candidate_data && c.parse_status === 'parsed';

                if (!hasData) {
                  const screening = getStageStyle(c, agent.status, 'screening');
                  const isFailed = c.parse_status === 'failed';

                  return (
                    <div key={c.candidate_id} className="p-4 border border-theme rounded-xl bg-card flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-medium">Candidate #{c.candidate_id}</p>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${screening.color}`}>
                          {screening.stageStatus === 'in-progress' ? 'Screening Resume...' :
                            screening.stageStatus === 'failed' ? 'Screening Failed' :
                              'Waiting...'}
                        </div>
                        {isFailed && c.parse_error && (
                          <p className="text-[10px] text-red-500 italic max-w-xs truncate">{c.parse_error}</p>
                        )}
                      </div>
                      <button
                        disabled
                        className={`px-4 py-2 text-xs rounded-md cursor-not-allowed transition-colors ${isFailed ? 'bg-red-50 text-red-400 border border-red-100' : 'bg-gray-100 text-gray-400'
                          }`}
                      >
                        {isFailed ? 'Failed' : 'Processing...'}
                      </button>
                    </div>
                  );
                }

                const screening = getStageStyle(c, agent.status, 'screening');
                const scoring = getStageStyle(c, agent.status, 'scoring');
                const outreach = getStageStyle(c, agent.status, 'outreach');
                const interview = getStageStyle(c, agent.status, 'interview');

                return (
                  <div key={c.candidate_id} className="p-4 border border-theme rounded-xl bg-card hover:shadow transition flex items-center justify-between gap-6">

                    {/* Left side: Info & Status Steps */}
                    <div className="grow">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{c.candidate_data?.header?.name}</h3>
                        {c.score_status === 'scored' && c.scored_data &&
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${c.scored_data.overall_score > 85 ? strengthColor.Strong : c.scored_data.overall_score > 70 ? strengthColor.Medium : strengthColor.Weak}`}>
                            {c.scored_data.overall_score > 85 ? "Strong" : c.scored_data.overall_score > 70 ? "Medium" : "Weak"}
                          </span>
                        }
                      </div>
                      <p className="text-[10px] text-subtext mt-1">{c.candidate_data?.header?.title}</p>

                      <div className="flex items-center gap-4 mt-3">
                        <StatusBadge label="Screening" status={screening.stageStatus} color={screening.color} />
                        <div className="w-4 h-px bg-border mt-4"></div>
                        <StatusBadge label="Scoring" status={scoring.stageStatus} color={scoring.color} />
                        <div className="w-4 h-px bg-border mt-4"></div>
                        <StatusBadge label="Outreach" status={outreach.stageStatus} color={outreach.color} />
                        <div className="w-4 h-px bg-border mt-4"></div>
                        <StatusBadge label="Interview" status={interview.stageStatus} color={interview.color} />
                      </div>
                    </div>

                    {/* Right side: Scores & Action */}
                    <div className="shrink-0 w-52">
                      {c.score_status === 'scored' && c.scored_data ? (
                        <div className="flex justify-between text-[10px] text-center mb-3 px-2">
                          <div>
                            <p className="text-subtext uppercase tracking-tighter">Overall</p>
                            <p className="font-bold text-sm text-primary">{c.scored_data.overall_score}%</p>
                          </div>
                          <div className="w-px h-6 bg-border self-center"></div>
                          <div>
                            <p className="text-subtext uppercase tracking-tighter">Exp</p>
                            <p className="font-bold text-sm">{c.scored_data.category_scores.work_experience?.score || 0}%</p>
                          </div>
                          <div className="w-px h-6 bg-border self-center"></div>
                          <div>
                            <p className="text-subtext uppercase tracking-tighter">Skills</p>
                            <p className="font-bold text-sm">{c.scored_data.category_scores.technical_skills?.score || 0}%</p>
                          </div>
                        </div>
                      ) : (
                        <div className={`h-10 flex items-center justify-center text-center p-2 rounded-lg mb-3 border ${scoring.color}`}>
                          <p className="text-[10px] font-bold uppercase tracking-wider">
                            {scoring.stageStatus === 'in-progress' ? 'Scoring...' :
                              scoring.stageStatus === 'failed' ? 'Scoring Failed' :
                                'Pending Score'}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => openCandidate(c)}
                        className="px-4 py-2 text-xs bg-primary text-white rounded-md hover:bg-primary-hover w-full transition-all font-medium shadow-sm active:scale-95"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {selectedCandidate && selectedCandidate.candidate_data && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-card rounded-2xl border border-theme shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col overflow-hidden">

            {/* Modal Header */}
            <div className="p-6 border-b border-theme bg-surface/50 shrink-0 relative overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border border-primary/20">
                    {selectedCandidate.candidate_data.header.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text">{selectedCandidate.candidate_data.header.name}</h2>
                    <p className="text-primary font-medium flex items-center gap-1.5 mt-0.5">
                      <Briefcase size={14} />
                      {selectedCandidate.candidate_data.header.title}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-subtext">
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} />
                        {selectedCandidate.candidate_data.header.email}
                      </div>
                      {selectedCandidate.candidate_data.header.phone && selectedCandidate.candidate_data.header.phone !== "null" && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={13} />
                          {selectedCandidate.candidate_data.header.phone}
                        </div>
                      )}
                      {selectedCandidate.candidate_data.header.location && selectedCandidate.candidate_data.header.location !== "null" && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} />
                          {selectedCandidate.candidate_data.header.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex gap-2 mr-4">
                    {selectedCandidate.candidate_data.header.github && selectedCandidate.candidate_data.header.github !== "null" && (
                      <a href={selectedCandidate.candidate_data.header.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-bg border border-theme rounded-lg hover:border-primary transition-colors text-subtext hover:text-primary">
                        <Github size={18} />
                      </a>
                    )}
                    {selectedCandidate.candidate_data.header.linkedin && selectedCandidate.candidate_data.header.linkedin !== "null" && (
                      <a href={selectedCandidate.candidate_data.header.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-bg border border-theme rounded-lg hover:border-primary transition-colors text-subtext hover:text-primary">
                        <Linkedin size={18} />
                      </a>
                    )}
                    {selectedCandidate.candidate_data.header.portfolio && selectedCandidate.candidate_data.header.portfolio !== "null" && (
                      <a href={selectedCandidate.candidate_data.header.portfolio} target="_blank" rel="noopener noreferrer" className="p-2 bg-bg border border-theme rounded-lg hover:border-primary transition-colors text-subtext hover:text-primary">
                        <Globe size={18} />
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="p-2 hover:bg-bg rounded-full transition-colors group"
                  >
                    <XCircle className="text-subtext group-hover:text-red-500" size={24} />
                  </button>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="flex gap-1 mt-6 bg-bg/50 p-1 rounded-xl border border-theme w-fit">
                {[
                  { id: 'overview', label: 'Overview', icon: <Info size={14} /> },
                  { id: 'resume', label: 'Resume Profile', icon: <Briefcase size={14} /> },
                  { id: 'comms', label: 'Communication', icon: <MessageSquare size={14} /> }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                      ? 'bg-card text-primary shadow-sm border border-theme'
                      : 'text-subtext hover:text-text hover:bg-card/50'
                      }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-bg/30">

              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Status & Quick Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">
                      <section>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-subtext mb-3 flex items-center gap-2">
                          <MessageSquare size={14} className="text-primary" />
                          Professional Summary
                        </h3>
                        <div className="p-5 bg-card border border-theme rounded-2xl text-sm text-text/80 leading-relaxed shadow-sm italic">
                          "{selectedCandidate.candidate_data.professional_summary || "No professional summary available."}"
                        </div>
                      </section>

                      <section>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-subtext mb-3 flex items-center gap-2">
                          <Calendar size={14} className="text-primary" />
                          Current Status & Logistics
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-card border border-theme rounded-2xl flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedCandidate.interview_status === 'scheduled' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                              <Calendar size={20} />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-subtext tracking-tighter">Interview</p>
                              <p className="text-sm font-semibold">
                                {selectedCandidate.interview_status === 'scheduled' ? 'Scheduled' : 'Not Scheduled'}
                              </p>
                            </div>
                          </div>

                          <div className="p-4 bg-card border border-theme rounded-2xl flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedCandidate.outreach_status === 'sent' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                              <Mail size={20} />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-subtext tracking-tighter">Outreach</p>
                              <p className="text-sm font-semibold capitalize">
                                {selectedCandidate.outreach_status || 'Pending'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {selectedCandidate.interview_status === 'scheduled' && (
                          <div className="mt-4 p-5 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <Clock className="text-primary" size={18} />
                                <div>
                                  <p className="text-xs font-bold text-primary/80">Scheduled for</p>
                                  <p className="text-sm font-bold text-text">
                                    {new Date(selectedCandidate.interview_start_time!).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(selectedCandidate.interview_start_time!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                              {selectedCandidate.hangout_link && (
                                <a href={selectedCandidate.hangout_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-all shadow-lg shadow-primary/20">
                                  <Video size={16} />
                                  Join Meeting
                                </a>
                              )}
                            </div>
                            {selectedCandidate.calendar_event_link && (
                              <a href={selectedCandidate.calendar_event_link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1.5">
                                <Calendar size={12} />
                                View in Google Calendar
                              </a>
                            )}
                          </div>
                        )}
                      </section>
                    </div>

                    {/* Score Analysis */}
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-subtext mb-3 flex items-center gap-2">
                          <Code size={14} className="text-primary" />
                          Agent Matching Score
                        </h3>

                        {selectedCandidate.score_status === 'scored' && selectedCandidate.scored_data ? (
                          <div className="p-6 bg-card border border-theme rounded-2xl shadow-sm space-y-6">
                            <div className="text-center pb-6 border-b border-theme">
                              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-primary/20 p-2 mb-2">
                                <div className="w-full h-full rounded-full bg-primary/10 flex flex-col items-center justify-center">
                                  <span className="text-2xl font-black text-primary leading-none">{selectedCandidate.scored_data.overall_score}%</span>
                                  <span className="text-[10px] font-bold text-primary/60 uppercase mt-1">Match</span>
                                </div>
                              </div>
                              <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedCandidate.scored_data.recommended ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {selectedCandidate.scored_data.recommended ? <CheckCircle2 size={12} /> : <Info size={12} />}
                                {selectedCandidate.scored_data.recommended ? 'Recommended' : 'Needs Review'}
                              </div>
                            </div>

                            <div className="space-y-4">
                              {Object.entries(selectedCandidate.scored_data.category_scores).map(([key, details]) => (
                                <div key={key} className="space-y-1.5 group">
                                  <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-bold uppercase text-subtext group-hover:text-text transition-colors">{key.replace(/_/g, ' ')}</span>
                                    <span className="text-xs font-bold text-primary">{details.score}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-theme">
                                    <div
                                      className="h-full bg-primary rounded-full transition-all duration-1000"
                                      style={{ width: `${details.score}%` }}
                                    />
                                  </div>
                                  <p className="text-[10px] text-subtext leading-relaxed mt-1 line-clamp-2 hover:line-clamp-none transition-all duration-300 px-1 cursor-default">
                                    {details.explanation}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {selectedCandidate.scored_data.adaptation_applied && (
                              <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20 text-[10px] text-blue-600 dark:text-blue-400 italic">
                                Adaptive scoring applied: {selectedCandidate.scored_data.adaptation_reason}
                              </div>
                            )}
                          </div>
                        ) : selectedCandidate.score_status === 'failed' ? (
                          <div className="p-8 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                              <XCircle className="text-red-600 dark:text-red-400" size={24} />
                            </div>
                            <p className="text-sm font-bold text-red-700 dark:text-red-400">Scoring Failed</p>
                            <p className="text-xs text-red-600/70 dark:text-red-400/60 mt-2 leading-relaxed">
                              {selectedCandidate.scored_error || "The AI encountered an error while analyzing this candidate's resume."}
                            </p>
                          </div>
                        ) : (
                          <div className="p-12 bg-card border border-theme rounded-2xl text-center">
                            <div className="w-12 h-12 rounded-full bg-bg border border-theme flex items-center justify-center mx-auto mb-3">
                              <Clock className="text-subtext animate-spin" size={20} />
                            </div>
                            <p className="text-sm font-medium text-text">Scoring in Progress</p>
                            <p className="text-xs text-subtext mt-1">Please wait while the AI analyzes the fit.</p>
                          </div>
                        )}
                      </section>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'resume' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

                  {/* Left Column: Experience & Projects */}
                  <div className="lg:col-span-8 space-y-8">

                    {/* Work Experience */}
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Briefcase size={18} className="text-primary" />
                        <h3 className="font-bold text-lg">Work Experience</h3>
                      </div>
                      <div className="space-y-4">
                        {selectedCandidate.candidate_data.work_experience.length > 0 ? (
                          selectedCandidate.candidate_data.work_experience.map((work, idx) => (
                            <div key={idx} className="relative pl-6 pb-6 border-l-2 border-theme last:pb-0">
                              <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-card" />
                              <div className="p-5 bg-card border border-theme rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-bold text-base text-text">{work.job_title}</h4>
                                    <p className="text-primary font-medium text-sm">{work.company}</p>
                                  </div>
                                  <span className="text-[10px] font-bold bg-bg px-2.5 py-1 rounded-full border border-theme text-subtext">
                                    {work.start_date} — {work.end_date || 'Present'}
                                  </span>
                                </div>
                                <ul className="mt-4 space-y-2">
                                  {work.responsibilities.map((resp, i) => (
                                    <li key={i} className="text-xs text-text/70 flex gap-2 leading-relaxed">
                                      <span className="text-primary mt-1 shrink-0">•</span>
                                      {resp}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 bg-card border border-theme rounded-2xl text-subtext italic text-sm">No work experience provided.</div>
                        )}
                      </div>
                    </section>

                    {/* Projects */}
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Code size={18} className="text-primary" />
                        <h3 className="font-bold text-lg">Key Projects</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedCandidate.candidate_data.projects.length > 0 ? (
                          selectedCandidate.candidate_data.projects.map((proj, idx) => (
                            <div key={idx} className="p-5 bg-card border border-theme rounded-2xl flex flex-col h-full shadow-sm hover:border-primary/30 transition-colors">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-sm text-text">{proj.name}</h4>
                                <div className="flex gap-1.5">
                                  {proj.github && proj.github !== "null" && <a href={proj.github} target="_blank" className="text-subtext hover:text-primary"><Github size={14} /></a>}
                                  {proj.live_demo && proj.live_demo !== "null" && <a href={proj.live_demo} target="_blank" className="text-subtext hover:text-primary"><ExternalLink size={14} /></a>}
                                </div>
                              </div>
                              <p className="text-[11px] text-subtext leading-relaxed flex-1 line-clamp-3 group-hover:line-clamp-none transition-all">
                                {proj.description.join(' ')}
                              </p>
                              <div className="mt-4 flex flex-wrap gap-1.5">
                                {proj.tech_stack.map((tech, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-bold rounded-lg border border-primary/10">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 p-6 bg-card border border-theme rounded-2xl text-subtext italic text-sm text-center">No projects listed.</div>
                        )}
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Skills, Education, Certs */}
                  <div className="lg:col-span-4 space-y-8">

                    {/* Technical Skills */}
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Code size={18} className="text-primary" />
                        <h3 className="font-bold text-lg">Technical Skills</h3>
                      </div>
                      <div className="p-6 bg-card border border-theme rounded-2xl space-y-6 shadow-sm">
                        {Object.entries(selectedCandidate.candidate_data.technical_skills.skills).map(([category, skills]) => (
                          <div key={category} className="space-y-2.5">
                            <h4 className="text-[10px] font-black uppercase text-subtext tracking-widest">{category}</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {skills.map((skill, i) => (
                                <span key={i} className="px-2.5 py-1 bg-bg border border-theme rounded-xl text-xs font-medium text-text/80 hover:border-primary/30 transition-colors">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Education */}
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <GraduationCap size={18} className="text-primary" />
                        <h3 className="font-bold text-lg">Education</h3>
                      </div>
                      <div className="space-y-3">
                        {selectedCandidate.candidate_data.education.map((edu, idx) => (
                          <div key={idx} className="p-4 bg-card border border-theme rounded-2xl shadow-sm">
                            <h4 className="font-bold text-sm text-text">{edu.degree}</h4>
                            <p className="text-primary text-xs font-medium">{edu.institution}</p>
                            <p className="text-[10px] text-subtext mt-1">
                              {edu.start_year && edu.end_year ? `${edu.start_year} — ${edu.end_year}` : edu.end_year || edu.location}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Certifications */}
                    {selectedCandidate.candidate_data.certifications.length > 0 && (
                      <section>
                        <div className="flex items-center gap-2 mb-4">
                          <Award size={18} className="text-primary" />
                          <h3 className="font-bold text-lg">Certifications</h3>
                        </div>
                        <div className="space-y-2">
                          {selectedCandidate.candidate_data.certifications.map((cert, idx) => (
                            <div key={idx} className="p-3 bg-card border border-theme rounded-2xl flex gap-3 items-center shadow-sm">
                              <Award className="text-amber-500 shrink-0" size={16} />
                              <span className="text-xs font-medium text-text/80 leading-snug">{cert}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Achievements / Additional */}
                    {selectedCandidate.candidate_data.additional_sections.map((section, idx) => (
                      <section key={idx}>
                        <div className="flex items-center gap-2 mb-4">
                          <Info size={18} className="text-primary" />
                          <h3 className="font-bold text-lg">{section.title}</h3>
                        </div>
                        <div className="p-5 bg-card border border-theme rounded-2xl shadow-sm">
                          <ul className="space-y-3">
                            {section.description.map((desc, i) => (
                              <li key={i} className="text-xs text-text/70 flex gap-2 leading-relaxed">
                                <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                                {desc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'comms' && (
                <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2 mb-6">
                    <MessageSquare size={18} className="text-primary" />
                    <h3 className="font-bold text-lg">Conversation History</h3>
                  </div>

                  <div className="space-y-4">
                    {selectedCandidate.conversations && selectedCandidate.conversations.length > 0 ? (
                      selectedCandidate.conversations.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm border ${msg.sender === 'ai'
                            ? 'bg-card border-theme text-text rounded-tl-none'
                            : 'bg-primary border-primary text-white rounded-tr-none'
                            }`}>
                            <div className={`flex items-center gap-2 mb-2 ${msg.sender === 'ai' ? 'text-primary' : 'text-white/70'}`}>
                              <span className="text-[10px] font-black uppercase tracking-widest">
                                {msg.sender === 'ai' ? 'Recruiter AI' : 'Candidate'}
                              </span>
                              <span className="text-[10px]">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div
                              className={`text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none ${msg.sender === 'ai' ? 'text-text/80' : 'text-white'}`}
                              dangerouslySetInnerHTML={{ __html: msg.content }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-20 bg-card border border-theme rounded-2xl border-dashed">
                        <div className="w-16 h-16 bg-bg border border-theme rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageSquare size={24} className="text-subtext" />
                        </div>
                        <h4 className="font-bold text-text">No messages yet</h4>
                        <p className="text-sm text-subtext mt-1 max-w-xs mx-auto">
                          Communication will appear here once the agent begins outreach or interview scheduling.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-theme bg-surface/50 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-6 py-2.5 rounded-xl border border-theme text-sm text-subtext hover:bg-bg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  )
};

