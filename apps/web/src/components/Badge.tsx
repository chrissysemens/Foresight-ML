type Props = {
  recommendation: string;
};

export function RecommendationBadge({ recommendation }: Props) {
  switch (recommendation) {
    case "keep":
      return (
        <span className="rounded-full bg-green-500/20 px-3 py-1 text-green-400">
          Keep
        </span>
      );

    case "ignore":
      return (
        <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-yellow-400">
          Ignore
        </span>
      );

    case "target_candidate":
      return (
        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-blue-400">
          Target
        </span>
      );

    default:
      return (
        <span className="rounded-full bg-gray-500/20 px-3 py-1">
          {recommendation}
        </span>
      );
  }
}