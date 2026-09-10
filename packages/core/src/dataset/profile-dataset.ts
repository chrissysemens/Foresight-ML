import { ProfileOptions } from "../csv/profiler";
import { ColumnProfile } from "../types";
import { Dataset } from "./dataset";

export interface DatasetProfile {
  csvPath: string;
  rowCount: number;
  columnCount: number;
  columns: ColumnProfile[];
}

export async function profileDataset(
  csvPath: string,
  options: ProfileOptions = {}
): Promise<DatasetProfile> {
  const dataset = await Dataset.load(csvPath);
  const columns = dataset.profile(options);

  return {
    csvPath: dataset.csvPath,
    rowCount: dataset.rowCount,
    columnCount: dataset.columnNames.length,
    columns,
  };
}