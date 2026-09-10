"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DatasetProfile } from "@predict-flow/core";
import { UploadCard } from "@/components/UploadCard";
import { useWizardStore } from "@/store/wizard-store";

type UploadedDatasetProfile = DatasetProfile & {
  fileName?: string;
};

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setProfile } = useWizardStore();

  async function upload(file: File) {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/profile", {
      method: "POST",
      body: formData,
    });

    const profile = (await response.json()) as UploadedDatasetProfile;

    setProfile(profile);
    setLoading(false);
    router.push("/dashboard/review");
  }

  return (
    <main className="mx-auto max-w-4xl p-12">
      <div className="mb-10">
        <h1 className="text-5xl font-bold">Foresight ML</h1>

        <p className="mt-3 text-lg text-gray-500">
          Machine learning experiments without writing code.
        </p>
      </div>

      <UploadCard onUpload={upload} />

      {loading && (
        <p className="mt-6 text-gray-400">Profiling dataset...</p>
      )}
    </main>
  );
}