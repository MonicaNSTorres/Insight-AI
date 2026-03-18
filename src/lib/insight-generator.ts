import type { DatasetKpis } from "@/src/lib/dataset-analysis";

export type GeneratedInsight = {
  title: string;
  description: string;
  priority: number;
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

export function generateDatasetInsights(analysis: DatasetKpis): GeneratedInsight[] {
  const insights: GeneratedInsight[] = [];

  if (analysis.metricColumn) {
    insights.push({
      title: "Métrica principal identificada",
      description: `A coluna principal usada na análise automática foi "${analysis.metricColumn}".`,
      priority: 1,
    });
  }

  if (analysis.totalValue > 0 && analysis.metricColumn) {
    insights.push({
      title: "Total acumulado",
      description: `O total acumulado da métrica "${analysis.metricColumn}" foi ${formatNumber(analysis.totalValue)}.`,
      priority: 1,
    });
  }

  if (analysis.averageValue > 0 && analysis.metricColumn) {
    insights.push({
      title: "Média por registro",
      description: `A média por registro da métrica "${analysis.metricColumn}" foi ${formatNumber(analysis.averageValue)}.`,
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
      description: `"${analysis.bestCategory}" foi a categoria com maior resultado, representando ${formatPercent(share)} do total analisado.`,
      priority: 1,
    });
  }

  if (analysis.timelineChart.length > 0) {
    const bestPeriod = [...analysis.timelineChart].sort((a, b) => b.value - a.value)[0];

    if (bestPeriod) {
      insights.push({
        title: "Melhor período",
        description: `O período "${bestPeriod.label}" apresentou o maior valor, com ${formatNumber(bestPeriod.value)}.`,
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
        title: "Diferença entre líderes",
        description: `A categoria "${first.label}" superou "${second.label}" em ${formatNumber(diff)}.`,
        priority: 3,
      });
    }
  }

  if (!insights.length) {
    insights.push({
      title: "Análise inicial indisponível",
      description:
        "Ainda não foi possível gerar insights automáticos consistentes com as colunas detectadas neste dataset.",
      priority: 3,
    });
  }

  return insights.sort((a, b) => a.priority - b.priority);
}