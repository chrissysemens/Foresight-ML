"use client";

import { useProjectStore } from "@/store/project-store";

export default function TargetPage() {
  const { columns, selectedTarget, setSelectedTarget } = useProjectStore();

  return (
    <div>
      {columns.map((column) => (
        <button
          key={column.name}
          onClick={() => setSelectedTarget(column.name)}
        >
          {selectedTarget === column.name ? "✓ " : ""}
          {column.name}
        </button>
      ))}
    </div>
  );
}