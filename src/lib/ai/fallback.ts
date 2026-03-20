type FallbackParams = {
  parsed: {
    intent?: string;
    metric?: string;
    dimension?: string;
    temporal?: string;
    limit?: number;
  };
  computedAnswer: any;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
  }).format(value);
}

function getMetricLabel(metric?: string, operation?: string) {
  if (!metric || metric === "__count__") {
    return operation === "count" ? "registros" : "contagem";
  }

  return metric;
}

export function generateFallbackResponse({
  parsed,
  computedAnswer,
}: FallbackParams) {
  if (!computedAnswer) {
    return {
      answer:
        "Não consegui interpretar sua pergunta com segurança usando os dados disponíveis.",
      confidence: "low" as const,
      usedColumns: [],
      followUpQuestions: [
        "Top 5 registros por valor",
        "Qual categoria teve maior valor?",
        "Qual mês teve maior crescimento?",
      ],
    };
  }

  if (computedAnswer.type === "empty") {
    return {
      answer:
        "Esse dataset não possui linhas suficientes para eu responder essa pergunta.",
      confidence: "low" as const,
      usedColumns: [],
      followUpQuestions: [
        "Mostre a estrutura detectada",
        "Quais colunas foram identificadas como métricas?",
      ],
    };
  }

  if (computedAnswer.type === "aggregate_by_dimension") {
    const items = Array.isArray(computedAnswer.items) ? computedAnswer.items : [];
    const metricLabel = getMetricLabel(
      computedAnswer.metric,
      computedAnswer.operation
    );
    const operationLabel =
      computedAnswer.operation === "avg"
        ? "a média"
        : computedAnswer.operation === "count"
        ? "a contagem"
        : "o total";

    if (!items.length) {
      return {
        answer: `Não encontrei dados suficientes para calcular ${operationLabel} de **${metricLabel}** por **${computedAnswer.dimension}**.`,
        confidence: "medium" as const,
        usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
        followUpQuestions: [
          `Qual ${computedAnswer.dimension} teve maior ${metricLabel}?`,
          `Top 5 ${computedAnswer.dimension} por ${metricLabel}`,
          `Como ${metricLabel} evolui no tempo?`,
        ],
      };
    }

    const ranking = items
      .slice(0, 5)
      .map(
        (item: { name: string; value: number }, index: number) =>
          `${index + 1}. ${item.name} — ${formatNumber(item.value)}`
      )
      .join("\n");

    return {
      answer: `Aqui está ${operationLabel} de **${metricLabel}** por **${computedAnswer.dimension}**:\n\n${ranking}`,
      confidence: "high" as const,
      usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
      followUpQuestions: [
        `Qual ${computedAnswer.dimension} teve maior ${metricLabel}?`,
        `Top 5 ${computedAnswer.dimension} por ${metricLabel}`,
        `Compare os 2 maiores resultados por ${computedAnswer.dimension}`,
      ],
    };
  }

  if (computedAnswer.type === "max_entity_by_metric") {
    const winner = computedAnswer.winner;
    const metricLabel = getMetricLabel(
      computedAnswer.metric,
      computedAnswer.operation
    );

    if (!winner) {
      return {
        answer:
          "Não encontrei um registro válido para determinar quem teve o maior valor.",
        confidence: "medium" as const,
        usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
        followUpQuestions: [
          "Top 5 por valor",
          "Compare os dois maiores valores",
        ],
      };
    }

    return {
      answer: `O maior valor encontrado foi de **${winner.entity}**, com **${formatNumber(
        winner.value
      )}** na coluna **${metricLabel}**.`,
      confidence: "high" as const,
      usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
      followUpQuestions: [
        `Top 5 ${computedAnswer.dimension} por ${metricLabel}`,
        `Compare os 2 maiores ${computedAnswer.dimension}`,
        `Qual categoria teve maior ${metricLabel}?`,
      ],
    };
  }

  if (computedAnswer.type === "top_n") {
    const items = Array.isArray(computedAnswer.items) ? computedAnswer.items : [];
    const metricLabel = getMetricLabel(
      computedAnswer.metric,
      computedAnswer.operation
    );
    const operationLabel =
      computedAnswer.operation === "avg"
        ? "média"
        : computedAnswer.operation === "count"
        ? "contagem"
        : "valor";

    if (!items.length) {
      return {
        answer: "Não encontrei dados suficientes para montar esse ranking.",
        confidence: "medium" as const,
        usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
        followUpQuestions: [
          "Qual teve o maior valor?",
          "Qual mês teve maior crescimento?",
        ],
      };
    }

    const ranking = items
      .map(
        (item: { name: string; value: number }, index: number) =>
          `${index + 1}. ${item.name} — ${formatNumber(item.value)}`
      )
      .join("\n");

    return {
      answer: `Aqui está o ranking dos principais resultados com base em **${operationLabel}** de **${metricLabel}**:\n\n${ranking}`,
      confidence: "high" as const,
      usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
      followUpQuestions: [
        `Qual ${computedAnswer.dimension} teve maior ${metricLabel}?`,
        `Compare os 2 melhores ${computedAnswer.dimension}`,
        `Como isso evolui no tempo?`,
      ],
    };
  }

  if (computedAnswer.type === "max_category") {
    const winner = computedAnswer.winner;
    const metricLabel = getMetricLabel(
      computedAnswer.metric,
      computedAnswer.operation
    );
    const operationLabel =
      computedAnswer.operation === "avg"
        ? "maior média"
        : computedAnswer.operation === "count"
        ? "maior contagem"
        : "maior resultado";

    if (!winner) {
      return {
        answer:
          "Não consegui identificar uma categoria vencedora com os dados atuais.",
        confidence: "medium" as const,
        usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
        followUpQuestions: [
          "Top 5 categorias por valor",
          "Mostre a distribuição por categoria",
        ],
      };
    }

    return {
      answer: `A categoria com ${operationLabel} foi **${winner.name}**, com **${formatNumber(
        winner.value
      )}** em **${metricLabel}**.`,
      confidence: "high" as const,
      usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
      followUpQuestions: [
        `Top 5 ${computedAnswer.dimension} por ${metricLabel}`,
        `Compare as 2 melhores ${computedAnswer.dimension}`,
        `Qual foi a participação dessa categoria no total?`,
      ],
    };
  }

  if (computedAnswer.type === "growth_by_period") {
    const winner = computedAnswer.winner;
    const metricLabel = getMetricLabel(
      computedAnswer.metric,
      computedAnswer.operation
    );

    if (!winner) {
      return {
        answer:
          "Não consegui calcular crescimento entre períodos com segurança nesse dataset.",
        confidence: "medium" as const,
        usedColumns: [computedAnswer.temporal, computedAnswer.metric].filter(Boolean),
        followUpQuestions: [
          "Mostre a evolução temporal",
          "Qual período teve maior valor?",
        ],
      };
    }

    const growthValue =
      typeof winner.growth === "number"
        ? `${formatNumber(winner.growth)}%`
        : "valor não disponível";

    return {
      answer: `O maior crescimento ocorreu em **${winner.period}**, com variação de **${growthValue}** usando a métrica **${metricLabel}**.`,
      confidence: "high" as const,
      usedColumns: [computedAnswer.temporal, computedAnswer.metric].filter(Boolean),
      followUpQuestions: [
        `Qual período teve maior ${metricLabel}?`,
        `Mostre a evolução de ${metricLabel} no tempo`,
        `Compare os 2 melhores períodos`,
      ],
    };
  }

  if (computedAnswer.type === "compare_groups") {
    const winner = computedAnswer.winner;
    const second = computedAnswer.second;
    const metricLabel = getMetricLabel(
      computedAnswer.metric,
      computedAnswer.operation
    );

    if (!winner || !second) {
      return {
        answer:
          "Não encontrei grupos suficientes para fazer uma comparação confiável.",
        confidence: "medium" as const,
        usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
        followUpQuestions: [
          `Top 5 ${computedAnswer.dimension}`,
          `Qual ${computedAnswer.dimension} lidera?`,
        ],
      };
    }

    const diff = winner.value - second.value;
    const ratio = second.value === 0 ? 0 : diff / second.value;

    return {
      answer: `Na comparação entre os principais grupos, **${winner.name}** lidera com **${formatNumber(
        winner.value
      )}**, enquanto **${second.name}** aparece em seguida com **${formatNumber(
        second.value
      )}**. A diferença entre eles é de **${formatNumber(
        diff
      )}**, o que representa **${formatNumber(ratio * 100)}%** acima do segundo colocado, considerando **${metricLabel}**.`,
      confidence: "high" as const,
      usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
      followUpQuestions: [
        `Qual a participação de cada ${computedAnswer.dimension}?`,
        `Top 5 ${computedAnswer.dimension}`,
        `Como isso evolui no tempo?`,
      ],
    };
  }

  if (computedAnswer.type === "share_by_dimension") {
    const items = Array.isArray(computedAnswer.items) ? computedAnswer.items : [];

    if (!items.length) {
      return {
        answer: "Não encontrei dados suficientes para calcular a participação por grupo.",
        confidence: "medium" as const,
        usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
        followUpQuestions: [
          `Qual ${computedAnswer.dimension} lidera?`,
          `Top 5 ${computedAnswer.dimension}`,
        ],
      };
    }

    const ranking = items
      .slice(0, 5)
      .map(
        (
          item: { name: string; value: number; share: number },
          index: number
        ) =>
          `${index + 1}. ${item.name} — ${formatNumber(item.value)} (${formatNumber(
            item.share * 100
          )}%)`
      )
      .join("\n");

    return {
      answer: `Aqui está a participação dos principais grupos em **${computedAnswer.dimension}**:\n\n${ranking}`,
      confidence: "high" as const,
      usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
      followUpQuestions: [
        `Qual ${computedAnswer.dimension} lidera?`,
        `Compare os 2 maiores grupos`,
        `Mostre o total por ${computedAnswer.dimension}`,
      ],
    };
  }

  if (computedAnswer.type === "global_aggregate") {
    const metricLabel = getMetricLabel(
      computedAnswer.metric,
      computedAnswer.operation
    );

    if (computedAnswer.operation === "count") {
      return {
        answer: `O dataset possui **${formatNumber(
          computedAnswer.total
        )} ${metricLabel}** no total.`,
        confidence: "high" as const,
        usedColumns: [computedAnswer.metric],
        followUpQuestions: [
          "Quantos registros existem por cliente?",
          "Quantos registros existem por categoria?",
          "Top 5 grupos por quantidade",
        ],
      };
    }

    if (computedAnswer.operation === "avg") {
      return {
        answer: `A média de **${metricLabel}** no dataset é **${formatNumber(
          computedAnswer.avg
        )}**.\n\nForam considerados **${formatNumber(
          computedAnswer.count
        )} registros**, com total de **${formatNumber(computedAnswer.total)}**.`,
        confidence: "high" as const,
        usedColumns: [computedAnswer.metric],
        followUpQuestions: [
          `Qual a média de ${metricLabel} por cliente?`,
          `Qual a média de ${metricLabel} por categoria?`,
          `Quem tem a maior média de ${metricLabel}?`,
        ],
      };
    }

    return {
      answer: `O total de **${metricLabel}** é **${formatNumber(
        computedAnswer.total
      )}**.\n\nForam considerados **${formatNumber(
        computedAnswer.count
      )} registros** na métrica **${metricLabel}**.`,
      confidence: "high" as const,
      usedColumns: [computedAnswer.metric],
      followUpQuestions: [
        `Qual o total de ${metricLabel} por cliente?`,
        `Qual a média de ${metricLabel} por categoria?`,
        `Top 5 por ${metricLabel}`,
      ],
    };
  }

  return {
    answer:
      "Consegui processar parte da sua pergunta, mas ainda não encontrei uma resposta estruturada para esse tipo de análise.",
    confidence: "medium" as const,
    usedColumns: [
      parsed.dimension,
      parsed.metric,
      parsed.temporal,
    ].filter(Boolean),
    followUpQuestions: [
      "Top 5 por valor",
      "Qual categoria teve maior valor?",
      "Qual mês teve maior crescimento?",
    ],
  };
}