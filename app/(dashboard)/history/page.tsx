import Link from "next/link";
import { AnalysisCard, EmptyState } from "@/components/dashboard";
import { getRecentAnalyses } from "@/lib/db/queries";

export default async function HistoryPage() {
  const analyses = await getRecentAnalyses(100);

  return (
    <main className="og-page">
      <div className="og-dashboard">
        <header className="og-dashboard-head">
          <div>
            <p className="og-eyebrow">
              OutcomeGuard
            </p>

            <h1>
              Analysis history
            </h1>

            <p>
              All previously processed resource analyses.
            </p>
          </div>

          <Link href="/analyze" className="og-run-button">New analysis →</Link>
        </header>

        <section>
          {analyses.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="og-history-list">
              {analyses.map((analysis) => (
                <AnalysisCard
                  key={analysis.id}
                  analysis={analysis}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
