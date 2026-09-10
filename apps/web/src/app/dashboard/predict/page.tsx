"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadCard } from "@/components/UploadCard";
import { useWizardStore } from "@/store/wizard-store";

export default function PredictPage() {
    const router = useRouter();

    const {
        profile,
        trainingResult,
        setPredictionResult,
    } = useWizardStore();

    useEffect(() => {
        if (!profile) {
            router.push("/dashboard/upload");
            return;
        }

        if (!trainingResult) {
            router.push("/dashboard/train");
        }
    }, [profile, trainingResult, router]);

    async function uploadPredictionDataset(file: File) {
        if (!trainingResult) return;

        const formData = new FormData();

        formData.append("file", file);
        if (!trainingResult.modelDirectory) {
            throw new Error("Missing model directory for prediction.");
        }
        formData.append("modelDirectory", trainingResult.modelDirectory);

        const response = await fetch("/api/predict", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error("Prediction failed.");
        }

        setPredictionResult(result);
        router.push("/dashboard/predictions");
    }

    if (!profile || !trainingResult) {
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
                    Run Predictions
                </p>

                <h1 className="mt-2 text-3xl font-semibold">
                    Predict using your trained model
                </h1>

                <p className="mt-3 text-neutral-400">
                    Upload another CSV with the same feature columns to generate predictions.
                </p>

                <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
                    <p className="font-medium text-blue-300">
                        Expected CSV
                    </p>

                    <ul className="mt-4 space-y-2 text-neutral-300">
                        <li>• Same columns used during training</li>
                        <li>• Exclude the target column</li>
                        <li>• One prediction will be generated per row</li>
                    </ul>
                </div>

                <div className="mt-8">
                    <UploadCard onUpload={uploadPredictionDataset} />
                </div>

            </section>
        </main>
    );
}