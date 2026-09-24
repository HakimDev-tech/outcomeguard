import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnalysisDetails } from "@/lib/db/queries";

const verdicts = {
  sufficient: {
    label: "Sufficient",
    tone: "good",
    icon: "✓",
    description: "The available evidence supports the goal requirements.",
  },
  partially_sufficient: {
    label: "Partially sufficient",
    tone: "warn",
    icon: "!",
    description: "The resource helps, but important parts of the goal remain uncovered.",
  },
  insufficient: {
    label: "Not sufficient",
    tone: "bad",
    icon: "×",
    description: "The evidence shows that this resource is missing important requirements.",
  },
  uncertain: {
    label: "Needs review",
    tone: "neutral",
    icon: "?",
    description: "The available evidence was not strong enough for a reliable verdict.",
  },
} as const;

const coverage = {
  covered: { label: "Covered", tone: "good" },
  partial: { label: "Partial", tone: "warn" },
  missing: { label: "Missing", tone: "bad" },
  uncertain: { label: "Uncertain", tone: "neutral" },
} as const;

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const details = await getAnalysisDetails(id);

  if (!details) notFound();

  const verdict = details.analysis.verdict
    ? verdicts[details.analysis.verdict]
    : null;
  const VerdictIcon = verdict?.icon;

  return (
    <main className="og-page">
      <div className="og-detail">
        <div className="og-detail-top">
          <Link href="/history" className="og-back">
            ← Back to history
          </Link>
          <Link href="/analyze" className="og-new-link">New analysis</Link>
        </div>

        <header className="og-detail-header">
          <p className="og-eyebrow">Analysis result</p>
          <h1>{details.resource?.title ?? "Untitled resource"}</h1>
          <p className="og-goal-line">{details.goal?.statement}</p>
        </header>

        {details.analysis.status === "failed" ? (
          <section className="og-result-card tone-bad">
            <h2>Analysis failed</h2>
            <p>{details.analysis.error?.message ?? "The analysis could not be completed."}</p>
          </section>
        ) : verdict ? (
          <section className={`og-verdict tone-${verdict.tone}`}>
            <div className="og-verdict-icon">{VerdictIcon}</div>
            <div>
              <p className="og-eyebrow">Final verdict</p>
              <h2>{verdict.label}</h2>
              <p>{details.analysis.summary ?? verdict.description}</p>
            </div>
          </section>
        ) : (
          <section className="og-result-card">
            <h2>Analysis {details.analysis.status}</h2>
            <p>The analysis is still being processed.</p>
          </section>
        )}

        {details.analysis.recommendation && (
          <section className="og-recommendation">
            <div>
              <p className="og-eyebrow">What to do next</p>
              <h2>{details.analysis.recommendation.reason}</h2>
            </div>
            {details.analysis.recommendation.missingTopics.length > 0 && (
              <div className="og-missing">
                <p>Still missing</p>
                <ul>
                  {details.analysis.recommendation.missingTopics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        <section className="og-section">
          <div className="og-section-title">
            <div>
              <p className="og-eyebrow">Requirement by requirement</p>
              <h2>What the resource actually covers</h2>
            </div>
            <span>{details.analysis.requirements.length} requirements</span>
          </div>

          <div className="og-coverage-list">
            {details.analysis.requirements.map((requirement) => {
              const result = details.coverageResults.find(
                (item) => item.requirementId === requirement.id,
              );
              const state = result ? coverage[result.status as keyof typeof coverage] : coverage.uncertain;

              return (
                <article key={requirement.id} className="og-coverage-row">
                  <div className="og-coverage-main">
                    <div className="og-coverage-status">
                      <span className={`og-dot tone-${state.tone}`} />
                      {state.label}
                    </div>
                    <h3>{requirement.description}</h3>
                    <p>{result?.explanation ?? "No coverage result was stored."}</p>
                  </div>
                  <div className="og-confidence">
                    {result ? `${Math.round(result.confidence * 100)}%` : "—"}
                    <span>confidence</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="og-source-card">
          <div>
            <p className="og-eyebrow">Source</p>
            <h2>{details.resource?.title}</h2>
            <p>{details.resource?.type ?? "resource"} · {details.evidence.length} evidence items stored</p>
          </div>
          {details.resource?.url && (
            <a href={details.resource.url} target="_blank" rel="noreferrer" className="og-source-link">
              Open source ↗
            </a>
          )}
        </section>
      </div>
    </main>
  );
}
