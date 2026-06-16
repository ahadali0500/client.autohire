"use client";

import { ChangeEvent } from "react";

type ScreeningRulesTabProps = {
  experience: number;
  setExperience: (val: number) => void;
  maxCandidates: number;
  setMaxCandidates: (val: number) => void;
  minScore: number;
  setMinScore: (val: number) => void;
  tone: string;
  setTone: (val: string) => void;
};

export default function ScreeningRulesTab({
  experience,
  setExperience,
  maxCandidates,
  setMaxCandidates,
  minScore,
  setMinScore,
  tone,
  setTone,
}: ScreeningRulesTabProps) {
  const updateSlider = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (val: number) => void
  ) => {
    const val = Number(e.target.value);
    setter(val);
    e.target.style.setProperty("--percent", `${val}%`);
  };

  return (
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
          <label className="text-sm font-medium mb-1">
            Maximum Candidates to Approach
          </label>
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
  );
}