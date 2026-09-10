import fs from "node:fs";
import Papa from "papaparse";

export async function readCsv(path: string): Promise<Record<string, string>[]> {
  const csv = fs.readFileSync(path, "utf8");

  const result = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length) {
    throw new Error(result.errors.map(e => e.message).join("\n"));
  }

  return result.data;
}