"use client";

import { useState } from "react";
import SettingsTabs from "./SettingsTabs";
import ScreeningRulesTab from "./ScreeningRulesTab";
import OutreachTemplateTab from "./OutreachTemplateTab";
import EmailIntegrationTab from "./EmailIntegrationTab";
import StickySaveBar from "./StickySaveBar";

export default function AgentSettingsPage() {
  const [activeTab, setActiveTab] = useState("rules");

  // Shared state
  const [tone, setTone] = useState("professional");
  const [experience, setExperience] = useState<number>(10);
  const [maxCandidates, setMaxCandidates] = useState<number>(50);
  const [minScore, setMinScore] = useState<number>(70);

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

  const handleSave = () => {
    console.log({
      tone,
      experience,
      maxCandidates,
      minScore,
      template,
      connected,
    });
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 space-y-10 pb-32">
        <h1 className="text-2xl font-semibold mb-4">AI Agent Settings</h1>

        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "rules" && (
          <ScreeningRulesTab
            experience={experience}
            setExperience={setExperience}
            maxCandidates={maxCandidates}
            setMaxCandidates={setMaxCandidates}
            minScore={minScore}
            setMinScore={setMinScore}
            tone={tone}
            setTone={setTone}
          />
        )}

        {activeTab === "template" && (
          <OutreachTemplateTab
            template={template}
            setTemplate={setTemplate}
          />
        )}

        {activeTab === "email" && (
          <EmailIntegrationTab
            connected={connected}
            setConnected={setConnected}
            emailsSentToday={emailsSentToday}
            testEmail={testEmail}
            setTestEmail={setTestEmail}
            testEmailStatus={testEmailStatus}
            handleConnectGmail={handleConnectGmail}
            sendTestEmail={sendTestEmail}
          />
        )}
      </div>

      <StickySaveBar onSave={handleSave} />
    </>
  );
}