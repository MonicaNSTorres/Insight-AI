import { detectColumns, DetectedColumn } from "@/src/lib/schema-detector";

export type PreparedDatasetAnalysis = {
  rows: any[];
  metricCandidates: string[];
  dimensionCandidates: string[];
  temporalCandidates: string[];
};

export function prepareDatasetAnalysis(
  rows: any[]
): PreparedDatasetAnalysis | null {
  if (!rows || rows.length === 0) {
    return null;
  }

  const columns: DetectedColumn[] = detectColumns(rows);

  const metricCandidates = columns
    .filter((c) => c.semanticRole === "metric")
    .map((c) => c.name);

  const dimensionCandidates = columns
    .filter((c) => c.semanticRole === "dimension")
    .map((c) => c.name);

  const temporalCandidates = columns
    .filter((c) => c.semanticRole === "temporal")
    .map((c) => c.name);

  return {
    rows,
    metricCandidates,
    dimensionCandidates,
    temporalCandidates,
  };
}