import type { DatasetProfile } from "@predict-flow/core";
import { StatCard } from "./StatCard";
import { RecommendationBadge } from "./Badge";
import { formatColumnName } from "@/utils";

type DatasetProfileCardProps = {
  profile: DatasetProfile & {
    fileName?: string;
  };
};

export function DatasetProfileCard({
  profile,
}: DatasetProfileCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">
      <div className="mb-8">
        <p className="text-sm text-gray-400">Dataset Profile</p>

        <h2 className="mt-2 text-3xl font-semibold">
          {profile.fileName ?? profile.csvPath}
        </h2>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <StatCard
            label="Rows"
            value={profile.rowCount}
          />

          <StatCard
            label="Columns"
            value={profile.columnCount}
          />

          <StatCard
            label="Missing Values"
            value={profile.columns.reduce(
              (sum, column) => sum + column.missingCount,
              0
            )}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="px-4 py-3 font-medium">Column</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Recommendation</th>
              <th className="px-4 py-3 font-medium">Missing</th>
              <th className="px-4 py-3 font-medium">Unique</th>
            </tr>
          </thead>

          <tbody>
            {profile.columns.map((column) => (
              <tr
                key={column.name}
                className="border-t border-white/10"
              >
                <td className="px-4 py-3 font-medium">
                  {formatColumnName(column.name)}
                </td>

                <td className="px-4 py-3 text-gray-300">
                  {column.dataType.charAt(0).toUpperCase() + column.dataType.slice(1)}
                </td>

                <td className="px-4 py-3 text-gray-300">
                  <RecommendationBadge
                    recommendation={column.recommendation}
                  />
                </td>

                <td className="px-4 py-3 text-gray-400">
                  {column.missingCount}
                </td>

                <td className="px-4 py-3 text-gray-400">
                  {column.uniqueCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}