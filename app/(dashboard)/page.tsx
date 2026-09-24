import Link from "next/link";
import { AnalysisCard, EmptyState } from "@/components/dashboard";
import { Button } from "@/components/ui";
import { getRecentAnalyses } from "@/lib/db/queries";

export default async function DashboardPage() {
  const analyses = await getRecentAnalyses(20);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="flex flex-col gap-4 border-b border-gray-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              OutcomeGuard
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Review your previous resource analyses.
            </p>
          </div>

          <Link href="/analyze">
            <Button>New analysis</Button>
          </Link>
        </header>

        <section className="mt-8">
          {analyses.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
