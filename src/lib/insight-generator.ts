import type { DatasetKpis } from "@/src/lib/dataset-analysis";

export type GeneratedInsight = {
  title: string;
  description: string;
  priority: number;
};

export type GeneratedInsightsResult = {
  insights: GeneratedInsight[];
  charts: {
    category: { label: string; value: number }[];
    timeline: { label: string; value: number }[];
  };
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}

export function generateDatasetInsights(
  analysis: DatasetKpis
): GeneratedInsightsResult {
  const insights: GeneratedInsight[] = [];

  if (analysis.metricColumn === "__count__") {
    insights.push({
      title: "Métrica principal identificada",
      description:
        "A análise utilizou a contagem de registros como métrica principal.",
      priority: 1,
    });
  } else if (analysis.metricColumn) {
    insights.push({
      title: "Métrica principal identificada",
      description: `A coluna principal utilizada foi "${analysis.metricColumn}".`,
      priority: 1,
    });
  }

  if (analysis.metricColumn === "__count__") {
    insights.push({
      title: "Total analisado",
      description: `Foram analisados ${formatNumber(
        analysis.totalValue
      )} registros no total.`,
      priority: 1,
    });
  }

  if (analysis.averageValue > 0 && analysis.metricColumn) {
    insights.push({
      title: "Média por registro",
      description: `A média por registro da métrica "${analysis.metricColumn}" foi ${formatNumber(
        analysis.averageValue
      )}.`,
      priority: 2,
    });
  }

  if (
    analysis.bestCategory &&
    analysis.bestCategoryValue > 0 &&
    analysis.totalValue > 0
  ) {
    const share = analysis.bestCategoryValue / analysis.totalValue;

    insights.push({
      title: "Categoria líder",
      description: `"${analysis.bestCategory}" representa ${formatPercent(
        share
      )} do total analisado.`,
      priority: 1,
    });
  }

  if (analysis.timelineChart.length > 0) {
    const bestPeriod = [...analysis.timelineChart].sort(
      (a, b) => b.value - a.value
    )[0];

    if (bestPeriod) {
      insights.push({
        title: "Melhor período",
        description: `O período "${bestPeriod.label}" apresentou o maior valor (${formatNumber(
          bestPeriod.value
        )}).`,
        priority: 1,
      });
    }
  }

  if (analysis.categoryChart.length >= 2) {
    const first = analysis.categoryChart[0];
    const second = analysis.categoryChart[1];

    if (first && second && first.value > second.value) {
      const diff = first.value - second.value;

      insights.push({
        title: "Diferença entre categorias",
        description: `"${first.label}" superou "${second.label}" em ${formatNumber(
          diff
        )}.`,
        priority: 3,
      });
    }
  }

  if (!insights.length) {
    insights.push({
      title: "Análise inicial indisponível",
      description:
        "Não foi possível gerar insights relevantes com os dados atuais.",
      priority: 3,
    });
  }

  return {
    insights: insights.sort((a, b) => a.priority - b.priority),
    charts: {
      category: analysis.categoryChart || [],
      timeline: analysis.timelineChart || [],
    },
  };
}