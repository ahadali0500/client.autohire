"use client";

import { useState, useMemo } from "react";
import { Pause, Ban } from "lucide-react";
import AgentPipeline from "./AgentPipeline";

interface Candidate {
    id: string;
    name: string;
    statusText: string;
    strength: "Strong" | "Medium" | "Weak";
    resumeScore: number;
    screeningScore: number;
    skills: string[];
    stage: "shortlisted" | "outreached" | "scheduled";
}

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

export default function AgentSessionPage() {
    const [search, setSearch] = useState("");
    const [scoreFilter, setScoreFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [topFive, setTopFive] = useState(false);
    const [stageFilter, setStageFilter] = useState("All");

    const [phase, setPhase] = useState(1);

    const steps = [
        { id: 1, label: "Resume Screening", status: "completed" },
        { id: 2, label: "Shortlisting", status: "completed" },
        { id: 3, label: "Outreach", status: "running" },
        { id: 4, label: "AI Chat", status: "pending" },
        { id: 5, label: "Interviews", status: "pending" },
        { id: 6, label: "Summary", status: "pending" },
    ];

    const candidates: Candidate[] = [
        {
            id: "c1",
            name: "Sarah Johnson",
            statusText: "interview scheduled",
            stage: "scheduled",
            strength: "Strong",
            resumeScore: 92,
            screeningScore: 88,
            skills: ["Python", "SQL"],
        },
        {
            id: "c2",
            name: "Michael Chen",
            statusText: "screening complete",
            stage: "outreached",
            strength: "Medium",
            resumeScore: 78,
            screeningScore: 82,
            skills: ["Python", "PostgreSQL"],
        },
        {
            id: "c3",
            name: "Emily Rodriguez",
            statusText: "interview scheduled",
            stage: "scheduled",
            strength: "Strong",
            resumeScore: 88,
            screeningScore: 91,
            skills: ["Python", "Data Analysis"],
        },
        {
            id: "c4",
            name: "Amit Sharma",
            statusText: "pending screening",
            stage: "shortlisted",
            strength: "Weak",
            resumeScore: 60,
            screeningScore: 55,
            skills: ["Excel"],
        },
    ];


    const phaseCandidates = useMemo(() => {
        switch (phase) {
            case 1: // Resume Screening
                return candidates;

            case 2: // Shortlisting
                return candidates.filter((c) => c.resumeScore >= 75);

            case 3: // Outreach
                return candidates.filter((c) =>
                    ["screening complete", "interview scheduled"].includes(
                        c.statusText.toLowerCase()
                    )
                );

            case 4: // AI Chat Screening
                return candidates.filter((c) => c.screeningScore > 0);

            case 5: // Interviews
                return candidates.filter((c) =>
                    c.statusText.toLowerCase().includes("interview")
                );

            case 6: // Final summary
                return candidates;

            default:
                return candidates;
        }
    }, [phase]);


    const filteredCandidates = useMemo(() => {
        let list = [...phaseCandidates];

        if (search.trim()) {
            list = list.filter(
                (c) =>
                    c.name.toLowerCase().includes(search.toLowerCase()) ||
                    c.skills.some((s) =>
                        s.toLowerCase().includes(search.toLowerCase())
                    )
            );
        }

        return list;
    }, [
        search,
        scoreFilter,
        statusFilter,
        stageFilter,
        topFive,
        phaseCandidates,
    ]);



    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const openCandidate = (candidate: any) => {
        setSelectedCandidate(candidate);
    };


    const outreachData: Record<string, { time: string; message: string }> = {
        c1: {
            time: "Jan 12, 2025 • 3:42 PM via Email",
            message:
                "Hi Sarah, your profile looks promising for the Senior Data Engineer role. Can you confirm your availability for a quick AI screening?",
        },
        c2: {
            time: "Jan 12, 2025 • 4:10 PM via WhatsApp",
            message:
                "Hi Michael, thanks for applying! We'd like to begin a short screening conversation with you.",
        },
        c3: {
            time: "Jan 12, 2025 • 2:15 PM via Email",
            message:
                "Hi Emily, we'd like to quickly screen your profile for the Senior Data Engineer position.",
        },
        c4: {
            time: "Not contacted yet",
            message: "",
        },
    };

    // Chat messages per candidate
    const conversationData: Record<
        string,
        { sender: "candidate" | "agent"; time: string; text: string }[]
    > = {
        c1: [
            {
                sender: "candidate",
                time: "3:51 PM",
                text: "Hi! Yes I am available. What is the next step?",
            },
            {
                sender: "agent",
                time: "3:52 PM",
                text:
                    "Great! I will ask a few quick questions. First: How many years have you worked with Python?",
            },
            {
                sender: "candidate",
                time: "3:53 PM",
                text: "Around 4+ years. Mostly with data pipelines and analytics work.",
            },
            {
                sender: "agent",
                time: "3:54 PM",
                text: "Good. What tools have you used for pipeline orchestration?",
            },
        ],

        c2: [
            {
                sender: "agent",
                time: "4:12 PM",
                text: "Hi Michael! Are you available for a quick AI screening?",
            },
        ],

        c3: [
            {
                sender: "candidate",
                time: "2:20 PM",
                text: "Yes I'm available!",
            },
        ],

        c4: [],
    };




    return (
        <>
            <div className="max-w-6xl mx-auto p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold">Senior Data Engineer</h1>

                    <div className="flex items-center gap-3">
                        <button className="flex gap-1 px-4 py-2 text-sm border border-theme rounded-lg hover-theme">
                            <Pause size={15} /> Pause
                        </button>
                        <button className="flex gap-1 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                            <Ban size={15} /> Stop
                        </button>
                    </div>
                </div>

                {/* PIPELINE */}
                <AgentPipeline
                    steps={steps}
                    selected={phase}
                    onSelect={(id) => setPhase(id)}
                />
            </div>

            <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="md:col-span-2 space-y-6">

                    <div className="border border-theme bg-card rounded-xl p-6 h-[330px] overflow-y-auto">
                        <h2 className="font-medium mb-4">Activity Log</h2>

                        <ul className="space-y-4 text-sm">
                            {candidates.map((c) => (
                                <li key={c.id}>
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                                        <div>
                                            <p className="font-medium">{c.name}</p>
                                            <p className="text-subtext text-xs">
                                                Resume score: {c.resumeScore}% • Screening:{" "}
                                                {c.screeningScore}%
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="space-y-4">

                    <div className="p-6 rounded-xl border border-theme bg-card space-y-4">
                        <h2 className="font-semibold text-md">Agent Settings</h2>
                        <SettingItem label="Job Title" value="Senior Data Engineer" />
                        <SettingItem label="Min Score" value="70%" />
                        <SettingItem label="Channels" value="Email" />
                        <SettingItem label="Maximum Candidates" value="40" />
                        <SettingItem label="Experience Range" value="4 years" />
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


                    <div className="flex flex-wrap gap-2 mt-2">
                        {["All", "shortlisted", "outreached", "conversation", "scheduled"].map(
                            (s) => (
                                <button key={s} onClick={() => setStageFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs capitalize ${stageFilter === s ? "bg-amber-400 text-white" : "bg-surface border border-theme text-subtext"}`}>
                                    {s === "All" ? "All Candidates" : s}
                                </button>
                            )
                        )}
                    </div>

                </div>


                <div className="space-y-4 pr-1">
                    {filteredCandidates.map((c) => (
                        <div
                            key={c.id}
                            className="p-4 border border-theme rounded-xl bg-card hover:shadow transition"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-sm">{c.name}</h3>
                                    <p className="text-xs text-subtext">{c.statusText}</p>
                                </div>

                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${strengthColor[c.strength]}`}>
                                    {c.strength}
                                </span>
                            </div>

                            <div className="flex justify-between mt-3 text-xs">
                                <div>
                                    <p className="text-subtext">Resume</p>
                                    <p className="font-medium">{c.resumeScore}%</p>
                                </div>

                                <div>
                                    <p className="text-subtext">Screening</p>
                                    <p className="font-medium">{c.screeningScore}%</p>
                                </div>
                            </div>

                            <div className="flex gap-2 flex-wrap mt-3">
                                {c.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-2 py-1 text-xs rounded-md bg-surface border border-theme"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => openCandidate(c)}
                                    className="px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary-hover"
                                >
                                    View Details →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {selectedCandidate && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">

                    <div className="w-full max-w-3xl bg-card rounded-xl border border-theme p-6 animate-fade-scale max-h-[92vh] overflow-y-auto">

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-semibold">{selectedCandidate.name}</h2>
                                <p className="text-xs text-subtext">{selectedCandidate.statusText}</p>
                            </div>

                            <button
                                onClick={() => setSelectedCandidate(null)}
                                className="text-subtext hover:text-text text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        {/* SECTION: SUMMARY */}
                        <div className="p-4 bg-surface border border-theme rounded-lg mb-6">
                            <p className="text-sm font-medium mb-1">Candidate Summary</p>
                            <p className="text-xs text-subtext leading-5">
                                Strong background in data engineering, ETL pipelines, cloud infrastructure, and analytical tooling.
                                Experienced with Python, SQL, and large-scale data workflows.
                                Demonstrates clear communication and structured thinking in chat.
                            </p>
                        </div>

                        {/* SECTION: CORE SCORES */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div>
                                <p className="text-xs text-subtext">Resume Score</p>
                                <p className="font-semibold text-lg">{selectedCandidate.resumeScore}%</p>
                            </div>

                            <div>
                                <p className="text-xs text-subtext">Screening Score</p>
                                <p className="font-semibold text-lg">{selectedCandidate.screeningScore}%</p>
                            </div>

                            <div>
                                <p className="text-xs text-subtext">Strength Category</p>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${strengthColor[selectedCandidate.strength]}`}
                                >
                                    {selectedCandidate.strength}
                                </span>
                            </div>
                        </div>

                        {/* SECTION: SKILLS */}
                        <div className="mb-6">
                            <p className="text-xs text-subtext mb-2">Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedCandidate.skills.map((s) => (
                                    <span
                                        key={s}
                                        className="px-2 py-1 border border-theme bg-surface text-xs rounded-md"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* SECTION: EXPERIENCE */}
                        <div className="mb-6">
                            <p className="text-xs text-subtext mb-2">Experience</p>

                            <div className="space-y-3">
                                <div className="p-3 bg-surface border border-theme rounded-lg">
                                    <p className="font-medium text-sm">Data Engineer – FinTech Solutions</p>
                                    <p className="text-xs text-subtext">2020 – Present</p>
                                    <p className="text-xs mt-1">
                                        Built ETL pipelines, automated workflows, managed Snowflake DB, and optimized query performance.
                                    </p>
                                </div>

                                <div className="p-3 bg-surface border border-theme rounded-lg">
                                    <p className="font-medium text-sm">Data Analyst – BlueTech</p>
                                    <p className="text-xs text-subtext">2018 – 2020</p>
                                    <p className="text-xs mt-1">
                                        Designed dashboards, wrote analytical SQL, and collaborated with engineering teams.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* SECTION: OUTREACH */}
                        <div className="mb-6">
                            <p className="text-xs text-subtext mb-1">Outreach Sent</p>

                            <p className="text-sm">
                                {outreachData[selectedCandidate.id]?.time ?? "Not contacted yet"}
                            </p>

                            {outreachData[selectedCandidate.id]?.message ? (
                                <div className="mt-2 p-3 bg-surface border border-theme rounded-lg">
                                    <p className="text-xs text-subtext mb-1">Message Sent</p>
                                    <p className="text-sm">{outreachData[selectedCandidate.id].message}</p>
                                </div>
                            ) : (
                                <div className="mt-2 p-3 bg-surface border border-theme rounded-lg text-xs text-subtext">
                                    No outreach message sent yet
                                </div>
                            )}
                        </div>

                        {/* SECTION: CHAT HISTORY */}
                        <div className="mb-6">
                            <p className="text-xs text-subtext mb-2">Conversation History</p>

                            {conversationData[selectedCandidate.id]?.length > 0 ? (
                                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                                    {conversationData[selectedCandidate.id].map((msg, i) => (
                                        <div key={i} className={`p-3 border border-theme rounded-lg ${msg.sender === "agent" ? "bg-blue-50 dark:bg-blue-900/20" : "bg-surface"}`}>
                                            <p className={`text-xs mb-1 ${msg.sender === "agent" ? "text-blue-600" : "text-subtext"}`}>
                                                {msg.sender === "agent" ? "AI Agent" : "Candidate"} • {msg.time}
                                            </p>
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-subtext">No conversation yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}


        </>
    );
}
