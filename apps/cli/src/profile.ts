import { profileDataset } from "@predict-flow/core";

const CSV_PATH = process.env.CSV_PATH ?? "data/training.csv";
const TARGET_COLUMN = process.env.TARGET_COLUMN;

async function main() {
    const profile = await profileDataset(
        CSV_PATH,
        TARGET_COLUMN ? { targetColumn: TARGET_COLUMN } : {}
    );

    console.log(`\nDataset Profile: ${profile.csvPath}`);
    console.log(`Rows: ${profile.rowCount}`);
    console.log(`Columns: ${profile.columnCount}\n`);

    console.table(
        profile.columns.map((column) => ({
            name: column.name,
            type: column.dataType,
            recommendation: column.recommendation,
            missing: column.missingCount,
            unique: column.uniqueCount,
            examples: column.examples.join(", "),
            reasons: column.reasons.join(" "),
        }))
    );
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});