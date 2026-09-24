"use client";

import { useRouter } from "next/navigation";
import { Check, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import GoalForm from "@/components/forms/GoalForm";
import ResourceForm from "@/components/forms/ResourceForm";

export default function AnalyzeWorkspace() {
  const router = useRouter();
  const [goalId, setGoalId] = useState<string>();
  const [resourceId, setResourceId] = useState<string>();
  const [requirements, setRequirements] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  async function runAnalysis() {
    if (!goalId || !resourceId) return;

    setError("");
    setAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId, resourceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Analysis failed.");
      }

      router.push(`/analyze/${data.analysis.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
      setAnalyzing(false);
    }
  }

  return (
    <div className="og-workspace">
      <section className="og-intro">
        <div className="og-kicker"><span /> Evidence before effort</div>
        <h1>Does this resource actually get you there?</h1>
        <p>
          OutcomeGuard turns a goal into verifiable requirements, checks a
          resource against them, and leaves you with evidence instead of a
          vague recommendation.
        </p>
      </section>

      <div className="og-step-grid">
        <section className="og-panel">
          <div className="og-step-head">
            <div className="og-step-number">01</div>
            <div>
              <p className="og-eyebrow">The outcome</p>
              <h2>Define the goal</h2>
              <p>Describe the result you want to be able to achieve.</p>
            </div>
            {goalId && <span className="og-complete"><Check size={14} /> Ready</span>}
          </div>

          <GoalForm
            onCreated={(data) => {
              setGoalId(data.goalId);
              setRequirements(data.requirements);
              setResourceId(undefined);
              setError("");
            }}
          />

          {requirements.length > 0 && (
            <div className="og-requirements">
              <div className="og-requirements-title">
                <Sparkles size={15} />
                Requirements extracted
              </div>
              <div className="og-requirement-list">
                {requirements.map((item, index) => (
                  <div key={item.id ?? index} className="og-requirement">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className={`og-panel ${!goalId ? "og-panel-muted" : ""}`}>
          <div className="og-step-head">
            <div className="og-step-number">02</div>
            <div>
              <p className="og-eyebrow">The evidence</p>
              <h2>Add the resource</h2>
              <p>Give OutcomeGuard the material you are considering.</p>
            </div>
            {resourceId && <span className="og-complete"><Check size={14} /> Ready</span>}
          </div>

          {!goalId ? (
            <div className="og-locked">
              <p>Define your goal first.</p>
              <span>The resource is evaluated in the context of that goal.</span>
            </div>
          ) : (
            <ResourceForm
              onCreated={(data) => {
                setResourceId(data.resourceId);
                setError("");
              }}
            />
          )}
        </section>
      </div>

      <section className="og-runbar">
        <div>
          <p className="og-eyebrow">Final step</p>
          <h2>Run the verification</h2>
          <p>
            We will retrieve evidence, evaluate every requirement, then run an
            independent consistency check.
          </p>
        </div>

        <button
          type="button"
          className="og-run-button"
          disabled={!goalId || !resourceId || analyzing}
          onClick={runAnalysis}
        >
          {analyzing ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              Analyze resource
              <ChevronRight size={17} />
            </>
          )}
        </button>
      </section>

      {error && <div className="og-error" role="alert">{error}</div>}
    </div>
  );
}
