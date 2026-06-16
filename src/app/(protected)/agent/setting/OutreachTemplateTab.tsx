type OutreachTemplateTabProps = {
  template: string;
  setTemplate: (value: string) => void;
};

export default function OutreachTemplateTab({
  template,
  setTemplate,
}: OutreachTemplateTabProps) {
  return (
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
  );
}