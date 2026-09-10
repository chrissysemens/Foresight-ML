import { Dataset, Experiment } from "@predict-flow/core";
import { trainModel } from "@predict-flow/ml";

const TRAINING_CSV = "data/training.csv";
const MODEL_DIR = "models/demo-model";

async function main() {
  const dataset = await Dataset.load(TRAINING_CSV);

  const experiment = new Experiment(
    "Demo Experiment",
    dataset
  );

  experiment.setTarget("target");
  experiment.setTaskType("regression");

  const result = await trainModel({
    experiment,
    modelDirectory: MODEL_DIR,
    epochs: 100,
  });

  console.log("\nTraining Summary");
  console.log("----------------");
  console.log(`Rows: ${result.rows}`);
  console.log(`Features: ${result.featureCount}`);
  console.log(`Task: ${result.taskType}`);
  console.log(`Target: ${result.targetColumn}`);

  if (result.finalLoss !== undefined) {
    console.log(`Loss: ${result.finalLoss.toFixed(4)}`);
  }

  if (result.validationLoss !== undefined) {
    console.log(`Validation Loss: ${result.validationLoss.toFixed(4)}`);
  }

  for (const warning of result.warnings) {
    console.warn(`Warning: ${warning}`);
  }

  console.log(`\nModel saved to ${MODEL_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});