import { NextRequest, NextResponse } from "next/server";
import { Dataset, Experiment, TaskType } from "@predict-flow/core";
import { trainModel } from "@predict-flow/ml";
import path from "node:path";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const csvPath = body.csvPath as string | undefined;
  const targetColumn = body.targetColumn as string | undefined;
  const taskType = body.taskType as TaskType | undefined;

  if (!csvPath || !targetColumn || !taskType) {
    return NextResponse.json(
      { error: "Missing csvPath, targetColumn, or taskType." },
      { status: 400 }
    );
  }

  const dataset = await Dataset.load(csvPath);

  const experiment = new Experiment("Web Training Run", dataset)
    .setTarget(targetColumn)
    .setTaskType(taskType);

  const modelDirectory = path.join(
    process.cwd(),
    "models",
    `model-${Date.now()}`
  );

  const result = await trainModel({
    experiment,
    modelDirectory,
    epochs: 100,
  });

  return NextResponse.json({
    ...result,
    modelDirectory,
  });
}