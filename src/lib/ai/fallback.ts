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

    if (!items.length) {
      return {
        answer: `Não encontrei dados suficientes para somar **${computedAnswer.metric}** por **${computedAnswer.dimension}**.`,
        confidence: "medium" as const,
        usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
        followUpQuestions: [
          `Qual ${computedAnswer.dimension} teve maior ${computedAnswer.metric}?`,
          `Top 5 ${computedAnswer.dimension} por ${computedAnswer.metric}`,
          `Como ${computedAnswer.metric} evolui no tempo?`,
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
      answer: `Aqui está o total de **${computedAnswer.metric}** por **${computedAnswer.dimension}**:\n\n${ranking}`,
      confidence: "high" as const,
      usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
      followUpQuestions: [
        `Qual ${computedAnswer.dimension} teve maior ${computedAnswer.metric}?`,
        `Top 5 ${computedAnswer.dimension} por ${computedAnswer.metric}`,
        `Compare os 2 maiores resultados por ${computedAnswer.dimension}`,
      ],
    };
  }

  if (computedAnswer.type === "max_entity_by_metric") {
    const winner = computedAnswer.winner;

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
      )}** na coluna **${computedAnswer.metric}**.`,
      confidence: "high" as const,
      usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
      followUpQuestions: [
        `Top 5 ${computedAnswer.dimension} por ${computedAnswer.metric}`,
        `Compare os 2 maiores ${computedAnswer.dimension}`,
        `Qual categoria teve maior ${computedAnswer.metric}?`,
      ],
    };
  }

  if (computedAnswer.type === "top_n") {
    const items = Array.isArray(computedAnswer.items) ? computedAnswer.items : [];

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
      answer: `Aqui está o ranking dos principais resultados com base em **${computedAnswer.metric}**:\n\n${ranking}`,
      confidence: "high" as const,
      usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
      followUpQuestions: [
        `Qual ${computedAnswer.dimension} teve maior ${computedAnswer.metric}?`,
        `Compare os 2 melhores ${computedAnswer.dimension}`,
        `Como isso evolui no tempo?`,
      ],
    };
  }

  if (computedAnswer.type === "max_category") {
    const winner = computedAnswer.winner;

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
      answer: `A categoria com maior resultado foi **${winner.name}**, com **${formatNumber(
        winner.value
      )}** em **${computedAnswer.metric}**.`,
      confidence: "high" as const,
      usedColumns: [computedAnswer.dimension, computedAnswer.metric].filter(Boolean),
      followUpQuestions: [
        `Top 5 ${computedAnswer.dimension} por ${computedAnswer.metric}`,
        `Compare as 2 melhores ${computedAnswer.dimension}`,
        `Qual foi a participação dessa categoria no total?`,
      ],
    };
  }

  if (computedAnswer.type === "growth_by_period") {
    const winner = computedAnswer.winner;

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
      answer: `O maior crescimento ocorreu em **${winner.period}**, com variação de **${growthValue}** usando a métrica **${computedAnswer.metric}**.`,
      confidence: "high" as const,
      usedColumns: [computedAnswer.temporal, computedAnswer.metric].filter(Boolean),
      followUpQuestions: [
        `Qual período teve maior ${computedAnswer.metric}?`,
        `Mostre a evolução de ${computedAnswer.metric} no tempo`,
        `Compare os 2 melhores períodos`,
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