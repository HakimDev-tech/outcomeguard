import type {
  Verdict,
  Recommendation,
} from "@/types/analysis";

interface VerdictCardProps {
  verdict: Verdict;
  recommendation?: Recommendation;
  summary?: string;
}

const verdictConfig = {
  sufficient: {
    label: "Sufficient",
    description:
      "The resource provides evidence for the required concepts.",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  partially_sufficient: {
    label: "Partially sufficient",
    description:
      "The resource covers part of the goal but requires supplementation.",
    className:
      "border-amber-200 bg-amber-50 text-amber-900",
  },
  insufficient: {
    label: "Not sufficient",
    description:
      "Important requirements are missing from the resource.",
    className:
      "border-red-200 bg-red-50 text-red-900",
  },
  uncertain: {
    label: "Uncertain",
    description:
      "The available evidence is not strong enough for a reliable verdict.",
    className:
      "border-zinc-200 bg-zinc-100 text-zinc-900",
  },
} as const;

const actionLabels = {
  use_resource: "Use this resource",
  use_with_supplement:
    "Use it with supplementary resources",
  skip_resource: "Skip this resource",
  review_manually: "Review manually",
} as const;

export default function VerdictCard({
  verdict,
  recommendation,
  summary,
}: VerdictCardProps) {
  const config = verdictConfig[verdict];

  return (
    <section
      className={`rounded-2xl border p-6 ${config.className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
            OutcomeGuard verdict
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            {config.label}
          </h2>

          <p className="mt-2 max-w-2xl text-sm opacity-80">
            {config.description}
          </p>
        </div>

        {recommendation && (
          <span className="rounded-full border border-current px-3 py-1 text-xs font-medium">
            {actionLabels[
              recommendation.action
            ]}
          </span>
        )}
      </div>

      {summary && (
        <div className="mt-5 border-t border-current/10 pt-4">
          <p className="text-sm leading-6">
            {summary}
          </p>
        </div>
      )}

      {recommendation &&
        recommendation.missingTopics.length >
          0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
              Topics to supplement
            </p>

            <div className="flex flex-wrap gap-2">
              {recommendation.missingTopics.map(
                (topic) => (
                  <span
                    key={topic}
                    className="rounded-md border border-current/20 px-2 py-1 text-xs"
                  >
                    {topic}
                  </span>
                ),
              )}
            </div>
          </div>
        )}
    </section>
  );
}
