import type { DatasetProfile } from "@predict-flow/core";

export type TrainingStatus =
  | "idle"
  | "queued"
  | "running"
  | "succeeded"
  | "failed";

export type TrainingResult = {
  trainingTimeSeconds?: number;
  rowsUsed: number;
  featureCount: number;
  metricName?: string;
  metricValue?: number;
  modelDirectory: string;
} | null;

type PredictionResult = {
  rows: number;
  outputPath: string;
};

import { create } from "zustand";
import { persist } from "zustand/middleware";

type UploadedDatasetProfile = DatasetProfile & {
  fileName?: string;
};

type WizardState = {
  profile: UploadedDatasetProfile | null;
  selectedTarget: string | null;
  taskType: "regression" | "classification" | null;
  trainingStatus: TrainingStatus;
  trainingStep: string | null;
  trainingResult: TrainingResult | null;
  predictionResult: PredictionResult | null;

  setProfile(profile: UploadedDatasetProfile): void;
  setTarget(target: string, taskType: "regression" | "classification"): void;
  reset(): void;
  setTrainingStatus(status: TrainingStatus, step?: string | null): void;
  setTrainingResult(result: TrainingResult | null): void;
  setPredictionResult(result: PredictionResult): void;
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      profile: null,
      selectedTarget: null,
      taskType: null,

      trainingStatus: "idle",
      trainingStep: null,
      trainingResult: null,
      predictionResult: null,

      setProfile: (profile) =>
        set({
          profile,
          selectedTarget: null,
          taskType: null,
        }),

      setTarget: (selectedTarget, taskType) =>
        set({
          selectedTarget,
          taskType,
        }),

      reset: () =>
        set({
          profile: null,
          selectedTarget: null,
          taskType: null,
        }),

      setTrainingStatus: (status, step) =>
        set({
          trainingStatus: status,
          trainingStep: step ?? null,
        }),

      setTrainingResult: (result) =>
        set({
          trainingResult: result,
        }),

        setPredictionResult: (result) =>
        set({
          predictionResult: result,
        }),
    }),
    {
      name: "predict-flow-wizard",
    }
  )
);