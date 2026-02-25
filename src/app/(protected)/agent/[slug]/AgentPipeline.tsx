"use client";

interface Step {
  id: number;
  label: string;
  status: "completed" | "running" | "pending" | "failed";
}


import {
  Users,
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  Target,
} from "lucide-react";
import { useState } from "react";

export default function AgentPipeline({
  steps,
  selected,
  onSelect,
}: {
  steps: Step[];
  selected: number;
  onSelect: (id: number) => void;
}) {


  const [stats] = useState({
    totalCandidates: 140,
    shortlisted: 58,
    outreachSent: 44,
    conversations: 17,
    interviews: 9,
    agentStatus: "Running",
  });

  return (
    <>
      <div className="border border-theme bg-card rounded-xl p-5">
        <div className="flex justify-between items-start">
          {steps.map((step) => (
            <div
              key={step.id}
              onClick={() => onSelect(step.id)}
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
                {step.status === "running" && "⏳"}
                {step.status === "pending" && "•"}
              </div>

              <p className="text-xs mt-2 text-center font-medium">
                {step.label}
              </p>

              {step.id !== steps.length && (
                <div className="h-[2px] bg-hover-border w-full mt-2"></div>
              )}
            </div>
          ))}
        </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-5">

        <Card icon={<Users size={20} />} label="Total Candidates" value={stats.totalCandidates} />

        <Card
          icon={<CheckCircle size={20} />}
          label="Shortlisted"
          value={stats.shortlisted}
        />

        <Card icon={<Send size={20} />} label="Outreach Sent" value={stats.outreachSent} />

        <Card
          icon={<MessageSquare size={20} />}
          label="Conversations"
          value={stats.conversations}
        />

        <Card icon={<Clock size={20} />} label="Interviews Scheduled" value={stats.interviews} />

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