import Link from "next/link";
import type { Analysis } from "@/types/analysis";

interface AnalysisCardProps {
  analysis: Analysis;
}

const verdictConfig = {
  sufficient: ["Sufficient", "good"],
  partially_sufficient: ["Partially sufficient", "warn"],
  insufficient: ["Not sufficient", "bad"],
  uncertain: ["Needs review", "neutral"],
} as const;

export default function AnalysisCard({ analysis }: AnalysisCardProps) {
  const [verdict, tone] = analysis.verdict
    ? verdictConfig[analysis.verdict]
    : ["In progress", "neutral"];

  return (
    <article className="og-history-card">
      <div className="og-history-meta">
        <span>{new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(analysis.createdAt))}</span>
        <span className={`og-history-status tone-${tone}`}>{verdict}</span>
      </div>

      <h2>{analysis.requirements[0]?.description ?? "Goal analysis"}</h2>
      {analysis.summary && <p>{analysis.summary}</p>}

      <div className="og-history-footer">
        <span>{analysis.requirements.length} requirements · {analysis.coverageResults.length} evaluated</span>
        <Link href={`/analyze/${analysis.id}`}>Open analysis →</Link>
      </div>
    </article>
  );
}
