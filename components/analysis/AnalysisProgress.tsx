interface AnalysisProgressProps {
  status:
    | "idle"
    | "processing"
    | "completed"
    | "failed";
  currentStep?: string;
}

const steps = [
  "Understanding your goal",
  "Retrieving relevant evidence",
  "Mapping evidence to requirements",
  "Verifying the analysis",
  "Generating verdict",
];

export default function AnalysisProgress({
  status,
  currentStep,
}: AnalysisProgressProps) {
  if (status === "idle") {
    return null;
  }

  if (status === "failed") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-800">
          Analysis failed
        </p>

        <p className="mt-1 text-sm text-red-700">
          Please check the resource and try again.
        </p>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-medium text-emerald-800">
          Analysis completed
        </p>
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      className="rounded-xl border border-zinc-200 bg-white p-5"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-950" />

        <div>
          <p className="text-sm font-medium">
            Analyzing resource
          </p>

          {currentStep && (
            <p className="text-xs text-zinc-500">
              {currentStep}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex items-center gap-3"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 text-xs text-zinc-500">
              {index + 1}
            </div>

            <span className="text-sm text-zinc-600">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
