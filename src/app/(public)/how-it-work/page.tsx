"use client";

import {
    FileSearch,
    Cpu,
    MessagesSquare,
    Users,
    CheckCircle2,
    ArrowRight,
    Sparkles
} from "lucide-react";

export default function HowItWorksPage() {
    return (
        <div className="max-w-6xl mx-auto p-6 space-y-24">

            {/* HERO */}
            <section className="text-center space-y-4 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    How the AI Hiring Agent Works
                </h1>

                <p className="text-subtext text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                    A fully automated workflow that screens resumes, shortlists candidates,
                    sends personalized outreach, chats with applicants, and books interviews.
                    Your hiring pipeline — 10 times faster.
                </p>
            </section>


            {/* STEP STRIP */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                {[
                    { icon: FileSearch, label: "Upload Resumes" },
                    { icon: Cpu, label: "AI Screening" },
                    { icon: MessagesSquare, label: "AI Outreach" },
                    { icon: Users, label: "Interview Ready" },
                ].map((step, i) => (
                    <div
                        key={i}
                        className="bg-card border border-theme p-6 rounded-xl hover:shadow-md transition"
                    >
                        <step.icon className="mx-auto text-primary mb-3" size={32} />
                        <p className="text-sm font-medium">{step.label}</p>
                    </div>
                ))}
            </section>


            {/* DETAILED WORKFLOW */}
            <section className="space-y-20">

                {/* STEP 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                            <FileSearch className="text-primary" /> Step 1: Upload Resumes
                        </h2>
                        <p className="text-subtext text-sm leading-relaxed">
                            Start by uploading PDF, DOCX, or parsed resumes. The system
                            automatically extracts experience, skills, job history, and
                            key achievements.
                        </p>

                        <ul className="mt-4 space-y-2 text-sm text-subtext">
                            <li>• Smart resume parsing</li>
                            <li>• Duplicate detection & cleaning</li>
                            <li>• Auto skill extraction</li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-10 rounded-2xl border border-primary/20 text-center">
                        <Sparkles className="mx-auto text-primary mb-3" size={36} />
                        <p className="text-sm font-medium">Fast & Accurate Resume Intake</p>
                    </div>
                </div>


                {/* STEP 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center md:flex-row-reverse">
                    <div className="order-2 md:order-1">
                        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                            <Cpu className="text-primary" /> Step 2: AI Screening + Score
                        </h2>
                        <p className="text-subtext text-sm leading-relaxed">
                            The AI evaluates each profile using 20+ scoring signals:
                            technical keywords, relevancy, academic alignment, and past project depth.
                        </p>

                        <ul className="mt-4 space-y-2 text-sm text-subtext">
                            <li>• Resume Score (0–100)</li>
                            <li>• Experience match</li>
                            <li>• Skill relevance</li>
                        </ul>
                    </div>

                    <div className="order-1 md:order-2 bg-card p-10 border border-theme rounded-xl text-center">
                        <Cpu className="mx-auto text-primary mb-3" size={36} />
                        <p className="text-sm font-medium">Smart Candidate Ranking</p>
                    </div>
                </div>


                {/* STEP 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                            <MessagesSquare className="text-primary" /> Step 3: AI Outreach
                        </h2>
                        <p className="text-subtext text-sm leading-relaxed">
                            Personalized email or WhatsApp outreach is sent to shortlisted
                            candidates using your own connected Gmail account.
                        </p>

                        <ul className="mt-4 space-y-2 text-sm text-subtext">
                            <li>• Human-like messaging</li>
                            <li>• Uses your brand tone</li>
                            <li>• Auto follow-ups</li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-r from-blue-100/10 to-blue-100/5 p-10 rounded-xl border border-theme text-center">
                        <MessagesSquare className="mx-auto text-blue-500 mb-3" size={36} />
                        <p className="text-sm font-medium">AI-Powered Conversations</p>
                    </div>
                </div>


                {/* STEP 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center md:flex-row-reverse">
                    <div className="order-2 md:order-1">
                        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                            <Users className="text-primary" /> Step 4: Interview Scheduling
                        </h2>
                        <p className="text-subtext text-sm leading-relaxed">
                            The AI screens candidate responses and schedules interviews
                            for top-rated applicants. HR only meets candidates already
                            filtered by AI.
                        </p>

                        <ul className="mt-4 space-y-2 text-sm text-subtext">
                            <li>• AI evaluates chat replies</li>
                            <li>• Auto schedule with Calendly / Google</li>
                            <li>• Only strong candidates reach HR</li>
                        </ul>
                    </div>

                    <div className="order-1 md:order-2 bg-card p-10 border border-theme rounded-xl text-center">
                        <Users className="mx-auto text-primary mb-3" size={36} />
                        <p className="text-sm font-medium">Interview-Ready Talent</p>
                    </div>
                </div>

            </section>



            {/* FINAL CTA */}
            <section className="text-center space-y-4 py-16">
                <h2 className="text-3xl font-bold">Ready to Automate Your Hiring Pipeline?</h2>

                <p className="text-subtext text-sm max-w-xl mx-auto">
                    Upload resumes. Set your rules. Let AI handle everything from screening
                    to interviewing — 10x faster.
                </p>

                <button className="
          px-6 py-3 bg-primary text-white rounded-lg 
          hover:bg-primary-hover hover:shadow-lg transition text-sm
        ">
                    Start Using AI Hiring Agent <ArrowRight className="inline-block ml-1" size={16} />
                </button>
            </section>

        </div>
    );
}
