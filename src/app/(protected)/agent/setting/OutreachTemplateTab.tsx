type OutreachTemplateTabProps = {
  template: string;
};

export default function OutreachTemplateTab({
  template,
}: OutreachTemplateTabProps) {
  return (
    <section className="bg-card p-6 rounded-xl border border-theme space-y-4">
      <h2 className="font-semibold text-lg">Outreach Template</h2>

      <div className="text-xs text-subtext">
        Variables: {"{candidate_name}"}, {"{job_title}"}, {"{schedule_link}"}
      </div>

      <div className="bg-surface p-4 border mt-2 text-sm rounded-lg">
        <p className="text-xs text-subtext mb-3">Preview</p>
        <pre className="whitespace-pre-wrap font-sans">
          {template
            .replaceAll("{candidate_name}", "Amit")
            .replaceAll("{job_title}", "Backend Engineer")
            .replaceAll(
              "{schedule_link}",
              "https://autohire.example/schedule/amit",
            )}
        </pre>
      </div>
    </section>
  );
}
