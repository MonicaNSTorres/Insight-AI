export type MetricColumn = {
  key: string;
  label: string;
};

export type DimensionColumn = {
  key: string;
  label: string;
};

export type TemporalColumn = {
  key: string;
  label: string;
};

export type PreparedAnalysis = {
  rowCount: number;
  columns: string[];
  metrics: MetricColumn[];
  dimensions: DimensionColumn[];
  temporal?: TemporalColumn | null;
  rows: Record<string, unknown>[];
};

export type DatasetKPI = {
  label: string;
  value: number | string;
  description?: string;
};

export type ChartSuggestion = {
  type: "bar" | "line" | "area" | "pie";
  title: string;
  xKey: string;
  yKey: string;
  data: Record<string, unknown>[];
};

export type DiscoveredInsightType =
  | "trend"
  | "ranking"
  | "concentration"
  | "outlier"
  | "distribution";

export type InsightSeverity = "low" | "medium" | "high";

export type DiscoveredInsight = {
  id: string;
  type: DiscoveredInsightType;
  title: string;
  description: string;
  impactScore: number;
  confidenceScore: number;
  severity: InsightSeverity;
  supportingMetric?: string;
  supportingDimension?: string;
  chartSuggestion?: ChartSuggestion | null;
};

export type PrioritizedInsights = {
  headline: DiscoveredInsight | null;
  topInsights: DiscoveredInsight[];
  secondaryInsights: DiscoveredInsight[];
};

export type DatasetAnalysisResult = {
  summary: {
    rowCount: number;
    metricCount: number;
    dimensionCount: number;
    temporalDetected: boolean;
  };
  kpis: DatasetKPI[];
  charts: ChartSuggestion[];
  discoveredInsights: DiscoveredInsight[];
  prioritizedInsights: PrioritizedInsights;
  narrative: string[];
};