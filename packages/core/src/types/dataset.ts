export type DatasetColumn = {
  name: string;
  type: "number" | "category" | "date" | "text";
};

export type DatasetSummary = {
  fileName: string | null;
  rowCount: number;
  columnCount: number;
  columns: DatasetColumn[];
};