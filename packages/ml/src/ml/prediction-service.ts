import fs from "node:fs";
import path from "node:path";
import * as tf from "@tensorflow/tfjs-node";
import Papa from "papaparse";
import {
  Dataset,
  ModelMetadata,
} from "@predict-flow/core";

import { rowsToFeatures } from "../preprocessing/preprocess";

export interface PredictOptions {
  csvPath: string;
  modelDirectory: string;
  outputPath: string;
}

export interface PredictionResult {
  rows: number;
  outputPath: string;
}

export async function predict(options: PredictOptions): Promise<PredictionResult> {
const dataset = await Dataset.load(options.csvPath);
const rows = dataset.rows;

  const metadata = JSON.parse(
    fs.readFileSync(path.join(options.modelDirectory, "metadata.json"), "utf8")
  ) as ModelMetadata;

  const model = await tf.loadLayersModel(
    `file://${options.modelDirectory}/model.json`
  );

  const features = rowsToFeatures(rows, metadata);
  const xs = tf.tensor2d(features);

  const predictions = model.predict(xs) as tf.Tensor2D;
  const predictionRows = (await predictions.array()) as number[][];

  const reverseTargetMapping = metadata.targetMapping
    ? (Object.fromEntries(
        Object.entries(metadata.targetMapping).map(([label, value]) => [
          value,
          label,
        ])
      ) as Record<number, string>)
    : {};

  const output = rows.map((row, index) => {
    const predictionRow = predictionRows[index];

    if (!predictionRow) {
      throw new Error(`Missing prediction for row ${index}`);
    }

    return {
      ...row,
      prediction: getPrediction(predictionRow, metadata, reverseTargetMapping),
    };
  });

  fs.mkdirSync(path.dirname(options.outputPath), { recursive: true });
  fs.writeFileSync(options.outputPath, Papa.unparse(output));

  xs.dispose();
  predictions.dispose();

  return {
    rows: rows.length,
    outputPath: options.outputPath,
  };
}

function getPrediction(
  predictionRow: number[],
  metadata: ModelMetadata,
  reverseMapping: Record<number, string>
): string | number {
  if (metadata.taskType === "classification") {
    const classIndex = predictionRow.indexOf(Math.max(...predictionRow));
    return reverseMapping[classIndex] ?? classIndex;
  }

  if (predictionRow.length !== 1) {
    throw new Error(`Unexpected regression shape for prediction row ${predictionRow}`);
  }

  const value = predictionRow[0];

  if (value === undefined) {
    throw new Error(`Regression prediction row ${predictionRow} is empty`);
  }

  if (!metadata.targetStats) {
    throw new Error("Missing targetStats for regression model");
  }

  return value * metadata.targetStats.std + metadata.targetStats.mean;
}