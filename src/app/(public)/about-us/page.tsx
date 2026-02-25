"use client";

import { Target, Sparkles, Rocket, ArrowRight, CheckCircle, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-24">

      {/* HERO SECTION */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          Redefining Hiring Through AI Intelligence
        </h1>

        <p className="text-subtext text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Our mission is simple: make hiring smarter, faster, and dramatically more
          efficient — without losing the human touch. With AI, we empower companies to
          screen thousands of resumes, identify top talent, and engage candidates
          instantly.
        </p>
      </section>


      {/* WHY WE EXIST SECTION */}
      <section className="bg-card rounded-2xl border border-theme p-10 shadow-sm hover:shadow-md transition-all">
        <h2 className="text-2xl font-semibold mb-4">Why We Built This</h2>

        <p className="text-sm md:text-base text-subtext leading-relaxed">
          Traditional recruiting wastes time. HR teams manually read every resume,
          outreach takes hours, and shortlisting delays cost companies their best talent.
          <br /><br />
          We set out to build an AI engine that handles the heavy lifting — screening,
          scoring, and messaging candidates — so recruiters can focus on meaningful
          conversations, not repetitive admin.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            "Remove manual screening bottlenecks",
            "Identify top talent instantly with AI scoring",
            "Automate candidate outreach with personalization",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle className="text-primary" size={20} />
              <p className="text-sm text-subtext">{item}</p>
            </div>
          ))}
        </div>
      </section>


      {/* MISSION + VISION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* MISSION */}
        <div className="bg-card border border-theme p-8 rounded-2xl hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-3">
            <Target className="text-primary" />
            <h3 className="text-xl font-semibold">Our Mission</h3>
          </div>

          <p className="text-sm text-subtext leading-relaxed">
            To empower businesses with AI that drastically speeds up hiring while making
            the process more transparent, fair, and skill-driven. We want companies to
            hire confidently and candidates to be valued for their real capabilities.
          </p>
        </div>

        {/* VISION */}
        <div className="bg-card border border-theme p-8 rounded-2xl hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-3">
            <Rocket className="text-primary" />
            <h3 className="text-xl font-semibold">Our Vision</h3>
          </div>

          <p className="text-sm text-subtext leading-relaxed">
            A future where talent discovery is instant, unbiased, and fully automated.
            Companies will scale faster, candidates will receive immediate responses,
            and AI will eliminate the inefficiencies of traditional hiring.
          </p>
        </div>
      </section>


      {/* CORE VALUES */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">What Drives Us</h2>

        <p className="text-subtext text-sm text-center max-w-xl mx-auto mb-10">
          These pillars guide every feature, every decision, and every interaction
          inside the product.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-card p-6 border border-theme rounded-xl hover:shadow-md transition">
            <Sparkles className="text-primary mb-3" />
            <h3 className="font-medium mb-2">Innovation at the Core</h3>
            <p className="text-sm text-subtext">
              We push boundaries to create tools that genuinely transform workflows.
            </p>
          </div>

          <div className="bg-card p-6 border border-theme rounded-xl hover:shadow-md transition">
            <Users className="text-primary mb-3" />
            <h3 className="font-medium mb-2">Human-Centered Automation</h3>
            <p className="text-sm text-subtext">
              AI is here to support people, not replace them. We amplify human judgment.
            </p>
          </div>

          <div className="bg-card p-6 border border-theme rounded-xl hover:shadow-md transition">
            <CheckCircle className="text-primary mb-3" />
            <h3 className="font-medium mb-2">Transparency & Trust</h3>
            <p className="text-sm text-subtext">
              Our processes are clear, fair, and measurable — no black boxes.
            </p>
          </div>

        </div>
      </section>


      {/* CTA SECTION */}
      <section className="text-center space-y-4 py-16">
        <h2 className="text-3xl font-semibold">The Future of Hiring Starts Here</h2>

        <p className="text-subtext text-sm max-w-xl mx-auto">
          Let AI handle the repetitive work while you focus on interviewing the best-fit
          candidates.
        </p>

        <button
          className="
            px-6 py-3 rounded-lg bg-primary text-white text-sm 
            hover:bg-primary-hover hover:shadow-lg transition
          "
        >
          Start Your AI Hiring Agent <ArrowRight className="inline-block ml-1" size={16} />
        </button>
      </section>

    </div>
  );
}
