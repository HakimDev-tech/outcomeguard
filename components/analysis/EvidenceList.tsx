import type {
  Evidence,
} from "@/types/evidence";

interface EvidenceListProps {
  evidence: Evidence[];
}

const relevanceLabel = {
  direct: "Direct",
  partial: "Partial",
  indirect: "Indirect",
  irrelevant: "Irrelevant",
} as const;

export default function EvidenceList({
  evidence,
}: EvidenceListProps) {
  if (evidence.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 p-5">
        <p className="text-sm text-zinc-500">
          No evidence was found.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">
          Evidence
        </h2>

        <p className="text-sm text-zinc-500">
          Retrieved evidence supporting the analysis.
        </p>
      </div>

      <div className="space-y-3">
        {evidence.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-zinc-200 bg-white p-4"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                {relevanceLabel[item.relevance]}
              </span>

              {item.confidence !== undefined && (
                <span className="text-xs text-zinc-500">
                  Confidence{" "}
                  {Math.round(
                    item.confidence * 100,
                  )}
                  %
                </span>
              )}
            </div>

            <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700">
              {item.content}
            </p>

            {item.location && (
              <p className="mt-3 text-xs text-zinc-400">
                {item.location}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
