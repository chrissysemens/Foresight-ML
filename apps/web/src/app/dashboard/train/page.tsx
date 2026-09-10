"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/store/wizard-store";
import { formatColumnName } from "@/utils";

export default function TrainPage() {
  const router = useRouter();

  const {
    profile,
    selectedTarget,
    taskType,
    trainingStatus,
    trainingStep,
    setTrainingStatus,
    setTrainingResult,
  } = useWizardStore();

  useEffect(() => {
    if (!profile) {
      router.push("/dashboard/upload");
      return;
    }

    if (!selectedTarget) {
      router.push("/dashboard/review");
    }
  }, [profile, selectedTarget, router]);

  if (!profile || !selectedTarget) {
    return <main className="mx-auto max-w-5xl p-12">Loading...</main>;
  }

  const featureColumns = profile.columns.filter(
    (column) => column.name !== selectedTarget
  );

  const isTraining =
    trainingStatus === "queued" || trainingStatus === "running";

  async function startTraining() {
    if (!profile || !selectedTarget || !taskType) return;

    setTrainingStatus("queued", "Starting training job...");

    try {
      setTrainingStatus("running", "Training model...");

      const response = await fetch("/api/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          csvPath: profile.csvPath,
          targetColumn: selectedTarget,
          taskType,
        }),
      });

      if (!response.ok) {
        throw new Error("Training failed.");
      }

      const result = await response.json();

      setTrainingResult({
        trainingTimeSeconds: 0,
        rowsUsed: result.rows,
        featureCount: result.featureCount,
        metricName:
          taskType === "regression" ? "Validation Loss" : "Validation Loss",
        metricValue: result.validationLoss ?? result.finalLoss ?? 0,
        modelDirectory: result.modelDirectory,
      });

      setTrainingStatus("succeeded", "Training complete.");
      router.push("/dashboard/results");
    } catch (error) {
      console.error(error);
      setTrainingStatus("failed", "Training failed.");
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-12">
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">
        <p className="text-sm text-neutral-400">Train Model</p>

        <h1 className="mt-2 text-3xl font-semibold">
          Ready to train your model
        </h1>

        <p className="mt-3 text-neutral-400">
          Foresight ML has everything it needs to start training.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-neutral-400">Dataset</p>
            <p className="mt-2 font-medium">
              {profile.fileName ?? "Uploaded CSV"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-neutral-400">Task</p>
            <p className="mt-2 font-medium capitalize">
              {taskType ?? "Unknown"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-neutral-400">Target</p>
            <p className="mt-2 font-medium">
              {formatColumnName(selectedTarget)}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-neutral-400">Features</p>
            <p className="mt-2 font-medium">{featureColumns.length}</p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
          <p className="font-medium text-blue-300">Training plan</p>

          <ul className="mt-4 space-y-3 text-neutral-300">
            <li>✓ Validate dataset</li>
            <li>✓ Use {featureColumns.length} feature columns</li>
            <li>✓ Predict {formatColumnName(selectedTarget)}</li>
            <li>✓ Train a {taskType ?? "machine learning"} model</li>
            <li>✓ Save the trained model</li>
          </ul>
        </div>
        <div className="mt-10 flex justify-end">
          <button
            onClick={startTraining}
            disabled={isTraining}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isTraining ? "Training..." : "Start Training"}
          </button>
        </div>
      </section>
    </main>
  );
}