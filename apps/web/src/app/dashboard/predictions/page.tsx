"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/store/wizard-store";
import { formatColumnName } from "@/utils";

export default function PredictionsPage() {
  const router = useRouter();

  const {
    profile,
    selectedTarget,
    taskType,
    trainingResult,
    predictionResult,
  } = useWizardStore();

  useEffect(() => {
    if (!profile) {
      router.push("/dashboard/upload");
      return;
    }

    if (!trainingResult) {
      router.push("/dashboard/train");
      return;
    }

    if (!predictionResult) {
      router.push("/dashboard/predict");
    }
  }, [profile, trainingResult, predictionResult, router]);

  if (!profile || !trainingResult || !predictionResult) {
    return (
      <main className="mx-auto max-w-5xl p-12">
        Loading...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-12">
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">

        <p className="text-sm text-neutral-400">
          Predictions
        </p>

        <h1 className="mt-2 text-3xl font-semibold">
          Predictions complete
        </h1>

        <p className="mt-3 text-neutral-400">
          Your model generated predictions for {predictionResult.rows} records.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">

          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-neutral-400">
              Rows Processed
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {predictionResult.rows}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-neutral-400">
              Target Column
            </p>

            <p className="mt-2 text-xl font-semibold">
              {selectedTarget && formatColumnName(selectedTarget)}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-neutral-400">
              Task Type
            </p>

            <p className="mt-2 text-xl font-semibold capitalize">
              {taskType}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-sm text-emerald-300">
              Status
            </p>

            <p className="mt-2 text-2xl font-semibold">
              Ready to Download
            </p>
          </div>

        </div>

        <div className="mt-10 flex justify-end gap-3">

          <button
            onClick={() => router.push("/dashboard/predict")}
            className="rounded-xl border border-neutral-700 px-5 py-3 font-medium text-neutral-300 hover:bg-neutral-900"
          >
            Predict Another CSV
          </button>

          <button
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500"
          >
            Download Predictions
          </button>

        </div>

      </section>
    </main>
  );
}