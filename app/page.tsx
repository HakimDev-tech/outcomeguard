import Link from "next/link";
import { Button } from "@/components/ui";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-600">
            Evidence-backed resource verification
          </div>

          <h1 className="text-balance text-5xl font-bold tracking-tight text-gray-950 sm:text-6xl">
            Know whether a resource can actually achieve your goal.
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-gray-600">
            OutcomeGuard analyzes your goal, extracts its requirements,
            examines a learning resource, and identifies what it covers,
            what it misses, and whether it is sufficient.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/analyze">
              <Button>Analyze a resource</Button>
            </Link>

            <Link href="/history">
              <Button variant="secondary">View history</Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-3">
          <Feature
            number="01"
            title="Define the goal"
            description="Describe what you actually want to achieve."
          />

          <Feature
            number="02"
            title="Analyze the resource"
            description="OutcomeGuard extracts evidence and maps it to your requirements."
          />

          <Feature
            number="03"
            title="Get a verdict"
            description="See covered, partial, and missing requirements before investing your time."
          />
        </div>
      </section>
    </main>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <span className="text-xs font-semibold tracking-widest text-gray-400">
        {number}
      </span>

      <h2 className="mt-4 text-lg font-semibold text-gray-950">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}
