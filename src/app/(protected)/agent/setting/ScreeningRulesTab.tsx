type ScreeningRulesTabProps = {
  rules: string;
};

export default function ScreeningRulesTab({ rules }: ScreeningRulesTabProps) {
  return (
    <section className="bg-card p-6 rounded-xl border border-theme space-y-4">
      <h2 className="font-semibold text-lg">Default Screening Rules</h2>

      <div className="bg-surface p-4 border text-sm rounded-lg">
        <p className="text-xs text-subtext mb-3">Preview</p>
        <pre className="whitespace-pre-wrap font-sans">{rules}</pre>
      </div>
    </section>
  );
}
