import GoalForm from "@/components/forms/GoalForm";
import ResourceForm from "@/components/forms/ResourceForm";

export default function AnalyzePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-10">
          <p className="text-sm font-medium text-gray-500">
            OutcomeGuard
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950">
            Analyze a resource
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Define your goal and provide the resource you are considering.
            OutcomeGuard will determine how well the resource satisfies the
            goal.
          </p>
        </header>

        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-950">
                1. Define your goal
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Be specific about the outcome you want to achieve.
              </p>
            </div>

            <GoalForm />
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-950">
                2. Add the resource
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Start with a YouTube video or plain text resource.
              </p>
            </div>

            <ResourceForm />
          </section>
        </div>
      </div>
    </main>
  );
}
