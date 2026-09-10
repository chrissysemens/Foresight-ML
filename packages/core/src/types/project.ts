import type { DatasetSummary } from "./dataset";

export type Project = {
  dataset: DatasetSummary;

  target: string | null;

  analysis: {
    problemType: "classification" | "regression" | null;
    missingValues: number;
    recommendedModel: string | null;
  };

  configuration: {
    algorithm: string | null;
    metric: string | null;
  };

  training: {
    status: "idle" | "running" | "complete";
    progress: number;
  };

  results: {
    accuracy?: number;
    rmse?: number;
  };
};