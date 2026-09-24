import Link from "next/link";
import { Compass } from "lucide-react";

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
      <Compass size={23} />
      <h2>{title}</h2>
      <p>{description}</p>
      <Link href={actionHref} className="og-run-button">{actionLabel}</Link>
    </div>
  );
}
