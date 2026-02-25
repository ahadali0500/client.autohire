"use client";

import { useState, ChangeEvent } from "react";
import TagInput from "@/components/TagInput/Index";

export default function AgentSettingsPage() {
    const [activeTab, setActiveTab] = useState("rules");
    const [tone, setTone] = useState("professional");

    const [experience, setExperience] = useState<number>(10);
    const [maxCandidates, setMaxCandidates] = useState<number>(50);
    const [minScore, setMinScore] = useState<number>(70);

    const [niceToHave, setNiceToHave] = useState<string[]>([]);
    const [mustHave, setMustHave] = useState<string[]>([]);

    const [connected, setConnected] = useState(false);
    const [emailsSentToday, setEmailsSentToday] = useState(12);
    const [testEmail, setTestEmail] = useState("");
    const [testEmailStatus, setTestEmailStatus] = useState("");

    const [template, setTemplate] = useState(
        "Hi {{name}}, thanks for your interest! We'd like to invite you for a short AI-based screening for the {{role}} role."
    );

    const handleConnectGmail = () => setConnected(true);
    const sendTestEmail = () => {
        setTestEmailStatus("Test email sent successfully!");
        setTimeout(() => setTestEmailStatus(""), 3000);
    };

    const updateSlider = (
        e: ChangeEvent<HTMLInputElement>,
        setter: (val: number) => void
    ) => {
        const val = Number(e.target.value);
        setter(val);
        e.target.style.setProperty("--percent", `${val}%`);
    };

    return (
        <>
            <div className="max-w-5xl mx-auto p-6 space-y-10 pb-32">

                <h1 className="text-2xl font-semibold mb-4">AI Agent Settings</h1>

                <div className="flex gap-3 border-b border-theme pb-2">
                    {[
                        { id: "rules", label: "Screening Rules" },
                        { id: "template", label: "Outreach Template" },
                        { id: "email", label: "Email Integration" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-sm rounded-t-lg ${activeTab === tab.id ? "bg-primary text-white" : "text-subtext hover:text-text"}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>


                {activeTab === "rules" && (
                    <section className="bg-card p-6 rounded-xl border border-theme space-y-6">
                        <h2 className="font-semibold text-lg">Default Screening Rules</h2>


                        <div>
                            <div className="flex justify-between">
                                <label className="text-sm font-medium">Experience Range (Min Years)</label>
                                <span>{experience}</span>
                            </div>

                            <input
                                type="range"
                                min={0}
                                max={20}
                                value={experience}
                                onChange={(e) => updateSlider(e, setExperience)}
                                className="range-slider w-full"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between">
                                <label className="text-sm font-medium mb-1">Maximum Candidates to Approach</label>
                                <span>{maxCandidates}</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={maxCandidates}
                                onChange={(e) => updateSlider(e, setMaxCandidates)}
                                className="range-slider w-full"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between">
                                <label className="text-sm font-medium mb-1">Minimum Resume Score</label>
                                <span>{minScore}</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={minScore}
                                onChange={(e) => updateSlider(e, setMinScore)}
                                className="range-slider w-full"
                            />
                        </div>

                        {/* Tone */}
                        <div>
                            <label className="block text-sm mb-1">AI Message Tone</label>
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="px-3 py-2 select-theme border border-theme rounded-lg bg-bg text-sm w-full"
                            >
                                <option value="professional">Professional</option>
                                <option value="friendly">Friendly</option>
                                <option value="casual">Casual</option>
                                <option value="strict">Strict Screening Focused</option>
                            </select>
                        </div>
                    </section>
                )}

                {activeTab === "template" && (
                    <section className="bg-card p-6 rounded-xl border border-theme space-y-4">
                        <h2 className="font-semibold text-lg">Outreach Template</h2>

                        <textarea
                            rows={4}
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                            className="w-full px-3 py-2 border border-theme rounded-lg text-sm"
                        />

                        <div className="text-xs text-subtext">
                            {/* Variables: {{name}}, {{role}}, {{company}} */}
                        </div>

                        {/* Preview */}
                        <div className="bg-surface p-4 border mt-2 text-sm rounded-lg">
                            <p className="text-xs text-subtext mb-1">Preview</p>
                            <p>
                                {template
                                    .replace("{{name}}", "Amit")
                                    .replace("{{role}}", "Backend Engineer")
                                    .replace("{{company}}", "Emergi Mentors")}
                            </p>
                        </div>
                    </section>
                )}

                {activeTab === "email" && (
                    <section className="bg-card p-6 rounded-xl border border-theme space-y-5">
                        <h2 className="text-lg font-semibold">Email Integration (Gmail)</h2>

                        {/* Status Row */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Connected Gmail Account</p>
                                <p className="text-xs text-subtext">
                                    {connected
                                        ? "Your Gmail is successfully connected. AI Agent will send outreach emails using this inbox."
                                        : "No Gmail account connected. AI outreach cannot start without authentication."}
                                </p>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${connected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                {connected ? "Connected" : "Not Connected"}
                            </span>
                        </div>

                        <div>
                            {connected ? (
                                <button
                                    onClick={() => setConnected(false)}
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm"
                                >
                                    Disconnect Gmail
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleConnectGmail()}
                                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm"
                                >
                                    Connect Gmail →
                                </button>
                            )}
                        </div>

                        {connected && (
                            <>
                                <div className="p-4 rounded-lg border border-theme bg-surface">
                                    <p className="text-sm font-medium mb-1">Daily Email Usage</p>
                                    <p className="text-xs text-subtext mb-2">Limit resets every 24 hours.</p>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Used: {emailsSentToday} / 100</span>

                                        <div className="w-32 h-2 bg-bg rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${(emailsSentToday / 100) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-theme bg-surface">
                                    <p className="text-sm font-medium mb-2">Send Test Email</p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="email"
                                            placeholder="Enter test email"
                                            className="flex-1 px-3 py-2 border border-theme bg-bg rounded-lg text-sm"
                                            value={testEmail}
                                            onChange={(e) => setTestEmail(e.target.value)}
                                        />

                                        <button
                                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover"
                                            onClick={sendTestEmail}
                                        >
                                            Send
                                        </button>
                                    </div>

                                    {testEmailStatus && (
                                        <p className="text-xs mt-2 text-green-600">{testEmailStatus}</p>
                                    )}
                                </div>
                            </>
                        )}
                    </section>
                )}

            </div>


            <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-bg via-bg/95 to-transparent backdrop-blur-md py-2 px-1 flex justify-end border-t border-theme z-40">
                <button className="px-5 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover shadow-md hover:shadow-lg transition">
                    save setting
                </button>
            </div>
        </>
    );
}
