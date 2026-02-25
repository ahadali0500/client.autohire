"use client";

import Navbar from "@/components/public-layout/Navbar";
import { ArrowRight, CheckCircle, Cpu, FileSearch, Mail, MessagesSquare, UserCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-bg text-text">
      <Navbar />


      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-28 pb-32 text-center relative">

        {/* Hero glow */}
        <div className="absolute inset-0 mx-auto max-w-2xl blur-[120px] opacity-25 bg-primary -z-10"></div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Automate Your Hiring with  
          <span className="text-primary"> AI Recruiting Agents</span>
        </h1>

        <p className="mt-6 text-lg text-subtext max-w-2xl mx-auto leading-relaxed">
          From resume screening to outreach, AI chat interviews and scheduling.
          Your entire pipeline — fully automated and 10× faster.
        </p>

        <div className="flex justify-center gap-4 mt-10">
          <button className="px-7 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 shadow-md flex items-center gap-2">
            Start Free <ArrowRight size={16} />
          </button>

          <button className="px-7 py-3 border border-theme rounded-xl hover-theme">
            Watch Demo
          </button>
        </div>

        {/* Dashboard UI block */}
        <div className="mt-20 rounded-2xl border border-theme bg-card/60 backdrop-blur-xl p-4 shadow-xl">
          {/* <div className="h-[340px] bg-surface rounded-xl flex items-center justify-center text-subtext text-sm">
            Dashboard Preview Coming Soon
          </div> */}
          <img src="/assets/img/dashboard.png" ></img>
        </div>
      </section>


      {/* VALUE STATS */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { value: "10,000+", label: "Resumes Screened" },
          { value: "65%",   label: "Faster Hiring Cycles" },
          { value: "24/7",  label: "AI Always Working" },
          { value: "98%",   label: "Relevancy Accuracy" }
        ].map((s, i) => (
          <div key={i}>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-subtext mt-1">{s.label}</p>
          </div>
        ))}
      </section>


      {/* FEATURES — PREMIUM GRID */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Why Companies Choose Our AI Hiring Agent
        </h2>

        <p className="text-subtext text-center max-w-xl mx-auto mt-3">
          Built for modern HR teams that want speed, accuracy and automation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {[
            {
              icon: <FileSearch size={28} className="text-primary" />,
              title: "AI Resume Screening",
              desc: "Reads resumes, extracts skills and ranks candidates instantly."
            },
            {
              icon: <Mail size={28} className="text-primary" />,
              title: "Automated Outreach",
              desc: "Sends human-like personalised messages via Email & WhatsApp."
            },
            {
              icon: <MessagesSquare size={28} className="text-primary" />,
              title: "AI Chat Interviews",
              desc: "Conducts structured interviews, evaluates responses and scores candidates."
            },
            {
              icon: <Cpu size={28} className="text-primary" />,
              title: "Skill & Experience Scoring",
              desc: "Analyzes keywords, seniority level, tech stack and relevance."
            },
            {
              icon: <UserCheck size={28} className="text-primary" />,
              title: "Shortlisting + Decision Making",
              desc: "Picks only the most relevant profiles for HR to review."
            },
            {
              icon: <CheckCircle size={28} className="text-primary" />,
              title: "Interview Scheduling",
              desc: "Books meetings with candidates based on availability."
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-7 rounded-2xl border border-theme bg-card shadow-sm hover:shadow-lg transition"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-subtext mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* WORKFLOW — MORE PREMIUM */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center">How It Works</h2>
        <p className="text-subtext text-center max-w-xl mx-auto mt-2">
          A fully automated hiring engine — your AI teammate.
        </p>

        <div className="mt-14 space-y-8">
          {[
            "Upload resumes & job description",
            "AI screens, scores & ranks candidates",
            "AI sends personalised outreach",
            "AI conducts a structured chat interview",
            "AI identifies top candidates & schedules interview",
          ].map((step, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-theme bg-card flex items-start gap-4 hover:bg-card/80 transition"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                {i + 1}
              </div>
              <p className="text-sm md:text-base">{step}</p>
            </div>
          ))}
        </div>
      </section>


      {/* CTA SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="p-12 rounded-2xl border border-theme bg-card shadow-xl">
          <h2 className="text-3xl font-bold">Hire Faster. Smarter. With AI.</h2>
          <p className="text-subtext mt-2">
            Start your first AI-powered hiring session within minutes.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button className="px-7 py-3 bg-primary text-white rounded-xl hover:bg-primary/90">
              Start For Free
            </button>
            <button className="px-7 py-3 border border-theme rounded-xl hover-theme">
              Contact Sales
            </button>
          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="border-t border-theme py-10 text-center text-sm text-subtext">
        © {new Date().getFullYear()} EmergiHire — All Rights Reserved.
      </footer>
    </div>
  );
}
