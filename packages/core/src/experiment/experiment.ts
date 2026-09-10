import { Dataset } from "../dataset/dataset.js";
import { TaskType } from "../types.js";


export class Experiment {
  private targetColumn: string | null = null;
  private taskType: TaskType | null = null;
  private ignoredColumns = new Set<string>();
  private selectedColumns: Set<string> | null = null;

  constructor(
    public readonly name: string,
    public readonly dataset: Dataset
  ) {}

  setTarget(column: string): Experiment {
    this.targetColumn = column;
    return this;
  }

  setTaskType(taskType: TaskType): Experiment {
    this.taskType = taskType;
    return this;    
  }

  ignoreColumn(column: string): Experiment {
    this.ignoredColumns.add(column);
    return this;
  }

  useOnlyColumns(columns: string[]): Experiment {
    this.selectedColumns = new Set(columns);
    return this;
  }

  clearSelectedColumns(): Experiment {
    this.selectedColumns = null;
    return this;
  }

  getTargetColumn(): string {
    if (!this.targetColumn) {
      throw new Error("Experiment target column has not been set.");
    }

    return this.targetColumn;
  }

  getTaskType(): TaskType {
    if (!this.taskType) {
      throw new Error("Experiment task type has not been set.");
    }

    return this.taskType;
  }

  getFeatureColumns(): string[] {
    const targetColumn = this.getTargetColumn();
    const recommendedColumns = this.dataset.featureColumns(targetColumn);

    return recommendedColumns.filter((column) => {
      if (this.ignoredColumns.has(column)) return false;

      if (this.selectedColumns) {
        return this.selectedColumns.has(column);
      }

      return true;
    });
  }
}