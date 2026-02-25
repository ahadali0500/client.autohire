"use client";

import { useState } from "react";

export default function AgentDetailPage() {
  // -----------------------------------------------------
  // Sample Data (replace with your actual API data later)
  // -----------------------------------------------------
  const candidateList = [
    {
      id: "c1",
      name: "Sarah Johnson",
      resumeScore: 92,
      screeningScore: 88,
      status: "Strong",
      skills: ["Python", "SQL"],
    },
    {
      id: "c2",
      name: "Michael Chen",
      resumeScore: 78,
      screeningScore: 82,
      status: "Medium",
      skills: ["Python", "PostgreSQL"],
    },
    {
      id: "c3",
      name: "Emily Rodriguez",
      resumeScore: 88,
      screeningScore: 91,
      status: "Strong",
      skills: ["Python", "Pandas"],
    },
  ];

  const [selectedCandidate, setSelectedCandidate] = useState(candidateList[0]);

  const logs = [
    "Created job profile from JD",
    "Processed resume 5/40",
    "Shortlisted 8 candidates above score 75",
    "Sent outreach to candidate Sarah Johnson",
    "Chat started with candidate Emily",
    "Interview scheduled for Friday 4 PM",
  ];

  // Status Badge Colors
  const statusColor = {
    Running: "bg-blue-100 text-blue-600",
    Paused: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="max-w-[1400px] mx-auto p-5 space-y-6">

      {/* --------------------------------------------- */}
      {/* HEADER */}
      {/* --------------------------------------------- */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Senior Data Engineer</h1>
          <span className={`px-3 py-1 rounded-full text-sm ${statusColor["Running"]}`}>
            Running
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            Pause
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Stop
          </button>
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* TOP STATS + SETTINGS */}
      {/* --------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* STATS BOX */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-theme bg-card space-y-6">

          <div className="grid grid-cols-4 text-center">
            <StatBox label="RESUMES" value="18" sub="of 40" />
            <StatBox label="CONTACTED" value="12" />
            <StatBox label="SCREENING" value="8" />
            <StatBox label="INTERVIEWS" value="3" />
          </div>

          <div className="grid grid-cols-3">
            <InfoBox label="Channels" value="Email, WhatsApp" />
            <InfoBox label="Min Score" value="70%" />
            <InfoBox label="Max Candidates" value="20" />
          </div>
        </div>

        {/* SETTINGS SUMMARY */}
        <div className="p-6 rounded-xl border border-theme bg-card space-y-4">
          <h2 className="font-semibold text-md">Agent Settings</h2>
          <SettingItem label="Job Title" value="Senior Data Engineer" />
          <SettingItem label="Min Score" value="70%" />
          <SettingItem label="Channels" value="Email, WhatsApp" />
          <SettingItem label="Resume Limit" value="40 resumes" />
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* MAIN CONTENT SPLIT: LOGS + CANDIDATES SIDEBAR */}
      {/* --------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT (LOGS + PIPELINE + DETAIL) */}
        <div className="col-span-2 space-y-6">

          {/* LIVE LOGS */}
          <div className="p-6 rounded-xl border border-theme bg-card h-[250px] overflow-y-auto">
            <h2 className="font-semibold mb-3">Live Activity</h2>

            <div className="space-y-2 text-sm">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-primary">●</span>
                  <p>{log}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CANDIDATE DETAIL PANEL */}
          <div className="p-6 rounded-xl border border-theme bg-card space-y-4">
            <h2 className="font-semibold text-md">
              Candidate Details: {selectedCandidate.name}
            </h2>

            {/* SCORES */}
            <div className="grid grid-cols-3 text-center">
              <ScoreBox label="Resume Score" value={selectedCandidate.resumeScore} />
              <ScoreBox label="Screening Score" value={selectedCandidate.screeningScore} />
              <ScoreBox label="Final Match" value={Math.round((selectedCandidate.resumeScore + selectedCandidate.screeningScore) / 2)} />
            </div>

            {/* SKILLS */}
            <div>
              <h3 className="font-medium mb-1">Skills</h3>
              <div className="flex gap-2 flex-wrap">
                {selectedCandidate.skills.map((s) => (
                  <span key={s} className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* CHAT TRANSCRIPT MOCK */}
            <div className="mt-4">
              <h3 className="font-medium mb-1">Screening Conversation</h3>

              <div className="h-[180px] p-3 rounded-lg border bg-bg overflow-y-auto space-y-3 text-sm">
                <ChatBubble sender="agent" text="Hi Sarah, thanks for applying! Can you describe your last project?" />
                <ChatBubble sender="candidate" text="Sure! I worked on a financial insight dashboard using Python & SQL." />
                <ChatBubble sender="agent" text="Great! How many years of experience do you have?" />
                <ChatBubble sender="candidate" text="Around 4 years." />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR - CANDIDATES LIST */}
        <div className="p-6 rounded-xl border border-theme bg-card h-[650px] overflow-y-auto">
          <div className="sticky top-0 bg-card pb-3">
            <input
              type="text"
              placeholder="Search candidates..."
              className="w-full px-3 py-2 rounded-lg border border-theme focus:outline-none"
            />
          </div>

          <div className="mt-3 space-y-4">
            {candidateList.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCandidate(c)}
                className="p-4 rounded-lg border border-theme hover:bg-hover-bg cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{c.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      c.status === "Strong"
                        ? "bg-green-100 text-green-700"
                        : c.status === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <p className="text-xs mt-1">
                  Resume {c.resumeScore}% • Screening {c.screeningScore}%
                </p>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {c.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ------------------------------------------ */
/* SMALL REUSABLE COMPONENTS */
/* ------------------------------------------ */

const StatBox = ({ label, value, sub }: any) => (
  <div>
    <p className="text-xs text-subtext">{label}</p>
    <h3 className="text-2xl font-semibold">{value}</h3>
    {sub && <p className="text-xs text-subtext">{sub}</p>}
  </div>
);

const InfoBox = ({ label, value }: any) => (
  <div>
    <p className="text-xs text-subtext">{label}</p>
    <p className="text-md">{value}</p>
  </div>
);

const SettingItem = ({ label, value }: any) => (
  <div className="text-sm">
    <p className="text-subtext text-xs">{label}</p>
    <p>{value}</p>
  </div>
);

const ScoreBox = ({ label, value }: any) => (
  <div>
    <p className="text-xs text-subtext">{label}</p>
    <h3 className="text-xl font-semibold">{value}%</h3>
  </div>
);

const ChatBubble = ({ sender, text }: any) => (
  <div className={`p-2 rounded-lg max-w-[80%] ${sender === "agent" ? "bg-primary/10 self-start" : "bg-surface self-end"}`}>
    <p className="text-sm">{text}</p>
  </div>
);
