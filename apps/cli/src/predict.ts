import { predict } from "@predict-flow/ml";

async function main() {
  const result = await predict({
    csvPath: "data/prediction.csv",
    modelDirectory: "models/demo-model",
    outputPath: "output/predictions.csv",
  });

  console.log(`Predicted ${result.rows} rows`);
  console.log(`Predictions saved to ${result.outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});