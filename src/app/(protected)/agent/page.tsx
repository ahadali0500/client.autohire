"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Users, Send, MessageSquare, Calendar, User } from "lucide-react";

export default function SessionsPage() {
    const sessions = [
        {
            id: "sess-001",
            title: "Senior Data Engineer",
            started: "Nov 25, 03:00 PM",
            resumes: "18/40",
            shortlisted: 12,
            outreach: 8,
            conversations: 3,
            status: "Running",
        },
        {
            id: "sess-002",
            title: "Product Manager",
            started: "Nov 24, 07:00 PM",
            resumes: "35/35",
            shortlisted: 22,
            outreach: 20,
            conversations: 10,
            status: "Completed",
        },
        {
            id: "sess-003",
            title: "Full Stack Developer",
            started: "Nov 23, 02:00 PM",
            resumes: "22/50",
            shortlisted: 10,
            outreach: 9,
            conversations: 2,
            status: "Paused",
        },
    ];

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const filtered = useMemo(() => {
        return sessions.filter((s) => {
            const matchSearch =
                s.title.toLowerCase().includes(search.toLowerCase()) ||
                s.id.toLowerCase().includes(search.toLowerCase());

            const matchFilter = filter === "All" || s.status === filter;

            return matchSearch && matchFilter;
        });
    }, [search, filter]);

    const badgeColor = {
        Running: "bg-blue-100 text-blue-600",
        Completed: "bg-green-100 text-green-600",
        Paused: "bg-yellow-100 text-yellow-600",
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-semibold">Sessions</h1>
                    <p className="text-sm text-subtext">Track all your hiring assistant sessions</p>
                </div>

                <Link href="/agent/new" className="px-4 py-2 bg-primary text-white text-sm rounded-lg flex items-center gap-2 hover:bg-primary/90">
                    <Plus size={16} /> New Session
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Search sessions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-theme outline-none text-sm bg-bg"
                />

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 select-theme rounded-lg border border-theme bg-bg text-sm"
                >
                    <option value="All">All Sessions</option>
                    <option value="Running">Running</option>
                    <option value="Completed">Completed</option>
                    <option value="Paused">Paused</option>
                </select>
            </div>

            {/* SESSIONS LIST */}
            <div className="space-y-4">
                {filtered.map((s) => (
                    <Link
                        key={s.id}
                        href={`/agent/${s.id}`}
                        className="block p-5 rounded-xl bg-card shadow-sm hover:shadow-md transition"
                    >
                        {/* HEADER ROW */}
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <h2 className="font-medium text-md">{s.title}</h2>
                                <p className="text-xs text-subtext">ID: {s.id}</p>
                            </div>

                            <span
                                className={`px-3 py-1 text-xs rounded-full font-medium ${badgeColor[s.status]}`}
                            >
                                {s.status}
                            </span>
                        </div>

                        {/* MINI STATS ROW */}
                        <div className="flex flex-wrap gap-6 text-xs">

                            <div className="flex items-center gap-2 text-subtext">
                                <Calendar size={14} />
                                <span>{s.started}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-blue-500" />
                                <span>{s.resumes} candidates</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <User size={14} className="text-purple-500" />
                                <span>{s.shortlisted} shortlisted</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Send size={14} className="text-green-600" />
                                <span>{s.outreach} outreach</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <MessageSquare size={14} className="text-orange-500" />
                                <span>{s.conversations} conversations</span>
                            </div>

                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
