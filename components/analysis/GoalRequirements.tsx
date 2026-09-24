import type {
  Requirement,
} from "@/types/analysis";

interface GoalRequirementsProps {
  requirements: Requirement[];
}

const importanceLabel = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;

export default function GoalRequirements({
  requirements,
}: GoalRequirementsProps) {
  if (requirements.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 p-5">
        <p className="text-sm text-zinc-500">
          No requirements were generated.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">
          Goal requirements
        </h2>

        <p className="text-sm text-zinc-500">
          What the resource needs to cover.
        </p>
      </div>

      <div className="space-y-3">
        {requirements.map(
          (requirement, index) => (
            <article
              key={requirement.id}
              className="rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">
                      {requirement.description}
                    </h3>

                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-600">
                      {
                        importanceLabel[
                          requirement.importance
                        ]
                      }
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-zinc-500">
                    {requirement.rationale}
                  </p>

                  {requirement.expectedConcepts
                    .length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {requirement.expectedConcepts.map(
                        (concept) => (
                          <span
                            key={concept}
                            className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-600"
                          >
                            {concept}
                          </span>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  );
}
