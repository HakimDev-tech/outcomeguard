import Link from "next/link";

import type {
  Analysis,
} from "@/types/analysis";

interface AnalysisCardProps {
  analysis: Analysis;
  goalStatement?: string;
  resourceTitle?: string;
}

const verdictConfig = {
  sufficient: {
    label: "Sufficient",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  partially_sufficient: {
    label: "Partially sufficient",
    className:
      "bg-amber-50 text-amber-700 border-amber-200",
  },
  insufficient: {
    label: "Not sufficient",
    className:
      "bg-red-50 text-red-700 border-red-200",
  },
  uncertain: {
    label: "Uncertain",
    className:
      "bg-zinc-100 text-zinc-700 border-zinc-200",
  },
} as const;

const statusConfig = {
  pending: {
    label: "Pending",
    className:
      "bg-zinc-100 text-zinc-600",
  },
  processing: {
    label: "Processing",
    className:
      "bg-blue-50 text-blue-700",
  },
  completed: {
    label: "Completed",
    className:
      "bg-emerald-50 text-emerald-700",
  },
  failed: {
    label: "Failed",
    className:
      "bg-red-50 text-red-700",
  },
} as const;

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

export default function AnalysisCard({
  analysis,
  goalStatement,
  resourceTitle,
}: AnalysisCardProps) {
  const status =
    statusConfig[analysis.status];

  const verdict =
    analysis.verdict
      ? verdictConfig[analysis.verdict]
      : undefined;

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-zinc-400">
            {formatDate(analysis.createdAt)}
          </p>

          <h3 className="mt-1 line-clamp-2 font-semibold text-zinc-900">
            {goalStatement ??
              "Goal analysis"}
          </h3>

          {resourceTitle && (
            <p className="mt-1 truncate text-sm text-zinc-500">
              Resource: {resourceTitle}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>

          {verdict && (
            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${verdict.className}`}
            >
              {verdict.label}
            </span>
          )}
        </div>
      </div>

      {analysis.summary && (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-600">
          {analysis.summary}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
        <div className="text-xs text-zinc-400">
          {analysis.requirements.length}{" "}
          requirement
          {analysis.requirements.length === 1
            ? ""
            : "s"}
        </div>

        <Link
          href={`/analyze/${analysis.id}`}
          className="text-sm font-medium text-zinc-900 hover:underline"
        >
          View analysis →
        </Link>
      </div>
    </article>
  );
}
