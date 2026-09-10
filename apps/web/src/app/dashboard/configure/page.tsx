"use client";

import { useRouter } from "next/navigation";
import { formatColumnName } from "@/utils";
import { useWizardStore } from "@/store/wizard-store";

export default function ConfigurePage() {
  const router = useRouter();

  const { profile, selectedTarget, taskType } = useWizardStore();

  if (!profile) {
    router.push("/dashboard/upload");
    return null;
  }

  if (!selectedTarget || !taskType) {
    router.push("/dashboard/review");
    return null;
  }

  const featureColumns = profile.columns.filter(
    (column) => column.name !== selectedTarget
  );

  return (
    <main className="mx-auto max-w-4xl p-12">
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm text-gray-400">Configure Model</p>

        <h2 className="mt-2 text-3xl font-semibold">
          Review your experiment
        </h2>

        <div className="mt-8 grid gap-4">
          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-gray-400">Dataset</p>
            <p className="mt-2 text-xl font-medium">
              {profile.fileName ?? profile.csvPath}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-gray-400">Target</p>
            <p className="mt-2 text-xl font-medium">
              {formatColumnName(selectedTarget)}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-gray-400">Task</p>
            <p className="mt-2 text-xl font-medium">
              {taskType.charAt(0).toUpperCase() + taskType.slice(1)}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-400">Features</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {featureColumns.map((column) => (
              <span
                key={column.name}
                className="rounded-full bg-white/10 px-3 py-1 text-sm text-gray-300"
              >
                {formatColumnName(column.name)}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}