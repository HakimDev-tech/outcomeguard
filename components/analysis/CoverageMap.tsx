import type {
  CoverageResult,
} from "@/types/analysis";

interface CoverageMapProps {
  results: CoverageResult[];
  requirementLabels?: Record<
    string,
    string
  >;
}

const statusConfig = {
  covered: {
    label: "Covered",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  partial: {
    label: "Partial",
    className:
      "border-amber-200 bg-amber-50 text-amber-800",
  },
  missing: {
    label: "Missing",
    className:
      "border-red-200 bg-red-50 text-red-800",
  },
  uncertain: {
    label: "Uncertain",
    className:
      "border-zinc-200 bg-zinc-100 text-zinc-700",
  },
} as const;

export default function CoverageMap({
  results,
  requirementLabels = {},
}: CoverageMapProps) {
  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 p-5">
        <p className="text-sm text-zinc-500">
          No coverage results available.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">
          Coverage map
        </h2>

        <p className="text-sm text-zinc-500">
          Each requirement is evaluated independently.
        </p>
      </div>

      <div className="space-y-3">
        {results.map((result) => {
          const config =
            statusConfig[result.status];

          return (
            <article
              key={result.requirementId}
              className="rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-medium">
                    {requirementLabels[
                      result.requirementId
                    ] ??
                      result.requirementId}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    {result.explanation}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
                >
                  {config.label}
                </span>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-zinc-500">
                  <span>Confidence</span>

                  <span>
                    {Math.round(
                      result.confidence * 100,
                    )}
                    %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-zinc-800 transition-all"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(
                          100,
                          result.confidence * 100,
                        ),
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {result.missingConcepts.length >
                0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-zinc-500">
                    Missing concepts
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {result.missingConcepts.map(
                      (concept) => (
                        <span
                          key={concept}
                          className="rounded-md border border-red-100 bg-red-50 px-2 py-1 text-xs text-red-700"
                        >
                          {concept}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
