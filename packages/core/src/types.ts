export type TaskType = "regression" | "classification";

export type ColumnDataType = "number" | "category";

export type ColumnRecommendation = "keep" | "ignore" | "target_candidate";

export type ColumnProfile = {
  name: string;
  dataType: ColumnDataType;
  missingCount: number;
  uniqueCount: number;
  examples: string[];
  recommendation: ColumnRecommendation;
  reasons: string[];
};

export type ModelMetadata = {
  targetColumn: string;
  featureColumns: string[];
  taskType: TaskType;

  numericStats: Record<string, { mean: number; std: number }>;
  categoricalMappings: Record<string, Record<string, number>>;

  targetStats?: {
    mean: number;
    std: number;
  };

  targetMapping?: Record<string, number>;
};

export type DatasetColumn = {
  name: string;
  type: "number" | "category" | "date" | "text";
};

export type Project = {
  dataset: {
    fileName: string | null;
    rowCount: number;
    columnCount: number;
    columns: DatasetColumn[];
  };

  target: string | null;

  analysis: {
    problemType: "classification" | "regression" | null;
    missingValues: number;
    recommendedModel: string | null;
  };

  configuration: {
    algorithm: string | null;
    metric: string | null;
  };

  training: {
    status: "idle" | "running" | "complete";
    progress: number;
  };

  results: {
    accuracy?: number;
    rmse?: number;
  };
};

export type TrainingStatus = "idle" | "queued" | "running" | "succeeded" | "failed";

export type TrainingResult = {
  trainingTimeSeconds: number;
  rowsUsed: number;
  featureCount: number;
  metricName: string;
  metricValue: number;
};

