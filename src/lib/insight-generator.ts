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

function buildHeadline(analysis: DatasetKpis) {
  const totalLabel = getTotalLabel(analysis.metricColumn);

  if (
    analysis.bestCategory &&
    analysis.bestCategoryValue > 0 &&
    analysis.totalValue > 0
  ) {
    const share = analysis.bestCategoryValue / analysis.totalValue;

    if (share >= 0.5) {
      return `"${analysis.bestCategory}" concentra a maior parte do total analisado.`;
    }

    if (share >= 0.3) {
      return `"${analysis.bestCategory}" lidera o conjunto analisado com participação relevante.`;
    }
  }

  const trend = getTrendDirection(analysis.timelineChart || []);

  if (trend?.direction === "up") {
    return `O comportamento temporal indica crescimento ao longo do período analisado.`;
  }

  if (trend?.direction === "down") {
    return `O comportamento temporal sugere desaceleração no período analisado.`;
  }

  return `A análise consolidou ${formatNumber(
    analysis.totalValue
  )} ${totalLabel} com visão automática dos principais padrões.`;
}

function buildSummary(analysis: DatasetKpis) {
  const pieces: string[] = [];
  const totalLabel = getTotalLabel(analysis.metricColumn);

  pieces.push(
    `O dataset analisado reúne ${formatNumber(
      analysis.totalValue
    )} ${totalLabel}.`
  );

  if (
    analysis.bestCategory &&
    analysis.bestCategoryValue > 0 &&
    analysis.totalValue > 0
  ) {
    const share = analysis.bestCategoryValue / analysis.totalValue;

    pieces.push(
      `A categoria "${analysis.bestCategory}" aparece como principal destaque, respondendo por ${formatPercent(
        share
      )} do total observado.`
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

  if (analysis.metricColumn === "__count__") {
    insights.push({
      title: "Leitura principal do dataset",
      description:
        "Como não havia uma métrica numérica dominante, a análise passou a considerar a contagem de registros como base para identificar padrões, volume e distribuição.",
      priority: 1,
      tone: "context",
    });
  } else if (analysis.metricColumn) {
    insights.push({
      title: "Métrica central identificada",
      description: `A leitura automática apontou ${metricLabel} como principal referência para consolidar os resultados e estruturar os comparativos.`,
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
          )} registros, oferecendo uma base consistente para leitura de concentração e comportamento ao longo do tempo.`
        : `O volume consolidado da ${metricLabel} chegou a ${formatNumber(
            analysis.totalValue
          )}, indicando o peso total do indicador dentro do dataset.`,
    priority: 1,
    tone: "highlight",
  });

  if (analysis.averageValue > 0 && analysis.metricColumn && analysis.metricColumn !== "__count__") {
    insights.push({
      title: "Média observada",
      description: `Em média, cada registro contribuiu com ${formatNumber(
        analysis.averageValue
      )} para a ${metricLabel}, o que ajuda a entender o nível típico de contribuição dentro da base.`,
      priority: 2,
      tone: "context",
    });
  }

  if (
    analysis.bestCategory &&
    analysis.bestCategoryValue > 0 &&
    analysis.totalValue > 0
  ) {
    const share = analysis.bestCategoryValue / analysis.totalValue;

    let distributionText =
      `"${analysis.bestCategory}" lidera a distribuição do dataset, concentrando ${formatPercent(
        share
      )} do total analisado.`;

    if (share >= 0.5) {
      distributionText +=
        " Esse resultado sugere forte concentração em uma única categoria.";
    } else if (share >= 0.3) {
      distributionText +=
        " O cenário indica liderança clara, embora ainda exista espaço relevante para as demais categorias.";
    } else {
      distributionText +=
        " A leitura sugere uma distribuição mais equilibrada entre os grupos analisados.";
    }

    insights.push({
      title: "Categoria com maior peso",
      description: distributionText,
      priority: 1,
      tone: "distribution",
    });
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
        priority: 1,
        tone: "trend",
      });
    }
  }

  const trend = getTrendDirection(analysis.timelineChart || []);

  if (trend?.direction === "up") {
    insights.push({
      title: "Tendência temporal positiva",
      description: `A série apresenta crescimento entre "${trend.firstLabel}" e "${trend.lastLabel}", com avanço de ${formatPercent(
        trend.changePercent
      )}. Esse movimento sugere evolução consistente do indicador ao longo do período.`,
      priority: 1,
      tone: "trend",
    });
  } else if (trend?.direction === "down") {
    insights.push({
      title: "Sinal de desaceleração",
      description: `A comparação entre "${trend.firstLabel}" e "${trend.lastLabel}" mostra queda de ${formatPercent(
        Math.abs(trend.changePercent)
      )}, indicando perda de ritmo no período analisado.`,
      priority: 2,
      tone: "trend",
    });
  } else if (trend?.direction === "stable" && analysis.timelineChart.length >= 2) {
    insights.push({
      title: "Estabilidade ao longo do período",
      description:
        "A evolução temporal não apresenta variações bruscas entre o início e o fim da série, sugerindo comportamento relativamente estável.",
      priority: 2,
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
        priority: 3,
        tone: "distribution",
      });
    }
  }

  if (!insights.length) {
    insights.push({
      title: "Leitura inicial limitada",
      description:
        "Ainda não foi possível identificar padrões suficientemente relevantes para gerar uma narrativa mais profunda com os dados atuais.",
      priority: 3,
      tone: "context",
    });
  }

  return {
    headline: buildHeadline(analysis),
    summary: buildSummary(analysis),
    insights: insights.sort((a, b) => a.priority - b.priority),
    charts: {
      category: analysis.categoryChart || [],
      timeline: analysis.timelineChart || [],
    },
  };
}