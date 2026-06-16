"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Users, Send, MessageSquare, Calendar, User, Search, Filter, Loader2 } from "lucide-react";
import { useGetAllAgents } from "@/hooks/useGetAllAgents";
// import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function SessionsPage() {
    const { data, isLoading, isError, error } = useGetAllAgents();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [stateFilter, setStateFilter] = useState("All");

    const filtered = useMemo(() => {
        if (!data?.result) return [];
        return data.result
            .filter((s) => {
                const matchSearch =
                    s.job_title.toLowerCase().includes(search.toLowerCase()) ||
                    s.agent_id.toString().includes(search.toLowerCase());

                const matchStatus = statusFilter === "All" || s.status === statusFilter;
                const matchState = stateFilter === "All" || s.state === stateFilter;

                return matchSearch && matchStatus && matchState;
            })
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [data, search, statusFilter, stateFilter]);

    const statusBadgeColor: Record<string, string> = {
        outreaching: "bg-blue-50 text-blue-600 border-blue-100",
        'resume-screening': "bg-amber-50 text-amber-600 border-amber-100",
        shortlisting: "bg-purple-50 text-purple-600 border-purple-100",
        'interview-scheduling': "bg-orange-50 text-orange-600 border-orange-100",
        completed: "bg-green-50 text-green-600 border-green-100",
        paused: "bg-yellow-50 text-yellow-600 border-yellow-100",
    };

    const stateBadgeColor: Record<string, string> = {
        active: "bg-emerald-500 text-white shadow-emerald-200/50",
        pending: "bg-slate-500 text-white shadow-slate-200/50",
        paused: "bg-amber-500 text-white shadow-amber-200/50",
        stopped: "bg-rose-500 text-white shadow-rose-200/50",
        completed: "bg-sky-500 text-white shadow-sky-200/50",
    };

    const AgentCardSkeleton = () => (
        <div className="p-6 rounded-2xl bg-card border border-theme shadow-sm animate-pulse">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-5 bg-border rounded-lg w-48 opacity-50" />
                        <div className="flex gap-1.5">
                            <div className="h-4 bg-border rounded-md w-12 opacity-30" />
                            <div className="h-4 bg-border rounded-md w-20 opacity-30" />
                        </div>
                    </div>
                    <div className="h-3 bg-border rounded-full w-32 opacity-20" />
                </div>
                <div className="flex gap-4 md:gap-8 lg:border-l border-theme lg:pl-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-2 bg-border rounded-full w-12 opacity-20" />
                            <div className="h-4 bg-border rounded-md w-8 opacity-40" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (isError) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-4">
                <p className="font-semibold text-lg mb-1">Error Fetching Sessions</p>
                <p className="text-sm opacity-80">{error instanceof Error ? error.message : "Something went wrong"}</p>
            </div>
            <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
                Try Again
            </button>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-theme pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">AI Hiring Sessions</h1>
                    <p className="text-sm text-subtext mt-1">Monitor and manage your active recruitment agents</p>
                </div>

                <Link href="/agent/new" className="px-5 py-2.5 bg-primary text-white text-sm rounded-xl flex items-center gap-2 hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                    <Plus size={18} /> New Session
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext" size={18} />
                    <input
                        type="text"
                        placeholder="Search by job title or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme outline-none text-sm bg-bg hover:border-primary/30 focus:border-primary transition-colors shadow-sm"
                    />
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        {/* <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext" size={16} /> */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-3 pr-8 py-2.5 select-theme rounded-xl border border-theme bg-bg text-sm appearance-none outline-none hover:border-primary/30 focus:border-primary transition-colors cursor-pointer shadow-sm min-w-32"
                        >
                            <option value="All">Step: All</option>
                            <option value="resume-screening">Screening</option>
                            <option value="shortlisting">Shortlisting</option>
                            <option value="outreaching">Outreach</option>
                            <option value="interview-scheduling">Scheduling</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="relative">
                        {/* <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/20" /> */}
                        <select
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                            className="pl-5  py-2.5 select-theme rounded-xl border border-theme bg-bg text-sm appearance-none outline-none hover:border-primary/30 focus:border-primary transition-colors cursor-pointer shadow-sm min-w-32"
                        >
                            <option value="All">State: All</option>
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="stopped">Stopped</option>
                            <option value="completed">Finished</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* SESSIONS LIST */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <AgentCardSkeleton key={i} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-card/50 rounded-3xl border border-theme border-dashed">
                    <div className="w-16 h-16 bg-bg border border-theme rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users size={24} className="text-subtext" />
                    </div>
                    <h3 className="text-lg font-bold text-text">No sessions found</h3>
                    <p className="text-sm text-subtext mt-1 max-w-xs mx-auto">
                        {search || statusFilter !== 'All' || stateFilter !== 'All'
                            ? "Try adjusting your filters or search terms to find what you're looking for." 
                            : "Get started by creating your first recruitment session."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map((s) => (
                        <Link
                            key={s.agent_id}
                            href={`/agent/${s.agent_id}`}
                            className="group relative p-6 rounded-2xl bg-card border border-theme shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden"
                        >
                            {/* Status Accent Line */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.state === 'active' ? 'bg-emerald-500' : 'bg-slate-300 opacity-50'}`} />
                            
                            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
                                {/* LEFT SIDE: Info & Current Stage */}
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-3">
                                            <h2 className="font-bold text-lg">{s.job_title}</h2>
                                            <span className={`px-2 py-0.5 text-[9px] uppercase rounded-full  ${stateBadgeColor[s.state] || 'bg-slate-100 text-slate-600'}`}>
                                                {s.state}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-subtext font-medium flex items-center gap-1.5 opacity-80">
                                            <Calendar size={12} />
                                            Started {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-theme rounded-xl">
                                            <span className="text-[10px] font-black text-subtext">Current Process</span>
                                            <div className="w-1 h-1 rounded-full bg-border" />
                                            <span className={`text-[11px] font-bold ${statusBadgeColor[s.status]?.split(' ')[1] || 'text-text'}`}>
                                                {s.status.replace('-', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT SIDE: PERFORMANCE STATS */}
                                <div className="flex flex-wrap items-center gap-4 sm:gap-10 lg:border-l border-theme lg:pl-10">
                                    <div className="min-w-20 space-y-1">
                                        <div className="flex items-center gap-2 text-subtext/60">
                                            <Users size={14} className="text-blue-500/70" />
                                            <span className="text-[11px] text-subtext font-medium mt-1">Candidates</span>
                                        </div>
                                        <p className="text-lg font-black tracking-tight text-center">{s.total_candidates} </p>
                                    </div>

                                    <div className="min-w-20 space-y-1">
                                        <div className="flex items-center gap-2 text-subtext/60">
                                            <User size={14} className="text-purple-500/70" />
                                            <span className="text-[11px] text-subtext font-medium mt-1">Shortlist</span>
                                        </div>
                                        <p className="text-lg font-black tracking-tight text-purple-600/90 text-center">{s.shortlisted_candidates}</p>
                                    </div>

                                    <div className="min-w-20 space-y-1">
                                        <div className="flex items-center gap-2 text-subtext/60">
                                            <Send size={14} className="text-green-600/70" />
                                            <span className="text-[11px] text-subtext font-medium mt-1">Outreach</span>
                                        </div>
                                        <p className="text-lg font-black tracking-tight text-green-600/90 text-center">{s.outreach_sent}</p>
                                    </div>

                                    <div className="min-w-20 space-y-1">
                                        <div className="flex items-center gap-2 text-subtext/60">
                                            <Calendar size={14} className="text-orange-500/70" />
                                            <span className="text-[11px] text-subtext font-medium mt-1">Interviews</span>
                                        </div>
                                        <p className="text-lg font-black tracking-tight text-orange-600/90 text-center">{s.interviews_scheduled}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

