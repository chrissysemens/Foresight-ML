
import { readCsv } from "../csv/parser.js";
import { ProfileOptions, profileRows } from "../csv/profiler.js";
import { ColumnProfile } from "../types.js";

export class Dataset {
  private constructor(
    public readonly csvPath: string,
    public readonly rows: Record<string, string>[]
  ) { }

  static async load(csvPath: string): Promise<Dataset> {
    const rows = await readCsv(csvPath);
    return new Dataset(csvPath, rows);
  }

  get rowCount(): number {
    return this.rows.length;
  }

  get columnNames(): string[] {
    const firstRow = this.rows[0];

    if (!firstRow) {
      return [];
    }

    return Object.keys(firstRow);
  }

  profile(options: ProfileOptions = {}): ColumnProfile[] {
    return profileRows(this.rows, options);
  }

  featureColumns(targetColumn: string): string[] {
    return this.profile({ targetColumn })
      .filter((column) => column.name !== targetColumn)
      .filter((column) => column.recommendation !== "ignore")
      .map((column) => column.name);
  }
}