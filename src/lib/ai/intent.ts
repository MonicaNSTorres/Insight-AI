export type ChatIntent =
  | "top_n"
  | "max_category"
  | "growth_by_period"
  | "compare_groups"
  | "max_entity_by_metric"
  | "aggregate_by_dimension"
  | "share_by_dimension"
  | "generic_analysis";

export type ParsedQuestion = {
  intent: ChatIntent;
  metric?: string;
  dimension?: string;
  temporal?: string;
  limit?: number;
  operation?: "sum" | "avg" | "count";
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(/[^a-z0-9_]+/)
    .filter(Boolean);
}

function scoreColumnMatch(column: string, question: string, aliases: string[]) {
  const normalizedColumn = normalizeText(column);
  const normalizedQuestion = normalizeText(question);
  const columnTokens = tokenize(column);
  const questionTokens = tokenize(question);

  let score = 0;

  if (normalizedQuestion.includes(normalizedColumn)) {
    score += 12;
  }

  for (const token of columnTokens) {
    if (questionTokens.includes(token)) {
      score += 4;
    }
  }

  for (const alias of aliases) {
    const normalizedAlias = normalizeText(alias);

    if (normalizedQuestion.includes(normalizedAlias)) {
      score += 5;

      if (normalizedColumn.includes(normalizedAlias)) {
        score += 8;
      }

      for (const token of tokenize(alias)) {
        if (columnTokens.includes(token)) {
          score += 4;
        }
      }
    }
  }

  return score;
}

function findBestColumnMatch(
  columns: string[],
  question: string,
  aliases: string[],
  preferredIncludes?: string[],
  fallbackToFirst: boolean = true
) {
  if (!columns.length) return undefined;

  const ranked = columns
    .map((column) => {
      let score = scoreColumnMatch(column, question, aliases);
      const normalizedColumn = normalizeText(column);

      if (preferredIncludes?.length) {
        for (const preferred of preferredIncludes) {
          const normalizedPreferred = normalizeText(preferred);
          if (normalizedColumn.includes(normalizedPreferred)) {
            score += 10;
          }
        }
      }

      return { column, score };
    })
    .sort((a, b) => b.score - a.score);

  if ((ranked[0]?.score ?? 0) > 0) {
    return ranked[0].column;
  }

  return fallbackToFirst ? columns[0] : undefined;
}

function extractTopLimit(question: string) {
  const q = normalizeText(question);

  const explicitTop = q.match(/\btop\s+(\d+)\b/);
  if (explicitTop) {
    return Number(explicitTop[1]);
  }

  if (q.includes("top 10")) return 10;
  if (q.includes("top 5")) return 5;
  if (q.includes("top 3")) return 3;
  if (q.includes("3 maiores")) return 3;
  if (q.includes("5 maiores")) return 5;
  if (q.includes("10 maiores")) return 10;

  return undefined;
}

function questionRequestsCount(question: string) {
  const q = normalizeText(question);

  return (
    q.includes("quantos") ||
    q.includes("quantidade") ||
    q.includes("numero de") ||
    q.includes("número de") ||
    q.includes("contagem") ||
    q.includes("aparece") ||
    q.includes("aparecem") ||
    q.includes("ocorrencias") ||
    q.includes("ocorrências") ||
    q.includes("registros") ||
    q.includes("mais aparece") ||
    q.includes("mais aparecem")
  );
}

function detectOperation(question: string): "sum" | "avg" | "count" {
  const q = normalizeText(question);

  if (
    q.includes("media") ||
    q.includes("média") ||
    q.includes("tempo medio") ||
    q.includes("tempo médio") ||
    q.includes("em media") ||
    q.includes("em média")
  ) {
    return "avg";
  }

  if (
    q.includes("quantos") ||
    q.includes("quantidade") ||
    q.includes("numero de") ||
    q.includes("número de") ||
    q.includes("contagem") ||
    q.includes("aparece") ||
    q.includes("aparecem") ||
    q.includes("registros")
  ) {
    return "count";
  }

  return "sum";
}

export function parseQuestionIntent(
  question: string,
  context: {
    schema: {
      metrics: string[];
      dimensions: string[];
      temporals: string[];
      identifiers?: string[];
    };
  }
): ParsedQuestion {
  const q = normalizeText(question);

  let intent: ChatIntent = "generic_analysis";
  let limit: number | undefined = extractTopLimit(question);
  const operation = detectOperation(question);

  const asksTop =
    q.includes("top ") ||
    q.includes("maiores") ||
    q.includes("melhores") ||
    q.includes("ranking") ||
    q.includes("lideres") ||
    q.includes("líderes");

  const asksGrowth =
    q.includes("crescimento") ||
    q.includes("evolucao") ||
    q.includes("evolução") ||
    q.includes("ao longo do tempo") ||
    q.includes("por periodo") ||
    q.includes("por período") ||
    q.includes("por mes") ||
    q.includes("por mês");

  const asksCompare =
    q.includes("compare") ||
    q.includes("comparar") ||
    q.includes("diferenca") ||
    q.includes("diferença") ||
    q.includes("segundo colocado") ||
    q.includes("segunda colocada") ||
    q.includes("primeiro e segundo");

  const asksAggregate =
    q.includes("total por") ||
    q.includes("soma por") ||
    q.includes("agrupado por") ||
    q.includes("agrupada por") ||
    q.includes("por cliente") ||
    q.includes("por empresa") ||
    q.includes("por categoria") ||
    q.includes("por regiao") ||
    q.includes("por região") ||
    q.includes("por produto") ||
    q.includes("quantos por") ||
    q.includes("quantidade por") ||
    q.includes("media por") ||
    q.includes("média por") ||
    q.includes("tempo medio por") ||
    q.includes("tempo médio por");

  const asksShare =
    q.includes("participacao") ||
    q.includes("participação") ||
    q.includes("percentual") ||
    q.includes("representa") ||
    q.includes("fatia") ||
    q.includes("share");

  const asksLeader =
    q.includes("quem tem o maior") ||
    q.includes("quem tem a maior") ||
    q.includes("quem teve o maior") ||
    q.includes("quem teve a maior") ||
    q.includes("qual cliente tem o maior") ||
    q.includes("qual empresa tem o maior") ||
    q.includes("qual categoria tem o maior") ||
    q.includes("qual categoria teve o maior") ||
    q.includes("qual produto teve o maior") ||
    q.includes("qual regiao teve o maior") ||
    q.includes("qual região teve o maior") ||
    q.includes("qual lidera") ||
    q.includes("qual liderou") ||
    q.includes("qual foi o maior") ||
    q.includes("qual foi a maior") ||
    q.includes("qual mais aparece") ||
    q.includes("quem mais aparece");

  if (asksShare) {
    intent = "share_by_dimension";
  } else if (asksTop) {
    intent = "top_n";
  } else if (asksGrowth) {
    intent = "growth_by_period";
  } else if (asksCompare) {
    intent = "compare_groups";
  } else if (asksAggregate) {
    intent = "aggregate_by_dimension";
  } else if (asksLeader) {
    intent = "max_category";
  }

  const qLower = normalizeText(question);

  const isExplicitCount =
    qLower.includes("quantos") ||
    qLower.includes("quantidade") ||
    qLower.includes("numero de") ||
    qLower.includes("número de") ||
    qLower.includes("contagem") ||
    qLower.includes("aparece") ||
    qLower.includes("aparecem") ||
    qLower.includes("registros");

  const isMetricQuestion =
    qLower.includes("total") ||
    qLower.includes("soma") ||
    qLower.includes("media") ||
    qLower.includes("média");

  const shouldUseCountMetric =
    (isExplicitCount && !isMetricQuestion) ||
    operation === "count" ||
    context.schema.metrics.length === 0;

  const metric = shouldUseCountMetric
    ? "__count__"
    : findBestColumnMatch(context.schema.metrics, question, [
      "valor",
      "total",
      "faturamento",
      "receita",
      "renda",
      "salario",
      "quantidade",
      "saldo",
      "preco",
      "preço",
      "volume",
      "meta",
      "taxa",
      "tempo",
      "horas",
      "hora",
      "resolucao",
      "resolução",
      "duracao",
      "duração",
      "prazo",
    ]);

  const dimension = findBestColumnMatch(
    context.schema.dimensions,
    question,
    [
      "cliente",
      "empresa",
      "categoria",
      "grupo",
      "produto",
      "regiao",
      "região",
      "setor",
      "departamento",
      "funcionario",
      "funcionário",
      "colaborador",
      "pessoa",
      "nome",
      "area",
      "área",
      "cargo",
      "responsavel",
      "responsável",
      "status",
      "prioridade",
    ],
    [
      "cliente",
      "empresa",
      "categoria",
      "produto",
      "regiao",
      "setor",
      "departamento",
      "funcionario",
      "cargo",
      "responsavel",
      "status",
      "prioridade",
    ]
  );

  const temporal = findBestColumnMatch(context.schema.temporals, question, [
    "mes",
    "mês",
    "ano",
    "data",
    "periodo",
    "período",
    "competencia",
    "competência",
    "referencia",
    "referência",
    "abertura",
    "fechamento",
  ]);

  const asksTimeMetric =
    q.includes("tempo") ||
    q.includes("hora") ||
    q.includes("horas") ||
    q.includes("resolucao") ||
    q.includes("resolução");

  const timeMetric = asksTimeMetric
    ? findBestColumnMatch(context.schema.metrics, question, [
      "tempo",
      "hora",
      "horas",
      "resolucao",
      "resolução",
      "duracao",
      "duração",
    ])
    : undefined;

  const isGlobalMetricQuestion =
    (q.includes("total") ||
      q.includes("soma") ||
      q.includes("media") ||
      q.includes("média")) &&
    !q.includes(" por ");

  if (isGlobalMetricQuestion) {
    return {
      intent: "generic_analysis",
      metric: timeMetric || metric,
      dimension: undefined,
      temporal,
      limit,
      operation,
    };
  }

  if (intent === "top_n" && !limit) {
    limit = 5;
  }

  const asksWho =
    q.includes("quem") ||
    q.includes("quem tem") ||
    q.includes("quem esta") ||
    q.includes("quem está") ||
    q.includes("quem teve");

  if (asksWho) {
    const possiblePersonDimension = findBestColumnMatch(
      context.schema.dimensions,
      question,
      ["responsavel", "responsável", "funcionario", "funcionário", "colaborador", "analista"],
      ["responsavel", "responsável", "funcionario", "funcionário"],
      false
    );

    if (possiblePersonDimension) {
      return {
        intent: "max_category",
        metric: timeMetric || metric,
        dimension: possiblePersonDimension,
        temporal,
        limit,
        operation,
      };
    }
  }

  return {
    intent,
    metric: timeMetric || metric,
    dimension,
    temporal,
    limit,
    operation,
  };
}