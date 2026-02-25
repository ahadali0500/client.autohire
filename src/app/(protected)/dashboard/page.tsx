"use client";

import {
  Users,
  Send,
  MessageSquare,
  Calendar,
  Bot,
  Activity,
  BarChart3,
  Play,
  Pause,
  Square,
  Zap,
  ChevronRight,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

const badgeColor = {
  Running: "bg-blue-100 text-blue-600",
  Completed: "bg-green-100 text-green-600",
  Paused: "bg-yellow-100 text-yellow-600",
};

export default function SystemDashboard() {

  const activityFeed = [
    "John Doe replied to outreach (Data Analyst)",
    "AI Agent screened 12 new resumes",
    "Interview scheduled for DevOps position",
    "Outreach sent to 15 new candidates",
  ];

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

      <MetricGrid />

      <div className="flex gap-2">
        <div className="flex-1 bg-card border border-theme rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity size={18} /> Live Activity Feed
          </h2>

          <div className="space-y-2">
            {activityFeed.map((item, i) => (
              <p key={i} className="text-sm p-2 bg-surface rounded-lg border border-theme">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sessions.map((s) => (
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
function MetricGrid() {
  const metrics = [
    { label: "Total Candidates", value: "4,320", icon: <Users /> },
    { label: "Outreach Sent", value: "1,890", icon: <Send /> },
    { label: "Conversations", value: "640", icon: <MessageSquare /> },
    { label: "Interviews", value: "27", icon: <Calendar /> },
    { label: "Agents Running", value: "5", icon: <Bot /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="p-4 bg-card border border-theme rounded-xl hover:shadow-lg transition-all"
        >
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

/* ============================================================
   CHART (simple animated bars)
============================================================ */
function Chart({ data }) {
  return (
    <div className="flex items-end gap-2 h-48">
      {data.map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-primary/40 rounded-t-lg transition-all"
          style={{ height: `${h}%` }}
        ></div>
      ))}
    </div>
  );
}

/* ============================================================
   AGENT CONTROLS (play/pause/stop)
============================================================ */
function AgentControls({ agent }) {
  return (
    <div className="flex gap-2 mt-3">
      <button className="px-3 py-1 text-xs bg-primary text-white rounded-lg flex items-center gap-1">
        <Play size={14} /> Start
      </button>
      <button className="px-3 py-1 text-xs bg-yellow-500 text-white rounded-lg flex items-center gap-1">
        <Pause size={14} /> Pause
      </button>
      <button className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg flex items-center gap-1">
        <Square size={14} /> Stop
      </button>
    </div>
  );
}

/* ============================================================
   AGENT DETAIL SIDE PANEL
============================================================ */
function AgentSidePanel({ agent, onClose }) {
  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-card border-l border-theme p-6 shadow-xl z-50 animate-slide-left">
      <button onClick={onClose} className="text-xs text-subtext mb-4">Close</button>

      <h2 className="text-lg font-semibold mb-2">{agent.name}</h2>

      <p className="text-sm mb-4">
        Status:{" "}
        <span className={agent.status === "Running" ? "text-green-500" : "text-yellow-500"}>
          {agent.status}
        </span>
      </p>

      <div className="space-y-3">
        <p className="text-sm p-2 bg-surface rounded-lg border border-theme">
          Candidates processed: {agent.candidates}
        </p>
        <p className="text-sm p-2 bg-surface rounded-lg border border-theme">
          Outreach sent: {agent.outreach}
        </p>
        <p className="text-sm p-2 bg-surface rounded-lg border border-theme">
          Conversations: {agent.conversations}
        </p>
        <p className="text-sm p-2 bg-surface rounded-lg border border-theme">
          Pipeline progress: {agent.progress}%
        </p>
      </div>
    </div>
  );
}
