"use client";

import { Mail, Phone, MessageSquare, Send, Clock, Users } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-14">

      {/* HERO SECTION */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">
          We're Here to Help
        </h1>
        <p className="text-subtext text-sm max-w-xl mx-auto">
          Have questions about AI Hiring Agent, need support, or want a demo?
          Our team responds quickly and professionally.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT SIDE: INFO BLOCKS */}
        <div className="space-y-6">

          {/* Primary Contact Card */}
          <div className="bg-card border border-theme rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <p className="text-subtext text-sm mb-4">
              Reach out through any of the channels below.  
              We reply fast.
            </p>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-xs text-subtext">support@emergi.ai</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="font-medium text-sm">Phone</p>
                  <p className="text-xs text-subtext">+92 300 1234567</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="font-medium text-sm">Response Time</p>
                  <p className="text-xs text-subtext">Usually within 1 hour</p>
                </div>
              </div>

            </div>
          </div>

          {/* Support Options */}
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-card border border-theme p-4 rounded-xl shadow-sm hover:shadow-md hover:border-primary transition text-center cursor-pointer">
              <MessageSquare className="mx-auto mb-2 text-primary" size={22} />
              <p className="text-sm font-medium">Live Support</p>
              <p className="text-xs text-subtext">Chat with our team</p>
            </div>

            <div className="bg-card border border-theme p-4 rounded-xl shadow-sm hover:shadow-md hover:border-primary transition text-center cursor-pointer">
              <Users className="mx-auto mb-2 text-primary" size={22} />
              <p className="text-sm font-medium">Sales Inquiry</p>
              <p className="text-xs text-subtext">Book a demo call</p>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="bg-card border border-theme p-8 rounded-2xl shadow-sm space-y-5 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-1">Send us a Message</h2>
          <p className="text-subtext text-sm mb-4">
            Fill the form and we will reach back shortly.
          </p>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 border border-theme rounded-lg bg-bg text-sm focus:border-primary"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 border border-theme rounded-lg bg-bg text-sm focus:border-primary"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <textarea
              rows={5}
              placeholder="Your Message..."
              className="w-full px-4 py-3 border border-theme rounded-lg bg-bg text-sm focus:border-primary"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <button className="
              w-full py-3 bg-primary text-white rounded-lg 
              flex items-center justify-center gap-2 text-sm 
              hover:bg-primary-hover hover:shadow-lg transition
            ">
              <Send size={16} /> Send Message
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
