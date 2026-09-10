import { ColumnProfile, ColumnDataType } from "../types.js";

export interface ProfileOptions {
  targetColumn?: string;
}

function isNumericValue(value: string): boolean {
  if (value.trim() === "") return false;
  return Number.isFinite(Number(value));
}

function looksLikeIdentifier(columnName: string): boolean {
  const normalized = columnName.toLowerCase();

  return (
    normalized === "id" ||
    normalized.endsWith("_id") ||
    normalized.endsWith("id") ||
    normalized.includes("uuid") ||
    normalized.includes("email")
  );
}

export interface ProfileOptions {
  targetColumn?: string;
}

export function profileRows(
  rows: Record<string, string>[],
  options: ProfileOptions = {}
): ColumnProfile[] {
  if (rows.length === 0) throw new Error("CSV has no rows.");

  const firstRow = rows[0];

  if (!firstRow) {
    throw new Error("CSV has no rows.");
  }

  const columns = Object.keys(firstRow);

  return columns.map((name) => {
    const values = rows.map((row) => row[name] ?? "");
    const nonEmptyValues = values.filter((value) => value.trim() !== "");
    const numericCount = nonEmptyValues.filter(isNumericValue).length;
    const uniqueValues = new Set(nonEmptyValues);

    const dataType: ColumnDataType =
      numericCount / Math.max(nonEmptyValues.length, 1) > 0.9
        ? "number"
        : "category";

    const reasons: string[] = [];
    let recommendation: ColumnProfile["recommendation"] = "keep";

    const uniqueRatio = uniqueValues.size / Math.max(nonEmptyValues.length, 1);

    if (looksLikeIdentifier(name)) {
      recommendation = "ignore";
      reasons.push("Column name looks like an identifier.");
    }

    if (dataType === "category" && uniqueRatio > 0.9 && rows.length >= 20) {
      recommendation = "ignore";
      reasons.push("Most values are unique, so this may not generalize well.");
    }

    if (nonEmptyValues.length === 0) {
      recommendation = "ignore";
      reasons.push("Column has no usable values.");
    }

    if (dataType === "number" && uniqueValues.size > 2) {
      reasons.push("Numeric column could be useful for regression or classification.");
    }

    if (dataType === "category" && uniqueValues.size <= 20) {
      reasons.push("Categorical column has a manageable number of values.");
    }

    if (name === options.targetColumn) {
      recommendation = "target_candidate";
      reasons.unshift("Selected as the prediction target.");
    }

    return {
      name,
      dataType,
      missingCount: values.length - nonEmptyValues.length,
      uniqueCount: uniqueValues.size,
      examples: Array.from(uniqueValues).slice(0, 5),
      recommendation,
      reasons,
    };
  });
}