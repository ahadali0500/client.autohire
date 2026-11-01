"use client";

import {
  Users,
  Send,
  MessageSquare,
  Calendar,
  Bot,
  Activity,
  ChevronRight,
  User,
  Inbox,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useGetAllAgents } from "@/hooks/useGetAllAgents";
import { useDashboard } from "@/hooks/useDashboard";

type DashboardMetrics = {
  total_candidates?: number;
  outreach_sent?: number;
  conversations?: number;
  interviews?: number;
  agents_running?: number;
};

type DashboardLog = {
  text: string;
  timestamp: string;
  status: string;
};

export default function SystemDashboard() {
  const { data, isLoading } = useGetAllAgents();
  const agents = (data?.result || [])
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 3);


  const { data: dashboardData, isLoading: dashboardLoading } = useDashboard();
  const metrics = dashboardData?.metrics as DashboardMetrics | undefined;
  const logs = (dashboardData?.logs || []) as DashboardLog[];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">System Dashboard</h1>
          <p className="text-sm text-subtext">AI-powered hiring overview</p>
        </div>

        <button className="px-5 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover shadow-md hover:shadow-lg transition">
          + Start New Agent
        </button>
      </div>

      <MetricGrid metrics={metrics} />



      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {dashboardLoading ? (
          <p className="text-sm text-subtext">Loading activity...</p>
        ) : logs.length === 0 ? (
          <EmptyState
            icon={<Activity size={28} />}
            title="No activity found"
            description="Agent activity will appear here after you create and run an agent."
          />
        ) : (
          logs.slice(0, 6).map((log, i) => (
            <div
              key={i}
              className="text-sm p-2 bg-surface rounded-lg border border-theme flex justify-between items-start gap-2"
            >
              <div>
                <p className="font-medium">{log.text}</p>
                <span className="text-[10px] text-subtext">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>

              <span className={`
          text-[10px] px-2 py-0.5 rounded-full
          ${log.status === "SUCCESS" ? "bg-green-100 text-green-600" :
                  log.status === "STEP" ? "bg-blue-100 text-blue-600" :
                    "bg-slate-100 text-slate-600"}
        `}>
                {log.status}
              </span>
            </div>
          ))
        )}
      </div>


      <div className="space-y-4 mt-4">

        {isLoading ? (
          <p className="text-sm text-subtext">Loading agents...</p>
        ) : agents.length === 0 ? (
          <EmptyState
            icon={<Inbox size={28} />}
            title="No agents found"
            description="Start a new agent to begin screening candidates and tracking progress."
            action={
              <Link
                href="/agent/new"
                className="mt-2 inline-flex px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-hover transition"
              >
                Start New Agent
              </Link>
            }
          />
        ) : (
          agents.map((s) => (
            <Link
              key={s.agent_id}
              href={`/agent/${s.agent_id}`}
              className="group block relative p-6 rounded-2xl bg-card border border-theme shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden"
            >
              {/* LEFT ACCENT */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.state === 'running' ? 'bg-emerald-500' : 'bg-slate-300 opacity-50'}`} />

              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">

                {/* LEFT SIDE */}
                <div className="flex-1 space-y-2 min-w-0">

                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-lg truncate">{s.job_title}</h2>

                    <span className="px-2 py-0.5 text-[9px] uppercase rounded-full bg-slate-100 text-slate-600">
                      {s.state}
                    </span>
                  </div>

                  <p className="text-xs text-subtext flex items-center gap-2">
                    <Calendar size={12} />
                    {new Date(s.created_at).toLocaleDateString()}
                  </p>

                  <div className="text-xs font-semibold text-primary">
                    {s.status?.replaceAll('-', ' ')}
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex flex-wrap items-center gap-6 lg:border-l border-theme lg:pl-6">

                  <div className="min-w-[60px] text-center">
                    <Users size={14} className="mx-auto text-blue-500" />
                    <p className="font-bold">{s.total_candidates}</p>
                    <span className="text-[10px] text-subtext">Candidates</span>
                  </div>

                  <div className="min-w-[60px] text-center">
                    <User size={14} className="mx-auto text-purple-500" />
                    <p className="font-bold">{s.shortlisted_candidates}</p>
                    <span className="text-[10px] text-subtext">Shortlist</span>
                  </div>

                  <div className="min-w-[60px] text-center">
                    <Send size={14} className="mx-auto text-green-600" />
                    <p className="font-bold">{s.outreach_sent}</p>
                    <span className="text-[10px] text-subtext">Outreach</span>
                  </div>

                  <div className="min-w-[60px] text-center">
                    <Calendar size={14} className="mx-auto text-orange-500" />
                    <p className="font-bold">{s.interviews_scheduled}</p>
                    <span className="text-[10px] text-subtext">Interviews</span>
                  </div>

                </div>
              </div>
            </Link>
          ))
        )}

        {/* CTA */}
        {!isLoading && agents.length > 0 && (
          <div className="flex justify-center pt-2">
            <Link
              href="/agent"
              className="px-6 py-2.5 text-sm font-medium rounded-xl border border-theme hover:border-primary hover:text-primary transition-all flex items-center gap-2"
            >
              Show More
              <ChevronRight size={16} />
            </Link>
          </div>
        )}

      </div>

      {/* ----------------------------------------------
          ACTIVITY FEED
      ---------------------------------------------- */}


      {/* ----------------------------------------------
          SIDE PANEL FOR AGENT DETAILS
      ---------------------------------------------- */}
    </div>
  );
}

/* ============================================================
   BEAUTIFUL METRIC GRID
============================================================ */

function MetricGrid({ metrics }: { metrics?: DashboardMetrics }) {
  const data = [
    { label: "Total Candidates", value: metrics?.total_candidates || 0, icon: <Users /> },
    { label: "Outreach Sent", value: metrics?.outreach_sent || 0, icon: <Send /> },
    { label: "Conversations", value: metrics?.conversations || 0, icon: <MessageSquare /> },
    { label: "Interviews", value: metrics?.interviews || 0, icon: <Calendar /> },
    { label: "Agents Running", value: metrics?.agents_running || 0, icon: <Bot /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {data.map((m, i) => (
        <div key={i} className="p-4 bg-card border border-theme rounded-xl hover:shadow-lg transition-all">
          <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg mb-2">
            {m.icon}
          </div>

          <p className="text-xs text-subtext">{m.label}</p>
          <p className="text-xl font-semibold">{m.value}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-theme bg-surface/60 px-5 py-10 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="text-sm font-semibold text-text">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-subtext">
        {description}
      </p>
      {action}
    </div>
  );
}

