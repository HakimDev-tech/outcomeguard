import Link from "next/link";

export default function EmptyState({
  title = "No analyses yet",
  description = "Your completed analyses will live here. Start with one goal and one resource.",
  actionLabel = "Start an analysis",
  actionHref = "/analyze",
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="og-empty">
      ◌
      <h2>{title}</h2>
      <p>{description}</p>
      <Link href={actionHref} className="og-run-button">{actionLabel}</Link>
    </div>
  );
}
