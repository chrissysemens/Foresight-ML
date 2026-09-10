import fs from "node:fs";
import path from "node:path";
import {
  Experiment,
  TaskType
} from "@predict-flow/core";
import { createModel } from "./model-factory.js";

import {
  buildMetadata,
  toTrainingTensors,
} from "../preprocessing/preprocess";

export interface TrainModelOptions {
  experiment: Experiment;
  modelDirectory: string;
  epochs?: number;
}

export interface TrainingResult {
    rows: number;
    featureCount: number;
    taskType: TaskType;
    targetColumn: string;
    featureColumns: string[];
    finalLoss?: number;
    validationLoss?: number;
    warnings: string[];
}

export async function trainModel(
    options: TrainModelOptions
): Promise<TrainingResult> {
    const experiment = options.experiment;

    const dataset = experiment.dataset;
    const rows = dataset.rows;
    const featureColumns = experiment.getFeatureColumns();

    if (featureColumns.length === 0) {
        throw new Error("No usable feature columns found.");
    }

    const warnings: string[] = [];



    if (rows.length < 50) {
        warnings.push("Dataset is very small. Predictions are unlikely to be reliable.");
    }

    const metadata = buildMetadata(rows, experiment.getTargetColumn(), featureColumns, experiment.getTaskType());
    const { xs, ys } = toTrainingTensors(rows, metadata);

    const model = createModel(featureColumns.length, metadata);

    const history = await model.fit(xs, ys, {
        epochs: options.epochs ?? 100,
        validationSplit: 0.2,
        shuffle: true,
    });

    const lossHistory = history.history["loss"] as number[] | undefined;
    const valLossHistory = history.history["val_loss"] as number[] | undefined;

    const finalLoss = lossHistory?.at(-1);
    const validationLoss = valLossHistory?.at(-1);

    fs.mkdirSync(options.modelDirectory, { recursive: true });

    await model.save(`file://${options.modelDirectory}`);

    fs.writeFileSync(
        path.join(options.modelDirectory, "metadata.json"),
        JSON.stringify(metadata, null, 2)
    );

    xs.dispose();
    ys.dispose();

    const result: TrainingResult = {
        rows: rows.length,
        featureCount: featureColumns.length,
        taskType: experiment.getTaskType(),
        targetColumn: experiment.getTargetColumn(),
        featureColumns,
        warnings,
    };

    if (finalLoss !== undefined) {
        result.finalLoss = finalLoss;
    }

    if (validationLoss !== undefined) {
        result.validationLoss = validationLoss;
    }

    fs.writeFileSync(
        path.join(options.modelDirectory, "training-report.json"),
        JSON.stringify(result, null, 2)
    );

    return result;
}