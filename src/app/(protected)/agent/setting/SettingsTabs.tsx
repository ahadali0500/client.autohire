type SettingsTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function SettingsTabs({
  activeTab,
  setActiveTab,
}: SettingsTabsProps) {
  const tabs = [
    { id: "rules", label: "Screening Rules" },
    { id: "template", label: "Outreach Template" },
    { id: "email", label: "Email Integration" },
  ];

  return (
    <div className="flex gap-3 border-b border-theme pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 text-sm rounded-t-lg ${
            activeTab === tab.id
              ? "bg-primary text-white"
              : "text-subtext hover:text-text"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}