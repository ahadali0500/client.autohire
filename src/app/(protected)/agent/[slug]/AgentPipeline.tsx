"use client";

import { AgentStats } from "@/types/agent";
import {
  Users,
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
} from "lucide-react";

export interface Step {
  id: number;
  label: string;
  status: "completed" | "running" | "pending" | "failed";
}

export default function AgentPipeline({
  steps,
  stats,
  state
}: {
  steps: Step[];
  stats: AgentStats;
  state: 'pending' | 'running' | 'paused' | 'stopped' | 'completed';
}) {

  return (
    <>
      <div className="border border-theme bg-card rounded-xl p-5">
        <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-sm font-bold  text-subtext flex items-center gap-2">
                Pipeline Status
            </h3>
            <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                state === "running"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : state === "paused"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : state === "stopped"
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
            >
                {state}
            </span>
        </div>
        <div className="flex justify-between items-start">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center w-full cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${step.status === "completed"
                    ? "bg-green-100 text-green-600 border border-green-400"
                    : step.status === "running"
                      ? "bg-blue-100 text-blue-600 "
                      : "bg-gray-200 text-gray-500 border border-gray-300"
                  }
              `}
              >
                {step.status === "completed" && "✔"}
                {step.status === "running" && <span className="animate-breathing">⏳</span>}
                {step.status === "pending" && "•"}
              </div>

              <p className="text-xs mt-2 text-center font-medium">
                {step.label}
              </p>

            </div>
          ))}
        </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-5">

        <Card icon={<Users size={20} />} label="Total Candidates" value={stats.total_candidates} />

        <Card
          icon={<CheckCircle size={20} />}
          label="Shortlisted"
          value={stats.shortlisted_candidates}
        />

        <Card icon={<Send size={20} />} label="Outreach Sent" value={stats.outreach_sent} />

        <Card
          icon={<MessageSquare size={20} />}
          label="Parsed Candidates"
          value={stats.parsed_candidates}
        />

        <Card icon={<Clock size={20} />} label="Interviews Scheduled" value={stats.interviews_scheduled} />

      </div>
    </>
  );
}


function Card({ icon, label, value, badge }: { icon: any; label: string; value: string | number; badge?: string; }) {
  return (
    <div className="bg-card border border-theme rounded-xl p-4 flex flex-col gap-2 ">
      <div className="flex justify-between">
        <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
          {icon}
        </div>
        {badge && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${badge === "Running"
              ? "bg-green-100 text-green-700"
              : badge === "Paused"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
              }`}
          >
            {badge}
          </span>
        )}
      </div>

      <p className="text-xs text-subtext">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}