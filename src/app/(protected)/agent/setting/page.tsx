"use client";

import { useEffect, useState } from "react";
import SettingsTabs from "./SettingsTabs";
import ScreeningRulesTab from "./ScreeningRulesTab";
import OutreachTemplateTab from "./OutreachTemplateTab";
import EmailIntegrationTab from "./EmailIntegrationTab";

const screeningRules = `You are an expert tech recruiter scoring resumes against JDs. Analyze ONLY these 4 categories using structured reasoning.

JD:
- Job Title: {job_title}
- Description: {description}
- Must Have: {must_have} (critical)
- Nice to Have: {nice_to_have}
- Min Experience: {min_years} years

Resume JSON: {resume_json}

Step-by-step for EACH category (0-100 score):
1. Technical Skills: Match resume.technical_skills dict to must/nice-haves. Exact skills=100, partial=70-90, missing must-haves <=60.
2. Work Experience: Semantic match job_title/company/responsibilities to JD. Add years check (>=min_years=+20pts). Avg across jobs.
3. Projects: Tech_stack + description overlap with JD requirements. GitHub/live_demo bonus +10pts.
4. Education/Certs: Degree relevance + certs in JD skills. No degree=50 base.

Calculate weights:
- DEFAULT: skills=0.3, experience=0.3, projects=0.2, education=0.2
- ADAPTIVE: If skills>=90 AND experience>=80, use skills=0.35, experience=0.35, projects=0.2, education=0.1

Overall = SUM(category_score * weight). Threshold: >=75=pass.

Respond with ONLY valid JSON matching ResumeScore schema. No extra text.`;

const outreachTemplate = `You are a senior tech recruiter crafting a compelling outreach email.

**Objective:** Write a personalized, professional, and engaging email to a candidate who has been shortlisted for a position. The tone should be enthusiastic but respectful.

**Candidate Details:**
- Name: {candidate_name}
- Job Title: {job_title}

**Key Information to Include:**
1. **Strong Opening:** Start with a professional greeting and address the candidate by name.
2. **Express Interest:** Mention the specific role ({job_title}) and briefly state that you were impressed with their background and experience.
3. **Call to Action (The Schedule Link):** Clearly and enthusiastically invite them to schedule an interview at their convenience using the provided link.
4. **Closing:** End with a professional closing, such as "Best regards," followed by "The Hiring Team."

**Formatting Instructions:**
- The entire output must be a single, valid JSON object that conforms to the OutreachMessage schema.
- The body of the email must be a single string of well-formed HTML. Use <p> tags for paragraphs and <strong> for bold text.

**Scheduling Link:** {schedule_link}`;

export default function AgentSettingsPage() {
  const [activeTab, setActiveTab] = useState("rules");

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("google_connected") === "true") {
      const timeoutId = window.setTimeout(() => setActiveTab("email"), 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, []);

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 space-y-10 pb-32">
        <h1 className="text-2xl font-semibold mb-4">AI Agent Settings</h1>

        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "rules" && (
          <ScreeningRulesTab rules={screeningRules} />
        )}

        {activeTab === "template" && (
          <OutreachTemplateTab template={outreachTemplate} />
        )}

        {activeTab === "email" && (
          <EmailIntegrationTab
            connected={connected}
            setConnected={setConnected}
          />
        )}
      </div>
    </>
  );
}
