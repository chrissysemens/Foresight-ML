import * as tf from "@tensorflow/tfjs-node";
import { ModelMetadata, TaskType } from "../types";

const mean = (values: number[]) => {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

const std = (values: number[], avg: number) => {
  const variance =
    values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;

  return Math.sqrt(variance) || 1;
}

export const buildMetadata = (
  rows: Record<string, string>[],
  targetColumn: string,
  featureColumns: string[],
  taskType: TaskType
): ModelMetadata => {
  const numericStats: ModelMetadata["numericStats"] = {};
  const categoricalMappings: ModelMetadata["categoricalMappings"] = {};

  for (const column of featureColumns) {
    const values = rows.map((row) => row[column] ?? "");
    const numericValues = values
      .map(Number)
      .filter((value) => Number.isFinite(value));

    if (numericValues.length / values.length > 0.9) {
      const avg = mean(numericValues);
      numericStats[column] = {
        mean: avg,
        std: std(numericValues, avg),
      };
    } else {
      const uniqueValues = Array.from(new Set(values.filter(Boolean)));
      categoricalMappings[column] = Object.fromEntries(
        uniqueValues.map((value, index) => [value, index])
      );
    }
  }

  let targetMapping: Record<string, number> | undefined;
  let targetStats: { mean: number; std: number } | undefined;

  if (taskType === "classification") {
    const labels = Array.from(
      new Set(rows.map((row) => row[targetColumn]).filter(Boolean))
    );

    targetMapping = Object.fromEntries(
      labels.map((label, index) => [label, index])
    );
  }

  if (taskType === "regression") {
    const targetValues = rows
      .map((row) => Number(row[targetColumn]))
      .filter(Number.isFinite);

    const avg = mean(targetValues);

    targetStats = {
      mean: avg,
      std: std(targetValues, avg),
    };
  }

  const metadata: ModelMetadata = {
    targetColumn,
    featureColumns,
    taskType,
    numericStats,
    categoricalMappings,
  };

  if (targetStats) {
    metadata.targetStats = targetStats;
  }

  if (targetMapping) {
    metadata.targetMapping = targetMapping;
  }

  return metadata;
}

export const rowsToFeatures = (
  rows: Record<string, string>[],
  metadata: ModelMetadata
): number[][] => {
  return rows.map((row) =>
    metadata.featureColumns.map((column) => {
      const value = row[column] ?? "";

      if (metadata.numericStats[column]) {
        const numberValue = Number(value);
        const safeValue = Number.isFinite(numberValue)
          ? numberValue
          : metadata.numericStats[column].mean;

        return (
          (safeValue - metadata.numericStats[column].mean) /
          metadata.numericStats[column].std
        );
      }

      const mapping = metadata.categoricalMappings[column];
      return mapping?.[value] ?? -1;
    })
  );
}

export const rowsToLabels = (
  rows: Record<string, string>[],
  metadata: ModelMetadata
): number[] => {
  return rows.map((row) => {
    const value = row[metadata.targetColumn] ?? "";

    if (metadata.taskType === "regression") {
      const numberValue = Number(value);
      if (!Number.isFinite(numberValue)) {
        throw new Error(`Invalid numeric target value: ${value}`);
      }

      return numberValue;
    }

    const mapped = metadata.targetMapping?.[value];

    if (mapped === undefined) {
      throw new Error(`Unknown classification target value: ${value}`);
    }

    return mapped;
  });
}

export const toTrainingTensors = (
  rows: Record<string, string>[],
  metadata: ModelMetadata
) => {
  const xs = tf.tensor2d(rowsToFeatures(rows, metadata));
  const labels = rowsToLabels(rows, metadata);

  const ys =
    metadata.taskType === "classification"
      ? tf.oneHot(
        tf.tensor1d(labels, "int32"),
        Object.keys(metadata.targetMapping ?? {}).length
      )
      : tf.tensor2d(labels, [labels.length, 1]);

  return { xs, ys };
}