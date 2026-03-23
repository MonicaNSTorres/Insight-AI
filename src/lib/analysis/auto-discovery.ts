import {
  ChartSuggestion,
  DimensionColumn,
  DiscoveredInsight,
  MetricColumn,
  PreparedAnalysis,
} from "./analysis-types";

type BasicAnalysisInput = {
  kpis?: unknown[];
  charts?: unknown[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function safeNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value
      .trim()
      .replace(/\./g, "")
      .replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}

function isNonEmpty(value: unknown) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function pickPrimaryMetric(metrics: MetricColumn[]): MetricColumn | null {
  if (!metrics.length) return null;

  const priorityTerms = [
    "receita",
    "faturamento",
    "venda",
    "valor",
    "total",
    "quantidade",
    "custo",
    "lucro",
  ];

  const found = metrics.find((metric) =>
    priorityTerms.some((term) =>
      metric.key.toLowerCase().includes(term) ||
      metric.label.toLowerCase().includes(term)
    )
  );

  return found ?? metrics[0];
}

function pickBestDimension(dimensions: DimensionColumn[]): DimensionColumn | null {
  if (!dimensions.length) return null;

  const priorityTerms = [
    "categoria",
    "produto",
    "vendedor",
    "cliente",
    "regiao",
    "região",
    "estado",
    "segmento",
    "canal",
    "tipo",
    "equipe",
  ];

  const found = dimensions.find((dimension) =>
    priorityTerms.some((term) =>
      dimension.key.toLowerCase().includes(term) ||
      dimension.label.toLowerCase().includes(term)
    )
  );

  return found ?? dimensions[0];
}

function sumByDimension(
  rows: Record<string, unknown>[],
  dimensionKey: string,
  metricKey: string
) {
  const map = new Map<string, number>();

  for (const row of rows) {
    const rawDimension = row[dimensionKey];
    const rawMetric = row[metricKey];

    if (!isNonEmpty(rawDimension)) continue;

    const metric = safeNumber(rawMetric);
    if (metric === null) continue;

    const dimension = String(rawDimension).trim();
    map.set(dimension, (map.get(dimension) ?? 0) + metric);
  }

  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function sumByTemporal(
  rows: Record<string, unknown>[],
  temporalKey: string,
  metricKey: string
) {
  const map = new Map<string, number>();

  for (const row of rows) {
    const rawDate = row[temporalKey];
    const rawMetric = row[metricKey];

    const metric = safeNumber(rawMetric);
    const date = toDate(rawDate);

    if (metric === null || !date) continue;

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    map.set(monthKey, (map.get(monthKey) ?? 0) + metric);
  }

  return Array.from(map.entries())
    .map(([period, value]) => ({ period, value }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

function buildChartSuggestion(params: {
  type: ChartSuggestion["type"];
  title: string;
  xKey: string;
  yKey: string;
  data: Record<string, unknown>[];
}): ChartSuggestion {
  return {
    type: params.type,
    title: params.title,
    xKey: params.xKey,
    yKey: params.yKey,
    data: params.data,
  };
}

function detectRanking(prepared: PreparedAnalysis): DiscoveredInsight[] {
  const metric = pickPrimaryMetric(prepared.metrics);
  const dimension = pickBestDimension(prepared.dimensions);

  if (!metric || !dimension) return [];

  const grouped = sumByDimension(prepared.rows, dimension.key, metric.key);
  if (grouped.length < 2) return [];

  const top = grouped[0];
  const second = grouped[1];
  const bottom = grouped[grouped.length - 1];

  const topVsSecond =
    second.value > 0 ? ((top.value - second.value) / second.value) * 100 : 0;

  const insights: DiscoveredInsight[] = [];

  insights.push({
    id: `ranking-top-${slugify(dimension.key)}-${slugify(metric.key)}`,
    type: "ranking",
    title: `${top.name} lidera ${toLabel(metric.label || metric.key)}`,
    description: `${top.name} apresentou o maior valor em ${toLabel(metric.label || metric.key)}, com total de ${top.value.toLocaleString("pt-BR", {
      maximumFractionDigits: 2,
    })}.`,
    impactScore: Math.min(95, 70 + Math.round(Math.abs(topVsSecond))),
    confidenceScore: 92,
    severity: "high",
    supportingMetric: metric.key,
    supportingDimension: dimension.key,
    chartSuggestion: buildChartSuggestion({
      type: "bar",
      title: `Ranking por ${toLabel(dimension.label || dimension.key)}`,
      xKey: "name",
      yKey: "value",
      data: grouped.slice(0, 5),
    }),
  });

  insights.push({
    id: `ranking-bottom-${slugify(dimension.key)}-${slugify(metric.key)}`,
    type: "ranking",
    title: `${bottom.name} aparece na menor posição`,
    description: `${bottom.name} registrou o menor valor em ${toLabel(metric.label || metric.key)}, indicando um ponto de atenção na análise.`,
    impactScore: 62,
    confidenceScore: 86,
    severity: "medium",
    supportingMetric: metric.key,
    supportingDimension: dimension.key,
    chartSuggestion: null,
  });

  return insights;
}

function detectConcentration(prepared: PreparedAnalysis): DiscoveredInsight[] {
  const metric = pickPrimaryMetric(prepared.metrics);
  const dimension = pickBestDimension(prepared.dimensions);

  if (!metric || !dimension) return [];

  const grouped = sumByDimension(prepared.rows, dimension.key, metric.key);
  if (grouped.length < 3) return [];

  const total = grouped.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) return [];

  const top3 = grouped.slice(0, 3);
  const top3Value = top3.reduce((sum, item) => sum + item.value, 0);
  const top3Share = (top3Value / total) * 100;

  if (top3Share < 35) return [];

  const severity =
    top3Share >= 60 ? "high" : top3Share >= 45 ? "medium" : "low";

  return [
    {
      id: `concentration-top3-${slugify(dimension.key)}-${slugify(metric.key)}`,
      type: "concentration",
      title: `Alta concentração em ${toLabel(dimension.label || dimension.key)}`,
      description: `Os 3 principais itens de ${toLabel(dimension.label || dimension.key)} representam ${top3Share.toLocaleString("pt-BR", {
        maximumFractionDigits: 1,
      })}% do total de ${toLabel(metric.label || metric.key)}.`,
      impactScore: Math.min(98, Math.round(top3Share + 25)),
      confidenceScore: 93,
      severity,
      supportingMetric: metric.key,
      supportingDimension: dimension.key,
      chartSuggestion: buildChartSuggestion({
        type: "pie",
        title: `Concentração por ${toLabel(dimension.label || dimension.key)}`,
        xKey: "name",
        yKey: "value",
        data: grouped.slice(0, 5),
      }),
    },
  ];
}

function detectTrend(prepared: PreparedAnalysis): DiscoveredInsight[] {
  const metric = pickPrimaryMetric(prepared.metrics);
  const temporal = prepared.temporal;

  if (!metric || !temporal) return [];

  const grouped = sumByTemporal(prepared.rows, temporal.key, metric.key);
  if (grouped.length < 3) return [];

  const last = grouped[grouped.length - 1];
  const previous = grouped[grouped.length - 2];
  const first = grouped[0];

  if (previous.value <= 0 || first.value <= 0) return [];

  const recentVariation = ((last.value - previous.value) / previous.value) * 100;
  const totalVariation = ((last.value - first.value) / first.value) * 100;

  const insights: DiscoveredInsight[] = [];

  if (Math.abs(recentVariation) >= 10) {
    const isGrowth = recentVariation > 0;

    insights.push({
      id: `trend-recent-${slugify(metric.key)}`,
      type: "trend",
      title: isGrowth ? "Crescimento recente detectado" : "Queda recente detectada",
      description: `${toLabel(metric.label || metric.key)} ${isGrowth ? "cresceu" : "caiu"} ${Math.abs(recentVariation).toLocaleString("pt-BR", {
        maximumFractionDigits: 1,
      })}% no período mais recente.`,
      impactScore: Math.min(96, 72 + Math.round(Math.abs(recentVariation))),
      confidenceScore: 88,
      severity: Math.abs(recentVariation) >= 25 ? "high" : "medium",
      supportingMetric: metric.key,
      supportingDimension: temporal.key,
      chartSuggestion: buildChartSuggestion({
        type: "line",
        title: `Evolução de ${toLabel(metric.label || metric.key)}`,
        xKey: "period",
        yKey: "value",
        data: grouped,
      }),
    });
  }

  if (Math.abs(totalVariation) >= 20) {
    const isGrowth = totalVariation > 0;

    insights.push({
      id: `trend-total-${slugify(metric.key)}`,
      type: "trend",
      title: isGrowth ? "Tendência geral de alta" : "Tendência geral de queda",
      description: `Ao longo do período analisado, ${toLabel(metric.label || metric.key)} ${isGrowth ? "avançou" : "recuou"} ${Math.abs(totalVariation).toLocaleString("pt-BR", {
        maximumFractionDigits: 1,
      })}%.`,
      impactScore: Math.min(95, 68 + Math.round(Math.abs(totalVariation) / 2)),
      confidenceScore: 84,
      severity: Math.abs(totalVariation) >= 35 ? "high" : "medium",
      supportingMetric: metric.key,
      supportingDimension: temporal.key,
      chartSuggestion: null,
    });
  }

  return insights;
}

function detectOutliers(prepared: PreparedAnalysis): DiscoveredInsight[] {
  const metric = pickPrimaryMetric(prepared.metrics);
  const dimension = pickBestDimension(prepared.dimensions);

  if (!metric || !dimension) return [];

  const grouped = sumByDimension(prepared.rows, dimension.key, metric.key);
  if (grouped.length < 4) return [];

  const values = grouped.map((item) => item.value);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;

  if (average <= 0) return [];

  const top = grouped[0];
  const ratio = top.value / average;

  if (ratio < 2) return [];

  return [
    {
      id: `outlier-top-${slugify(dimension.key)}-${slugify(metric.key)}`,
      type: "outlier",
      title: "Comportamento fora do padrão",
      description: `${top.name} registrou valor ${ratio.toLocaleString("pt-BR", {
        maximumFractionDigits: 1,
      })}x acima da média em ${toLabel(metric.label || metric.key)}.`,
      impactScore: Math.min(94, 65 + Math.round(ratio * 10)),
      confidenceScore: 85,
      severity: ratio >= 3 ? "high" : "medium",
      supportingMetric: metric.key,
      supportingDimension: dimension.key,
      chartSuggestion: buildChartSuggestion({
        type: "bar",
        title: `Comparação por ${toLabel(dimension.label || dimension.key)}`,
        xKey: "name",
        yKey: "value",
        data: grouped.slice(0, 5),
      }),
    },
  ];
}

function detectDistribution(prepared: PreparedAnalysis): DiscoveredInsight[] {
  const metric = pickPrimaryMetric(prepared.metrics);
  const dimension = pickBestDimension(prepared.dimensions);

  if (!metric || !dimension) return [];

  const grouped = sumByDimension(prepared.rows, dimension.key, metric.key);
  if (!grouped.length) return [];

  const total = grouped.reduce((sum, item) => sum + item.value, 0);
  const leader = grouped[0];

  if (total <= 0) return [];

  const share = (leader.value / total) * 100;
  if (share < 25) return [];

  return [
    {
      id: `distribution-leader-${slugify(dimension.key)}-${slugify(metric.key)}`,
      type: "distribution",
      title: `${leader.name} domina a distribuição`,
      description: `${leader.name} concentra ${share.toLocaleString("pt-BR", {
        maximumFractionDigits: 1,
      })}% do total de ${toLabel(metric.label || metric.key)}.`,
      impactScore: Math.min(90, 55 + Math.round(share)),
      confidenceScore: 87,
      severity: share >= 40 ? "high" : "medium",
      supportingMetric: metric.key,
      supportingDimension: dimension.key,
      chartSuggestion: buildChartSuggestion({
        type: "bar",
        title: `Distribuição por ${toLabel(dimension.label || dimension.key)}`,
        xKey: "name",
        yKey: "value",
        data: grouped.slice(0, 6),
      }),
    },
  ];
}

function dedupeInsights(insights: DiscoveredInsight[]) {
  const seen = new Set<string>();
  return insights.filter((insight) => {
    const key = `${insight.type}-${insight.title}-${insight.description}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function autoDiscovery(
  prepared: PreparedAnalysis,
  _analysis?: BasicAnalysisInput
): DiscoveredInsight[] {
  if (!prepared.rows.length || !prepared.metrics.length) {
    return [];
  }

  const insights = [
    ...detectRanking(prepared),
    ...detectConcentration(prepared),
    ...detectTrend(prepared),
    ...detectOutliers(prepared),
    ...detectDistribution(prepared),
  ];

  return dedupeInsights(insights).sort((a, b) => {
    const scoreA = a.impactScore * 0.7 + a.confidenceScore * 0.3;
    const scoreB = b.impactScore * 0.7 + b.confidenceScore * 0.3;
    return scoreB - scoreA;
  });
}