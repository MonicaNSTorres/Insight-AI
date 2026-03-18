type RankedItem = {
  entity: string;
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

export function executeQuestionLocally({
  question,
  parsed,
  context,
}: {
  question: string;
  parsed: any;
  context: any;
}) {
  const rows = context.rows || [];
  const { intent, metric, dimension, temporal, limit } = parsed;

  if (!rows.length) {
    return {
      type: "empty",
      summary: "Dataset sem linhas suficientes para análise.",
    };
  }

  if (intent === "max_entity_by_metric" && metric && dimension) {
    const validRows: RankedItem[] = rows
      .map((row: Record<string, unknown>): RankedItem => ({
        entity: String(row[dimension] ?? "").trim(),
        value: parseBrazilianNumber(row[metric]),
      }))
      .filter((item: RankedItem) => item.entity && !Number.isNaN(item.value));

    const ordered = validRows.sort(
      (a: RankedItem, b: RankedItem) => b.value - a.value
    );

    const winner = ordered[0] ?? null;

    return {
      type: "max_entity_by_metric",
      metric,
      dimension,
      winner,
      ranking: ordered.slice(0, 5),
    };
  }

  if (intent === "aggregate_by_dimension" && metric && dimension) {
    const grouped = new Map<string, number>();

    for (const row of rows as Record<string, unknown>[]) {
      const key = String(row[dimension] ?? "Não informado").trim() || "Não informado";
      const value = parseBrazilianNumber(row[metric]);

      if (Number.isNaN(value)) continue;

      grouped.set(key, (grouped.get(key) || 0) + value);
    }

    const items = Array.from(grouped.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      type: "aggregate_by_dimension",
      metric,
      dimension,
      items,
      winner: items[0] || null,
    };
  }

  if (intent === "top_n" && metric && dimension) {
    const grouped = new Map<string, number>();

    for (const row of rows as Record<string, unknown>[]) {
      const key = String(row[dimension] ?? "Não informado").trim() || "Não informado";
      const value = parseBrazilianNumber(row[metric]);

      if (Number.isNaN(value)) continue;

      grouped.set(key, (grouped.get(key) || 0) + value);
    }

    const items = Array.from(grouped.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit || 5);

    return {
      type: "top_n",
      metric,
      dimension,
      items,
    };
  }

  if (intent === "max_category" && metric && dimension) {
    const grouped = new Map<string, number>();

    for (const row of rows as Record<string, unknown>[]) {
      const key = String(row[dimension] ?? "Não informado").trim() || "Não informado";
      const value = parseBrazilianNumber(row[metric]);

      if (Number.isNaN(value)) continue;

      grouped.set(key, (grouped.get(key) || 0) + value);
    }

    const items = Array.from(grouped.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      type: "max_category",
      metric,
      dimension,
      winner: items[0] || null,
      ranking: items.slice(0, 5),
    };
  }

  if (intent === "growth_by_period" && metric && temporal) {
    const grouped = new Map<string, number>();

    for (const row of rows as Record<string, unknown>[]) {
      const period = String(row[temporal] ?? "Sem período");
      const value = parseBrazilianNumber(row[metric]);

      if (Number.isNaN(value)) continue;

      grouped.set(period, (grouped.get(period) || 0) + value);
    }

    const ordered = Array.from(grouped.entries())
      .map(([period, value]) => ({ period, value }))
      .sort((a, b) => a.period.localeCompare(b.period));

    const growth = ordered
      .map((item, index) => {
        if (index === 0) return { ...item, growth: null };
        const prev = ordered[index - 1].value;
        const rate = prev === 0 ? null : ((item.value - prev) / prev) * 100;
        return { ...item, growth: rate };
      })
      .filter((x) => x.growth !== null)
      .sort((a, b) => (b.growth ?? -Infinity) - (a.growth ?? -Infinity));

    return {
      type: "growth_by_period",
      metric,
      temporal,
      winner: growth[0] || null,
      series: ordered,
    };
  }

  return {
    type: "generic_analysis",
    summary: "Pergunta genérica; usar IA para interpretar o contexto.",
  };
}