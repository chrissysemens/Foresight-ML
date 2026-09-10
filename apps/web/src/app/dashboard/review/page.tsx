"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DatasetProfileCard } from "@/components/DatasetProfileCard";
import { formatColumnName, formatDataType } from "@/utils";
import { useWizardStore } from "@/store/wizard-store";

export default function ReviewPage() {
  const router = useRouter();
  const { profile, selectedTarget, setTarget } = useWizardStore();


  useEffect(() => {
    if (!profile) {
      router.push("/dashboard/upload");
    }
  }, [profile, router]);

  if (!profile) {
    return <main className="mx-auto max-w-4xl p-12">Loading...</main>;
  }

  const selectedColumn = profile?.columns.find(
    (column) => column.name === selectedTarget
  );

  const inferredTask =
    selectedColumn?.dataType === "number" ? "Regression" : "Classification";

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-12">
      <DatasetProfileCard profile={profile} />

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm text-gray-400">Choose Target</p>

        <h2 className="mt-2 text-3xl font-semibold">
          What do you want to predict?
        </h2>

        <div className="mt-6 space-y-3">
          {profile.columns.map((column) => (
            <button
              key={column.name}
              onClick={() => setTarget(column.name, column.dataType === "number" ? "regression" : "classification")}
              className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${selectedTarget === column.name
                ? "border-blue-500 bg-blue-500/10"
                : "border-white/10 hover:bg-white/5"
                }`}
            >
              <span>
                {selectedTarget === column.name ? "✓ " : ""}
                {formatColumnName(column.name)}
              </span>

              <span className="text-sm text-gray-400">
                {formatDataType(column.dataType)}
              </span>
            </button>
          ))}
        </div>

        {selectedColumn && (
          <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
            <p className="text-sm uppercase tracking-wide text-blue-300">
              Inferred Task
            </p>

            <h3 className="mt-2 text-2xl font-semibold">{inferredTask}</h3>

            <p className="mt-3 text-gray-300">
              <strong>{formatColumnName(selectedColumn.name)}</strong> is a{" "}
              <strong>{formatDataType(selectedColumn.dataType)}</strong> column,
              so Foresight ML recommends a{" "}
              <strong>{inferredTask.toLowerCase()}</strong> model.
            </p>
          </div>
        )}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => router.push("/dashboard/train")}
            disabled={!selectedTarget}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue →
          </button>
        </div>
      </section>
    </main>
  );
}