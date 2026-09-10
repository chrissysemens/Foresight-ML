export function formatColumnName(name: string) {
  return name
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function recommendationLabel(recommendation: string) {
  if (recommendation === "keep") return "✓ Keep";
  if (recommendation === "ignore") return "Ignore";
  if (recommendation === "target_candidate") return "🎯 Target Candidate";

  return recommendation;
}

export function formatDataType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}