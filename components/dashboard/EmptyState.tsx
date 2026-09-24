import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title = "No analyses yet",
  description = "Analyze a learning resource against a specific goal to see whether it actually covers what you need.",
  actionLabel = "Start an analysis",
  actionHref = "/analyze",
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl shadow-sm ring-1 ring-zinc-200">
        ?
      </div>

      <h2 className="mt-5 text-lg font-semibold text-zinc-900">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
        {description}
      </p>

      <Link
        href={actionHref}
        className="mt-6 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
