type RankedItem = {
  name: string;
  value: number;
};

function parseBrazilianNumber(value: unknown): number {
  if (value === null || value === undefined) return NaN;

  if (typeof value === "number") {
    return Number.isNaN(value) ? NaN : value;
  }

  const str = String(value)
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  const num = Number(str);

  return Number.isNaN(num) ? NaN : num;
}

function getMetricValue(row: Record<string, unknown>, metric?: string) {
  if (!metric || metric === "__count__") {
    return 1;
  }

  return parseBrazilianNumber(row[metric]);
}

function getSafeGroupValue(row: Record<string, unknown>, column?: string) {
  return String(row[column || ""] ?? "Não informado").trim() || "Não informado";
}

function aggregateRowsByDimension(
  rows: Record<string, unknown>[],
  dimension?: string,
  metric?: string,
  operation: "sum" | "avg" | "count" = "sum"
) {
  const grouped = new Map<string, { total: number; count: number }>();

  for (const row of rows) {
    const key = getSafeGroupValue(row, dimension);

    if (operation === "count") {
      const current = grouped.get(key) || { total: 0, count: 0 };
      current.total += 1;
      current.count += 1;
      grouped.set(key, current);
      continue;
    }

    const value = getMetricValue(row, metric);

    if (Number.isNaN(value)) continue;

    const current = grouped.get(key) || { total: 0, count: 0 };
    current.total += value;
    current.count += 1;
    grouped.set(key, current);
  }

  return Array.from(grouped.entries())
    .map(([name, stats]) => ({
      name,
      value:
        operation === "avg"
          ? stats.count > 0
            ? stats.total / stats.count
            : 0
          : stats.total,
      total: stats.total,
      count: stats.count,
    }))
    .sort((a, b) => b.value - a.value);
}

function aggregateRowsGlobally(
  rows: Record<string, unknown>[],
  metric?: string,
  operation: "sum" | "avg" | "count" = "sum"
) {
  if (operation === "count" || metric === "__count__") {
    return {
      type: "global_aggregate",
      metric: "__count__",
      operation: "count" as const,
      total: rows.length,
      avg: rows.length > 0 ? 1 : 0,
      count: rows.length,
    };
  }

  const values = rows
    .map((row) => getMetricValue(row, metric))
    .filter((v) => !Number.isNaN(v));

  if (!values.length) {
    return {
      type: "empty_metric",
      metric,
      operation,
    };
  }

  const total = values.reduce((sum, v) => sum + v, 0);
  const avg = total / values.length;

  return {
    type: "global_aggregate",
    metric,
    operation,
    total,
    avg,
    count: values.length,
  };
}

function groupRowsByTemporal(
  rows: Record<string, unknown>[],
  temporal?: string,
  metric?: string,
  operation: "sum" | "avg" | "count" = "sum"
) {
  const grouped = new Map<string, { total: number; count: number }>();

  for (const row of rows) {
    const period =
      String(row[temporal || ""] ?? "Sem período").trim() || "Sem período";

    const current = grouped.get(period) || { total: 0, count: 0 };

    if (operation === "count") {
      current.total += 1;
      current.count += 1;
      grouped.set(period, current);
      continue;
    }

    const value = getMetricValue(row, metric);

    if (Number.isNaN(value)) continue;

    current.total += value;
    current.count += 1;
    grouped.set(period, current);
  }

  return Array.from(grouped.entries())
    .map(([period, stats]) => ({
      period,
      value:
        operation === "avg"
          ? stats.count > 0
            ? stats.total / stats.count
            : 0
          : stats.total,
      total: stats.total,
      count: stats.count,
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

export function executeQuestionLocally({
  parsed,
  context,
}: {
  question: string;
  parsed: {
    intent?: string;
    metric?: string;
    dimension?: string;
    temporal?: string;
    limit?: number;
    operation?: "sum" | "avg" | "count";
  };
  context: {
    rows?: Record<string, unknown>[];
  };
}) {
  const rows = context.rows || [];
  const {
    intent,
    metric,
    dimension,
    temporal,
    limit,
    operation = "sum",
  } = parsed;

  if (!rows.length) {
    return {
      type: "empty",
      summary: "Dataset sem linhas suficientes para análise.",
    };
  }

  if (metric && !dimension && intent === "generic_analysis") {
    return aggregateRowsGlobally(rows, metric, operation);
  }

  if (
    (intent === "aggregate_by_dimension" ||
      intent === "top_n" ||
      intent === "max_category" ||
      intent === "max_entity_by_metric" ||
      intent === "compare_groups" ||
      intent === "share_by_dimension") &&
    dimension
  ) {
    const items = aggregateRowsByDimension(rows, dimension, metric, operation);
    const winner = items[0] || null;
    const second = items[1] || null;
    const total = items.reduce((sum, item) => sum + item.value, 0);

    if (intent === "aggregate_by_dimension") {
      return {
        type: "aggregate_by_dimension",
        metric,
        dimension,
        operation,
        items,
        winner,
        total,
      };
    }

    if (intent === "top_n") {
      return {
        type: "top_n",
        metric,
        dimension,
        operation,
        items: items.slice(0, limit || 5),
        total,
      };
    }

    if (intent === "max_category" || intent === "max_entity_by_metric") {
      return {
        type: "max_category",
        metric,
        dimension,
        operation,
        winner,
        second,
        ranking: items.slice(0, 5),
        total,
      };
    }

    if (intent === "compare_groups") {
      return {
        type: "compare_groups",
        metric,
        dimension,
        operation,
        winner,
        second,
        ranking: items.slice(0, 5),
        total,
      };
    }

    if (intent === "share_by_dimension") {
      const itemsWithShare = items.map((item) => ({
        ...item,
        share: total > 0 ? item.value / total : 0,
      }));

      return {
        type: "share_by_dimension",
        metric,
        dimension,
        operation,
        items: itemsWithShare,
        winner: itemsWithShare[0] || null,
        total,
      };
    }
  }

  if (intent === "growth_by_period" && temporal) {
    const series = groupRowsByTemporal(rows, temporal, metric, operation);

    const growth = series
      .map((item, index) => {
        if (index === 0) {
          return { ...item, growth: null };
        }

        const prev = series[index - 1].value;
        const rate = prev === 0 ? null : ((item.value - prev) / prev) * 100;

        return { ...item, growth: rate };
      })
      .filter((item) => item.growth !== null)
      .sort((a, b) => (b.growth ?? -Infinity) - (a.growth ?? -Infinity));

    return {
      type: "growth_by_period",
      metric,
      temporal,
      operation,
      winner: growth[0] || null,
      series,
    };
  }

  return {
    type: "generic_analysis",
    summary: "Pergunta genérica; usar IA para interpretar o contexto.",
  };
}