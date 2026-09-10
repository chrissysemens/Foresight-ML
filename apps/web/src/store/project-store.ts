import { create } from "zustand";
import { DatasetColumn } from "@predict-flow/core";

type ProjectStore = {
  fileName: string | null;
  columns: DatasetColumn[];
  selectedTarget: string | null;

  setFileName: (fileName: string) => void;
  setColumns: (columns: DatasetColumn[]) => void;
  setSelectedTarget: (target: string) => void;

  resetProject: () => void;
};

export const useProjectStore = create<ProjectStore>((set) => ({
  fileName: null,
  columns: [],
  selectedTarget: null,

  setFileName: (fileName) => set({ fileName }),
  setColumns: (columns) => set({ columns }),
  setSelectedTarget: (target) => set({ selectedTarget: target }),

  resetProject: () =>
    set({
      fileName: null,
      columns: [],
      selectedTarget: null,
    }),
}));