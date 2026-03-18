type JsonRow = Record<string, unknown>;

export type DatasetKpis = {
  metricColumn: string | null;
  dimensionColumn: string | null;
  temporalColumn: string | null;
  totalValue: number;
  averageValue: number;
  bestCategory: string | null;
  bestCategoryValue: number;
  totalRows: number;
  categoryChart: Array<{
    label: string;
    value: number;
  }>;
  timelineChart: Array<{
    label: string;
    value: number;
  }>;
};

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const raw = String(value).trim();
  if (!raw) return null;

  const normalized = raw
    .replace(/\s/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function toLabel(value: unknown): string {
  if (value === null || value === undefined) return "Não informado";
  const text = String(value).trim();
  return text || "Não informado";
}

function shortenLabel(label: string, max = 28) {
  if (label.length <= max) return label;
  return `${label.slice(0, max)}...`;
}

function toDateLabel(value: unknown): string {
  if (value === null || value === undefined) return "Não informado";

  const raw = String(value).trim();
  if (!raw) return "Não informado";

  const brDate = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const brMatch = raw.match(brDate);

  if (brMatch) {
    const [, , month, year] = brMatch;
    return `${month}/${year}`;
  }

  const isoLike = raw.slice(0, 10);
  const parsed = new Date(isoLike);

  if (!Number.isNaN(parsed.getTime())) {
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const year = String(parsed.getFullYear());
    return `${month}/${year}`;
  }

  return raw;
}

function pickBestMetric(columns: string[]) {
  const priorityTerms = [
    "valor",
    "total",
    "receita",
    "faturamento",
    "quantidade",
    "qtd",
    "qtde",
    "preco",
    "preço",
    "saldo",
    "volume",
    "montante",
    "meta",
    "taxa",
  ];

  return (
    columns.find((col) =>
      priorityTerms.some((term) => col.toLowerCase().includes(term))
    ) ?? columns[0] ?? null
  );
}

function pickBestDimension(columns: string[]) {
  const priorityTerms = [
    "produto",
    "categoria",
    "regiao",
    "região",
    "cliente",
    "nome",
    "cargo",
    "nm_",
  ];

  return (
    columns.find((col) =>
      priorityTerms.some((term) => col.toLowerCase().includes(term))
    ) ?? columns[0] ?? null
  );
}

function pickBestTemporal(columns: string[]) {
  const blacklist = ["nascimento"];

  const priorityTerms = [
    "data_venda",
    "data_pedido",
    "dt_venda",
    "dt_pedido",
    "competencia",
    "competência",
    "periodo",
    "período",
    "mes",
    "mês",
    "ano",
    "data",
    "dt_",
  ];

  const filtered = columns.filter((col) => {
    const lower = col.toLowerCase();
    return !blacklist.some((term) => lower.includes(term));
  });

  return (
    filtered.find((col) => {
      const lower = col.toLowerCase();
      return priorityTerms.some((term) => lower.includes(term));
    }) ?? filtered[0] ?? null
  );
}

export function analyzeDataset(options: {
  rows: JsonRow[];
  metricCandidates: string[];
  dimensionCandidates: string[];
  temporalCandidates: string[];
}): DatasetKpis {
  const { rows, metricCandidates, dimensionCandidates, temporalCandidates } =
    options;

  const metricColumn = pickBestMetric(metricCandidates);
  const dimensionColumn = pickBestDimension(dimensionCandidates);
  const temporalColumn = pickBestTemporal(temporalCandidates);

  if (!metricColumn) {
    return {
      metricColumn: null,
      dimensionColumn,
      temporalColumn: null,
      totalValue: 0,
      averageValue: 0,
      bestCategory: null,
      bestCategoryValue: 0,
      totalRows: rows.length,
      categoryChart: [],
      timelineChart: [],
    };
  }

  let totalValue = 0;
  let validMetricCount = 0;

  const categoryMap = new Map<string, number>();
  const timelineMap = new Map<string, number>();

  for (const row of rows) {
    const metricValue = toNumber(row[metricColumn]);

    if (metricValue === null) continue;

    totalValue += metricValue;
    validMetricCount += 1;

    if (dimensionColumn) {
      const category = shortenLabel(toLabel(row[dimensionColumn]));
      categoryMap.set(category, (categoryMap.get(category) ?? 0) + metricValue);
    }

    if (temporalColumn) {
      const period = toDateLabel(row[temporalColumn]);
      timelineMap.set(period, (timelineMap.get(period) ?? 0) + metricValue);
    }
  }

  const averageValue =
    validMetricCount > 0 ? totalValue / validMetricCount : 0;

  const categoryChart = Array.from(categoryMap.entries())
    .map(([label, value]) => ({ label, value }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const bestCategory = categoryChart[0]?.label ?? null;
  const bestCategoryValue = categoryChart[0]?.value ?? 0;

  let timelineChart = Array.from(timelineMap.entries())
    .map(([label, value]) => ({ label, value }))
    .filter((item) => item.value > 0)
    .sort((a, b) => a.label.localeCompare(b.label));

  if (timelineChart.length > 12) {
    timelineChart = timelineChart.slice(-12);
  }

  if (timelineChart.length < 2) {
    timelineChart = [];
  }

  return {
    metricColumn,
    dimensionColumn,
    temporalColumn: timelineChart.length ? temporalColumn : null,
    totalValue,
    averageValue,
    bestCategory,
    bestCategoryValue,
    totalRows: rows.length,
    categoryChart,
    timelineChart,
  };
}