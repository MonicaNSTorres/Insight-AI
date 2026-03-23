import {
  DiscoveredInsight,
  PrioritizedInsights,
} from "./analysis-types";

function severityWeight(severity: DiscoveredInsight["severity"]) {
  switch (severity) {
    case "high":
      return 15;
    case "medium":
      return 8;
    case "low":
    default:
      return 0;
  }
}

function typeWeight(type: DiscoveredInsight["type"]) {
  switch (type) {
    case "concentration":
      return 12;
    case "trend":
      return 10;
    case "outlier":
      return 8;
    case "ranking":
      return 6;
    case "distribution":
      return 5;
    default:
      return 0;
  }
}

function finalScore(insight: DiscoveredInsight) {
  return (
    insight.impactScore * 0.6 +
    insight.confidenceScore * 0.25 +
    severityWeight(insight.severity) +
    typeWeight(insight.type)
  );
}

export function prioritizeInsights(
  insights: DiscoveredInsight[]
): PrioritizedInsights {
  const sorted = [...insights].sort((a, b) => finalScore(b) - finalScore(a));

  return {
    headline: sorted[0] ?? null,
    topInsights: sorted.slice(0, 3),
    secondaryInsights: sorted.slice(3, 8),
  };
}