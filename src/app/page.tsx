"use client";

import Navbar from "@/components/public-layout/Navbar";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  CheckCircle,
  FileSearch,
  Mail,
  MessageSquareText,
  Sparkles,
  Timer,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const metrics = [
  { value: "10k+", label: "Resumes screened" },
  { value: "65%", label: "Shorter hiring cycles" },
  { value: "24/7", label: "Candidate follow-up" },
  { value: "98%", label: "Structured relevance scoring" },
];

const features = [
  {
    icon: FileSearch,
    title: "Resume screening",
    desc: "Parse resumes, match must-have skills, and rank candidates against the job description.",
  },
  {
    icon: Mail,
    title: "Personalized outreach",
    desc: "Send professional candidate emails with interview links and follow-up context.",
  },
  {
    icon: MessageSquareText,
    title: "AI interview chat",
    desc: "Run structured conversations that collect answers and keep candidates moving.",
  },
  {
    icon: UserCheck,
    title: "Shortlist decisions",
    desc: "Surface the strongest candidates with scores, summaries, and pipeline status.",
  },
  {
    icon: CalendarCheck,
    title: "Interview scheduling",
    desc: "Coordinate availability and route shortlisted candidates to the next step.",
  },
  {
    icon: Bot,
    title: "Agent dashboard",
    desc: "Track each hiring agent, stage, activity, and outcome from one workspace.",
  },
];

const workflow = [
  "Create an agent with the job description and hiring criteria.",
  "Upload resumes and let AutoHire score every candidate.",
  "Shortlisted candidates receive tailored outreach automatically.",
  "Candidates schedule interviews from a guided booking link.",
];

const candidateSignals = [
  { name: "Ayesha Khan", role: "Senior Backend Engineer", score: 94 },
  { name: "Daniel Morris", role: "Full Stack Developer", score: 88 },
  { name: "Priya Shah", role: "Platform Engineer", score: 82 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-theme">
          <div className="absolute inset-x-0 top-0 h-px bg-primary/30" />

          <div className="mx-auto max-w-7xl px-6 pt-20 pb-14 md:pt-28 md:pb-20">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-theme bg-card px-3 py-1.5 text-xs font-medium text-subtext">
                <Sparkles size={14} className="text-primary" />
                AI recruiting agents for lean hiring teams
              </div>

              <h1 className="text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
                Hire faster with recruiting agents that screen, contact, and
                schedule candidates
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-subtext md:text-lg">
                AutoHire turns job descriptions and resumes into a structured
                recruiting pipeline, from scoring and shortlisting to outreach
                and interview scheduling.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover"
                >
                  Start free
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/how-it-work"
                  className="inline-flex items-center justify-center rounded-lg border border-theme px-6 py-3 text-sm font-medium transition hover:bg-surface"
                >
                  See how it works
                </Link>
              </div>
            </div>

            <div className="mt-14 rounded-xl border border-theme bg-card p-2 shadow-2xl shadow-black/10">
              <div className="overflow-hidden rounded-lg border border-theme bg-surface">
                <Image
                  src="/assets/img/dashboard.png"
                  alt="AutoHire dashboard showing hiring agent metrics and candidate pipeline"
                  width={1400}
                  height={820}
                  priority
                  className="h-auto w-full"
                />
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
              {metrics.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-theme bg-card px-4 py-4 text-center"
                >
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <p className="mt-1 text-xs text-subtext">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-primary">Why AutoHire</p>
              <h2 className="mt-2 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
                A complete workflow for moving from applicants to interviews
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-subtext">
              Designed for teams that need consistent screening, reliable
              follow-up, and a clear view of every hiring session.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-lg border border-theme bg-card p-6 transition hover:border-primary/30 hover:shadow-lg hover:shadow-black/5"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={21} />
                  </div>
                  <h3 className="text-base font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-subtext">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <div className="rounded-xl border border-theme bg-card p-8 md:p-10">
              <p className="text-sm font-medium text-primary">
                Candidate intelligence
              </p>
              <h2 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">
                Know exactly why a candidate is moving forward
              </h2>
              <p className="mt-4 text-sm leading-6 text-subtext">
                AutoHire turns messy resume data into clear hiring signals:
                skill fit, experience strength, project relevance, education,
                and the next recommended action.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: TrendingUp, label: "Resume fit", value: "92%" },
                  { icon: Timer, label: "Review time", value: "2 min" },
                  { icon: CheckCircle, label: "Ready to contact", value: "18" },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-lg border border-theme bg-surface px-4 py-4"
                    >
                      <Icon size={18} className="text-primary" />
                      <p className="mt-3 text-xl font-semibold">
                        {item.value}
                      </p>
                      <p className="text-xs text-subtext">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-theme bg-card p-4 shadow-xl shadow-black/5">
              <div className="rounded-lg border border-theme bg-bg p-4">
                <div className="flex items-center justify-between border-b border-theme pb-4">
                  <div>
                    <p className="text-sm font-semibold">Shortlist review</p>
                    <p className="text-xs text-subtext">
                      Backend Engineer agent
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                    Live scoring
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {candidateSignals.map((candidate) => (
                    <div
                      key={candidate.name}
                      className="rounded-lg border border-theme bg-card p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold">
                            {candidate.name}
                          </p>
                          <p className="text-xs text-subtext">
                            {candidate.role}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-primary">
                            {candidate.score}
                          </p>
                          <p className="text-[10px] uppercase text-subtext">
                            score
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 h-2 rounded-full bg-surface">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${candidate.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-theme bg-surface/50">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-medium text-primary">
                From setup to scheduled interviews
              </p>
              <h2 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">
                Your hiring pipeline, handled step by step
              </h2>
              <p className="mt-4 text-sm leading-6 text-subtext">
                AutoHire keeps the process organized without forcing your team
                to manually chase every resume, candidate, and calendar slot.
              </p>
            </div>

            <div className="space-y-3">
              {workflow.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-4 rounded-lg border border-theme bg-card p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="self-center text-sm leading-6">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-xl border border-theme bg-card p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <CheckCircle size={22} />
                </div>
                <h2 className="text-3xl font-semibold">
                  Start your first AI hiring session
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-subtext">
                  Create an agent, upload resumes, and move qualified
                  candidates into interviews with less manual work.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-hover"
                >
                  Get started
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg border border-theme px-6 py-3 text-sm font-medium transition hover:bg-surface"
                >
                  Contact sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-theme py-8 text-center text-sm text-subtext">
        &copy; {new Date().getFullYear()} AutoHire. All rights reserved.
      </footer>
    </div>
  );
}
