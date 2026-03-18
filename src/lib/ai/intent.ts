export type ChatIntent =
  | "top_n"
  | "max_category"
  | "growth_by_period"
  | "compare_groups"
  | "max_entity_by_metric"
  | "aggregate_by_dimension"
  | "generic_analysis";

export type ParsedQuestion = {
  intent: ChatIntent;
  metric?: string;
  dimension?: string;
  temporal?: string;
  limit?: number;
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function scoreColumnMatch(column: string, question: string, aliases: string[]) {
  const normalizedColumn = normalizeText(column);
  const normalizedQuestion = normalizeText(question);

  let score = 0;

  if (normalizedQuestion.includes(normalizedColumn)) {
    score += 10;
  }

  for (const alias of aliases) {
    const normalizedAlias = normalizeText(alias);

    if (normalizedQuestion.includes(normalizedAlias)) {
      if (normalizedColumn.includes(normalizedAlias)) score += 8;
      if (normalizedAlias.includes(normalizedColumn)) score += 6;
    }
  }

  return score;
}

function findBestColumnMatch(
  columns: string[],
  question: string,
  aliases: string[],
  preferredIncludes?: string[]
) {
  if (!columns.length) return undefined;

  const ranked = columns
    .map((column) => {
      let score = scoreColumnMatch(column, question, aliases);

      if (preferredIncludes?.length) {
        const normalizedColumn = normalizeText(column);

        for (const preferred of preferredIncludes) {
          const normalizedPreferred = normalizeText(preferred);
          if (normalizedColumn.includes(normalizedPreferred)) {
            score += 20;
          }
        }
      }

      return { column, score };
    })
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.score > 0 ? ranked[0].column : columns[0];
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
  let limit: number | undefined;

  const asksTop =
    q.includes("top ") ||
    q.includes("maiores ") ||
    q.includes("melhores ");

  const asksGrowth =
    q.includes("maior crescimento") ||
    q.includes("crescimento") ||
    q.includes("evolucao") ||
    q.includes("evolucao temporal");

  const asksCompare =
    q.includes("compare") ||
    q.includes("comparar");

  const asksAggregate =
    q.includes("quantidade total por") ||
    q.includes("valor total por") ||
    q.includes("total por") ||
    q.includes("soma por") ||
    q.includes("vendida por") ||
    q.includes("vendido por") ||
    q.includes("agrupado por") ||
    q.includes("agrupada por");

  const asksEmployeeMax =
    q.includes("qual funcionario tem o maior") ||
    q.includes("qual funcionario tem a maior") ||
    q.includes("qual colaborador tem o maior") ||
    q.includes("qual colaborador tem a maior") ||
    q.includes("qual cliente tem o maior") ||
    q.includes("qual cliente tem a maior") ||
    q.includes("qual pessoa tem o maior") ||
    q.includes("qual pessoa tem a maior") ||
    q.includes("quem tem o maior") ||
    q.includes("quem tem a maior") ||
    q.includes("quem teve o maior") ||
    q.includes("quem teve a maior") ||
    q.includes("qual o nome do funcionario com maior") ||
    q.includes("qual o nome do funcionario com a maior") ||
    q.includes("qual o nome do cliente com maior") ||
    q.includes("qual o nome do cliente com a maior");

  const asksCategoryMax =
    q.includes("qual cargo tem o maior") ||
    q.includes("qual cargo tem a maior") ||
    q.includes("qual categoria tem o maior") ||
    q.includes("qual categoria tem a maior") ||
    q.includes("qual regiao tem o maior") ||
    q.includes("qual regiao tem a maior") ||
    q.includes("qual setor tem o maior") ||
    q.includes("qual setor tem a maior") ||
    q.includes("qual departamento tem o maior") ||
    q.includes("qual departamento tem a maior") ||
    q.includes("qual grupo tem o maior") ||
    q.includes("qual grupo tem a maior") ||
    q.includes("qual area tem o maior") ||
    q.includes("qual area tem a maior") ||
    q.includes("qual funcao tem o maior") ||
    q.includes("qual funcao tem a maior") ||
    q.includes("qual cargo teve o maior") ||
    q.includes("qual cargo teve a maior") ||
    q.includes("qual categoria teve o maior") ||
    q.includes("qual categoria teve a maior") ||
    q.includes("qual regiao teve o maior") ||
    q.includes("qual regiao teve a maior");

  if (asksTop) {
    intent = "top_n";

    if (q.includes("top 10")) limit = 10;
    else if (q.includes("top 5")) limit = 5;
    else if (q.includes("top 3")) limit = 3;
    else limit = 5;
  } else if (asksGrowth) {
    intent = "growth_by_period";
  } else if (asksCompare) {
    intent = "compare_groups";
  } else if (asksAggregate) {
    intent = "aggregate_by_dimension";
  } else if (asksEmployeeMax) {
    intent = "max_entity_by_metric";
  } else if (asksCategoryMax) {
    intent = "max_category";
  } else if (
    q.includes("maior valor") ||
    q.includes("maior renda") ||
    q.includes("maior receita") ||
    q.includes("melhor resultado")
  ) {
    intent = "max_category";
  }

  const metric = findBestColumnMatch(context.schema.metrics, question, [
    "valor",
    "total",
    "faturamento",
    "receita",
    "renda",
    "renda bruta",
    "salario",
    "quantidade",
    "saldo",
    "preco",
    "preço",
  ]);

  let dimension: string | undefined;

  if (intent === "max_entity_by_metric") {
    dimension = findBestColumnMatch(
      context.schema.dimensions,
      question,
      ["funcionario", "colaborador", "cliente", "pessoa", "nome"],
      ["funcionario", "colaborador", "cliente", "pessoa"]
    );
  } else if (
    intent === "max_category" ||
    intent === "aggregate_by_dimension" ||
    intent === "top_n"
  ) {
    dimension = findBestColumnMatch(
      context.schema.dimensions,
      question,
      [
        "cargo",
        "categoria",
        "setor",
        "departamento",
        "regiao",
        "região",
        "area",
        "área",
        "funcao",
        "função",
        "grupo",
        "produto",
      ],
      [
        "cargo",
        "categoria",
        "setor",
        "departamento",
        "regiao",
        "produto",
        "grupo",
      ]
    );
  } else {
    dimension = findBestColumnMatch(context.schema.dimensions, question, [
      "categoria",
      "grupo",
      "cliente",
      "funcionario",
      "nome",
      "colaborador",
      "pessoa",
      "cargo",
      "setor",
      "departamento",
      "regiao",
      "região",
      "area",
      "área",
      "funcao",
      "função",
      "produto",
    ]);
  }

  const temporal = findBestColumnMatch(context.schema.temporals, question, [
    "mes",
    "mês",
    "ano",
    "data",
    "periodo",
    "período",
    "admissao",
    "admissão",
  ]);

  return {
    intent,
    metric,
    dimension,
    temporal,
    limit,
  };
}