"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/store/wizard-store";
import { formatColumnName } from "@/utils";

export default function ResultsPage() {
  const router = useRouter();

  const { profile, selectedTarget, taskType, trainingResult } =
    useWizardStore();

  useEffect(() => {
    if (!profile) {
      router.push("/dashboard/upload");
      return;
    }

    if (!selectedTarget) {
      router.push("/dashboard/review");
      return;
    }

    if (!trainingResult) {
      router.push("/dashboard/train");
    }
  }, [profile, selectedTarget, trainingResult, router]);

  if (!profile || !selectedTarget || !trainingResult) {
    return <main className="mx-auto max-w-5xl p-12">Loading...</main>;
  }

  return (
    <main className="mx-auto max-w-5xl p-12">
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">
        <p className="text-sm text-neutral-400">Results</p>

        <h1 className="mt-2 text-3xl font-semibold">
          Model trained successfully
        </h1>

        <p className="mt-3 text-neutral-400">
          Your {taskType} model is ready to use.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-sm text-emerald-300">
              {trainingResult.metricName}
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {trainingResult.metricValue}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-neutral-400">Training Time</p>

            <p className="mt-2 text-3xl font-semibold">
              {trainingResult.trainingTimeSeconds}s
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-neutral-400">Rows Used</p>

            <p className="mt-2 text-3xl font-semibold">
              {trainingResult.rowsUsed.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-neutral-400">Features</p>

            <p className="mt-2 text-3xl font-semibold">
              {trainingResult.featureCount}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-white/10 p-6">
          <p className="font-medium">Model summary</p>

          <div className="mt-4 space-y-2 text-neutral-300">
            <p>Dataset: {profile.fileName ?? "Uploaded CSV"}</p>
            <p>Target: {formatColumnName(selectedTarget)}</p>
            <p className="capitalize">Task type: {taskType}</p>
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <button
            onClick={() => router.push("/dashboard/upload")}
            className="rounded-xl border border-neutral-700 px-5 py-3 font-medium text-neutral-300 hover:bg-neutral-900"
          >
            Train Another Model
          </button>

          <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500"
            onClick={() => router.push("/dashboard/predict")}>
            Run Predictions →
          </button>
        </div>
      </section>
    </main>
  );
}