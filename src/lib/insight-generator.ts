import type { DatasetKpis } from "@/src/lib/dataset-analysis";

export type GeneratedInsight = {
  title: string;
  description: string;
  priority: number;
  tone?: "highlight" | "trend" | "distribution" | "context";
};

export type GeneratedInsightsResult = {
  headline: string;
  summary: string;
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

function getMetricLabel(metricColumn?: string | null) {
  if (!metricColumn || metricColumn === "__count__") {
    return "volume de registros";
  }

  return `métrica "${metricColumn}"`;
}

function getTotalLabel(metricColumn?: string | null) {
  if (!metricColumn || metricColumn === "__count__") {
    return "registros";
  }

  return metricColumn;
}

function getTrendDirection(
  timeline: { label: string; value: number }[]
): {
  direction: "up" | "down" | "stable";
  changePercent: number;
  firstLabel?: string;
  lastLabel?: string;
  firstValue?: number;
  lastValue?: number;
} | null {
  if (!timeline || timeline.length < 2) return null;

  const first = timeline[0];
  const last = timeline[timeline.length - 1];

  if (!first || !last) return null;

  const base = first.value === 0 ? 1 : first.value;
  const changePercent = (last.value - first.value) / base;

  if (changePercent > 0.08) {
    return {
      direction: "up",
      changePercent,
      firstLabel: first.label,
      lastLabel: last.label,
      firstValue: first.value,
      lastValue: last.value,
    };
  }

  if (changePercent < -0.08) {
    return {
      direction: "down",
      changePercent,
      firstLabel: first.label,
      lastLabel: last.label,
      firstValue: first.value,
      lastValue: last.value,
    };
  }

  return {
    direction: "stable",
    changePercent,
    firstLabel: first.label,
    lastLabel: last.label,
    firstValue: first.value,
    lastValue: last.value,
  };
}

function getTopShare(analysis: DatasetKpis) {
  if (
    !analysis.bestCategory ||
    analysis.bestCategoryValue <= 0 ||
    analysis.totalValue <= 0
  ) {
    return null;
  }

  return analysis.bestCategoryValue / analysis.totalValue;
}

function getTopCategoriesShare(
  categoryChart: { label: string; value: number }[],
  count: number
) {
  if (!categoryChart?.length) return 0;

  const total = categoryChart.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) return 0;

  const partial = categoryChart
    .slice(0, count)
    .reduce((sum, item) => sum + item.value, 0);

  return partial / total;
}

function getAverageCategoryValue(
  categoryChart: { label: string; value: number }[]
) {
  if (!categoryChart?.length) return 0;

  const total = categoryChart.reduce((sum, item) => sum + item.value, 0);
  return total / categoryChart.length;
}

function buildHeadline(analysis: DatasetKpis) {
  const totalLabel = getTotalLabel(analysis.metricColumn);
  const topShare = getTopShare(analysis);
  const trend = getTrendDirection(analysis.timelineChart || []);
  const averageCategoryValue = getAverageCategoryValue(
    analysis.categoryChart || []
  );

  if (
    analysis.bestCategory &&
    analysis.bestCategoryValue > 0 &&
    averageCategoryValue > 0
  ) {
    const ratio = analysis.bestCategoryValue / averageCategoryValue;

    if (ratio >= 2.5) {
      return `"${analysis.bestCategory}" apresenta comportamento muito acima do padrão do dataset.`;
    }
  }

  if (topShare !== null) {
    if (topShare >= 0.5) {
      return `"${analysis.bestCategory}" concentra a maior parte do total analisado.`;
    }

    if (topShare >= 0.3) {
      return `"${analysis.bestCategory}" lidera o conjunto analisado com participação relevante.`;
    }
  }

  if (trend?.direction === "up") {
    return `O comportamento temporal indica crescimento ao longo do período analisado.`;
  }

  if (trend?.direction === "down") {
    return `O comportamento temporal sugere desaceleração no período analisado.`;
  }

  return `A análise consolidou ${formatNumber(
    analysis.totalValue
  )} ${totalLabel} com descoberta automática dos principais padrões do dataset.`;
}

function buildSummary(analysis: DatasetKpis) {
  const pieces: string[] = [];
  const totalLabel = getTotalLabel(analysis.metricColumn);
  const topShare = getTopShare(analysis);
  const top3Share = getTopCategoriesShare(analysis.categoryChart || [], 3);

  pieces.push(
    `O dataset analisado reúne ${formatNumber(
      analysis.totalValue
    )} ${totalLabel}, com leitura automática de volume, concentração e comportamento temporal.`
  );

  if (
    analysis.bestCategory &&
    analysis.bestCategoryValue > 0 &&
    analysis.totalValue > 0 &&
    topShare !== null
  ) {
    pieces.push(
      `A categoria "${analysis.bestCategory}" aparece como principal destaque, respondendo por ${formatPercent(
        topShare
      )} do total observado.`
    );
  }

  if (top3Share >= 0.35) {
    pieces.push(
      `As três principais categorias concentram ${formatPercent(
        top3Share
      )} da base analisada, sugerindo um nível relevante de concentração.`
    );
  }

  const trend = getTrendDirection(analysis.timelineChart || []);

  if (trend?.direction === "up") {
    pieces.push(
      `Ao longo da série temporal, o volume evolui de forma positiva, com variação de ${formatPercent(
        trend.changePercent
      )} entre "${trend.firstLabel}" e "${trend.lastLabel}".`
    );
  } else if (trend?.direction === "down") {
    pieces.push(
      `Na leitura temporal, houve retração de ${formatPercent(
        Math.abs(trend.changePercent)
      )} entre "${trend.firstLabel}" e "${trend.lastLabel}".`
    );
  } else if (trend?.direction === "stable") {
    pieces.push(
      `A evolução temporal permanece relativamente estável no intervalo analisado.`
    );
  }

  return pieces.join(" ");
}

export function generateDatasetInsights(
  analysis: DatasetKpis
): GeneratedInsightsResult {
  const insights: GeneratedInsight[] = [];
  const metricLabel = getMetricLabel(analysis.metricColumn);
  const totalLabel = getTotalLabel(analysis.metricColumn);
  const topShare = getTopShare(analysis);
  const top3Share = getTopCategoriesShare(analysis.categoryChart || [], 3);
  const trend = getTrendDirection(analysis.timelineChart || []);
  const averageCategoryValue = getAverageCategoryValue(
    analysis.categoryChart || []
  );

  if (analysis.metricColumn === "__count__") {
    insights.push({
      title: "Base de leitura identificada",
      description:
        "Como não havia uma métrica numérica dominante, o motor de análise passou a considerar a contagem de registros como referência principal para detectar padrões, concentração e comportamento temporal.",
      priority: 1,
      tone: "context",
    });
  } else if (analysis.metricColumn) {
    insights.push({
      title: "Métrica central identificada",
      description: `A leitura automática apontou ${metricLabel} como principal referência para consolidar os resultados, estruturar comparativos e priorizar as descobertas mais relevantes.`,
      priority: 1,
      tone: "context",
    });
  }

  insights.push({
    title: "Volume consolidado",
    description:
      analysis.metricColumn === "__count__"
        ? `O conjunto analisado totaliza ${formatNumber(
            analysis.totalValue
          )} registros, oferecendo uma base consistente para leitura de concentração, distribuição e evolução ao longo do tempo.`
        : `O volume consolidado da ${metricLabel} chegou a ${formatNumber(
            analysis.totalValue
          )}, revelando o peso total do indicador dentro do dataset analisado.`,
    priority: 2,
    tone: "highlight",
  });

  if (
    analysis.averageValue > 0 &&
    analysis.metricColumn &&
    analysis.metricColumn !== "__count__"
  ) {
    insights.push({
      title: "Média observada",
      description: `Em média, cada registro contribuiu com ${formatNumber(
        analysis.averageValue
      )} para a ${metricLabel}, o que ajuda a entender o nível típico de contribuição dentro da base.`,
      priority: 1,
      tone: "context",
    });
  }

  if (
    analysis.bestCategory &&
    analysis.bestCategoryValue > 0 &&
    analysis.totalValue > 0 &&
    topShare !== null
  ) {
    let distributionText =
      `"${analysis.bestCategory}" lidera a distribuição do dataset, concentrando ${formatPercent(
        topShare
      )} do total analisado.`;

    if (topShare >= 0.5) {
      distributionText +=
        " Esse resultado sugere forte concentração em uma única categoria e merece atenção estratégica.";
    } else if (topShare >= 0.3) {
      distributionText +=
        " O cenário indica liderança clara, embora ainda exista espaço relevante para as demais categorias.";
    } else {
      distributionText +=
        " A leitura sugere uma distribuição mais equilibrada entre os grupos analisados.";
    }

    insights.push({
      title: "Categoria com maior peso",
      description: distributionText,
      priority: topShare >= 0.3 ? 3 : 2,
      tone: "distribution",
    });
  }

  if (analysis.categoryChart.length >= 3 && top3Share >= 0.35) {
    insights.push({
      title: "Concentração nas principais categorias",
      description: `As 3 categorias com maior participação concentram ${formatPercent(
        top3Share
      )} do total analisado, indicando que boa parte do resultado está agrupada em poucos elementos da base.`,
      priority: top3Share >= 0.5 ? 3 : 2,
      tone: "distribution",
    });
  }

  if (
    analysis.bestCategory &&
    analysis.bestCategoryValue > 0 &&
    averageCategoryValue > 0
  ) {
    const outlierRatio = analysis.bestCategoryValue / averageCategoryValue;

    if (outlierRatio >= 2) {
      insights.push({
        title: "Comportamento acima do padrão",
        description: `"${analysis.bestCategory}" registrou desempenho ${formatNumber(
          outlierRatio
        )}x acima da média das categorias analisadas, sinalizando um comportamento fora do padrão esperado para o conjunto.`,
        priority: outlierRatio >= 3 ? 3 : 2,
        tone: "highlight",
      });
    }
  }

  if (analysis.timelineChart.length > 0) {
    const bestPeriod = [...analysis.timelineChart].sort(
      (a, b) => b.value - a.value
    )[0];

    if (bestPeriod) {
      insights.push({
        title: "Pico de desempenho",
        description:
          analysis.metricColumn === "__count__"
            ? `O período "${bestPeriod.label}" registrou o maior volume da série, com ${formatNumber(
                bestPeriod.value
              )} ${totalLabel}.`
            : `O período "${bestPeriod.label}" concentrou o maior valor da série, atingindo ${formatNumber(
                bestPeriod.value
              )} na ${metricLabel}.`,
        priority: 2,
        tone: "trend",
      });
    }
  }

  if (trend?.direction === "up") {
    insights.push({
      title: "Tendência temporal positiva",
      description: `A série apresenta crescimento entre "${trend.firstLabel}" e "${trend.lastLabel}", com avanço de ${formatPercent(
        trend.changePercent
      )}. Esse movimento sugere evolução consistente do indicador ao longo do período.`,
      priority: Math.abs(trend.changePercent) >= 0.2 ? 3 : 2,
      tone: "trend",
    });
  } else if (trend?.direction === "down") {
    insights.push({
      title: "Sinal de desaceleração",
      description: `A comparação entre "${trend.firstLabel}" e "${trend.lastLabel}" mostra queda de ${formatPercent(
        Math.abs(trend.changePercent)
      )}, indicando perda de ritmo no período analisado.`,
      priority: Math.abs(trend.changePercent) >= 0.2 ? 3 : 2,
      tone: "trend",
    });
  } else if (
    trend?.direction === "stable" &&
    analysis.timelineChart.length >= 2
  ) {
    insights.push({
      title: "Estabilidade ao longo do período",
      description:
        "A evolução temporal não apresenta variações bruscas entre o início e o fim da série, sugerindo comportamento relativamente estável no intervalo analisado.",
      priority: 1,
      tone: "trend",
    });
  }

  if (analysis.categoryChart.length >= 2) {
    const first = analysis.categoryChart[0];
    const second = analysis.categoryChart[1];

    if (first && second && first.value > second.value) {
      const diff = first.value - second.value;
      const relativeGap = second.value === 0 ? 0 : diff / second.value;

      insights.push({
        title: "Vantagem sobre a segunda colocada",
        description: `"${first.label}" supera "${second.label}" em ${formatNumber(
          diff
        )}, abrindo uma diferença de ${formatPercent(
          relativeGap
        )} em relação à segunda principal categoria.`,
        priority: relativeGap >= 0.25 ? 2 : 1,
        tone: "distribution",
      });
    }
  }

  if (!insights.length) {
    insights.push({
      title: "Leitura inicial limitada",
      description:
        "Ainda não foi possível identificar padrões suficientemente relevantes para gerar uma narrativa mais profunda com os dados atuais.",
      priority: 1,
      tone: "context",
    });
  }

  return {
    headline: buildHeadline(analysis),
    summary: buildSummary(analysis),
    insights: insights.sort((a, b) => b.priority - a.priority),
    charts: {
      category: analysis.categoryChart || [],
      timeline: analysis.timelineChart || [],
    },
  };
}