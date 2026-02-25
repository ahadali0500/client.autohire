"use client";

import { useState, ChangeEvent } from "react";
import TagInput from "@/components/TagInput/Index";

interface ResumeFile {
    name: string;
    file: File;
}

export default function JobForm() {
    const [experience, setExperience] = useState<number>(5);
    const [maxCandidates, setMaxCandidates] = useState<number>(50);
    const [minScore, setMinScore] = useState<number>(70);

    const [niceToHave, setNiceToHave] = useState<string[]>([]);
    const [mustHave, setMustHave] = useState<string[]>([]);

    const [files, setFiles] = useState<ResumeFile[]>([]);

    const updateSlider = (
        e: ChangeEvent<HTMLInputElement>,
        setter: (val: number) => void
    ) => {
        const val = Number(e.target.value);
        setter(val);
        e.target.style.setProperty("--percent", `${val}%`);
    };

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selected = Array.from(e.target.files).map((file) => ({
            name: file.name,
            file,
        }));

        setFiles((prev) => [...prev, ...selected]);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            <div className="max-w-5xl mx-auto p-6 space-y-10">
                <section className="bg-card border border-theme rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Job Details</h2>
                    <div>
                        <label className="block text-sm mb-1">Job Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="Senior Full Stack Developer"
                            className="w-full px-3 py-2 rounded-lg border-2 border-theme outline-none text-sm bg-bg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Job Description *</label>
                        <textarea
                            rows={4}
                            required
                            placeholder="Write the description here..."
                            className="w-full px-3 py-2 rounded-lg border-2 border-theme outline-none text-sm bg-bg"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <TagInput
                            label="Nice-To-Have Skills"
                            placeholder="Type and press Enter"
                            value={niceToHave}
                            onChange={setNiceToHave}
                        />

                        <TagInput
                            label="Must-Have Skills"
                            placeholder="Type and press Enter"
                            value={mustHave}
                            onChange={setMustHave}
                        />

                    </div>

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

                </section>

                <section className="bg-card border border-theme rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Resumes</h2>

                    <div>
                        <label className="text-sm font-medium mb-1">Upload Resumes</label>

                        <div onClick={() => document.getElementById("resumes")?.click()} className="border-2 border-dashed border-theme rounded-xl p-6 cursor-pointer hover:bg-hover-bg transition flex flex-col items-center justify-center text-center bg-bg mt-2">
                            <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-3">
                                📄
                            </div>
                            <p className="text-sm font-medium">
                                Drop files here or <span className="text-primary">browse</span>
                            </p>
                            <p className="text-xs text-subtext mt-1">PDF, DOCX allowed</p>
                        </div>

                        <input
                            type="file"
                            id="resumes"
                            multiple
                            onChange={handleUpload}
                            className="hidden"
                        />

                        <div className="mt-4 space-y-2">
                            {files.map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-card p-2 rounded-lg border border-theme">
                                    <span className="text-sm truncate">{item.name}</span>
                                    <button onClick={() => removeFile(index)} className="px-2 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600">
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Source Tag (Optional)</label>
                        <select className="select-theme w-full px-3 py-2 rounded-lg border-2 border-theme text-sm bg-bg">
                            <option value="">Select source</option>
                            <option>LinkedIn Campaign</option>
                            <option>Job Board</option>
                            <option>Internal Referral</option>
                            <option>Talent Pool</option>
                        </select>
                    </div>
                </section>

                <section className="bg-card border border-theme rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-semibold mb-4">AI Agent Guidelines</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">HR Guidelines for AI</label>
                        <textarea
                            rows={4}
                            placeholder="Any special instructions for the AI agent..."
                            className="w-full px-3 py-2 rounded-lg border-2 border-theme text-sm placeholder:text-sm bg-bg outline-none"
                        />
                    </div>
                </section>
            </div>

            <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-bg via-bg/95 to-transparent backdrop-blur-md py-2 px-1 flex justify-end border-t border-theme z-40">
                <div
                    className="bg-card px-6 py-1 rounded-xl shadow-lg shadow-black/10 border border-theme flex items-center gap-4 animate-fade-in">
                    <span className="text-sm text-subtext hidden sm:block">
                        All set? Start the AI hiring agent
                    </span>

                    <button className="px-4 py-2 rounded-lg border border-theme text-sm hover:bg-hover-bg transition">
                        Save Draft
                    </button>

                    <button className="px-5 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover shadow-md hover:shadow-lg transition">
                        Start AI Hiring Agent →
                    </button>
                </div>
            </div>
        </>
    );
}
