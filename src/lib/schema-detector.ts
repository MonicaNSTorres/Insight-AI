export type DetectedColumn = {
  name: string;
  detectedType: "string" | "number" | "date" | "boolean";
  semanticRole: "metric" | "dimension" | "temporal" | "identifier";
};

function isEmpty(value: unknown) {
  return value === null || value === undefined || String(value).trim() === "";
}

function looksLikeNumber(value: string) {
  const normalized = value
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  return !Number.isNaN(Number(normalized));
}

function looksLikeDate(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;

  const brDate = /^\d{2}\/\d{2}\/\d{4}$/;
  const isoDate = /^\d{4}-\d{2}-\d{2}/;

  if (brDate.test(trimmed) || isoDate.test(trimmed)) return true;

  const parsed = Date.parse(trimmed);
  return !Number.isNaN(parsed);
}

function looksLikeBoolean(value: string) {
  const normalized = value.trim().toLowerCase();

  return [
    "true",
    "false",
    "sim",
    "não",
    "nao",
    "yes",
    "no",
    "0",
    "1",
  ].includes(normalized);
}

function detectTechnicalType(values: unknown[]): DetectedColumn["detectedType"] {
  const sample = values
    .filter((value) => !isEmpty(value))
    .slice(0, 50)
    .map((value) => String(value).trim());

  if (!sample.length) return "string";

  const booleanRate = sample.filter(looksLikeBoolean).length / sample.length;
  if (booleanRate > 0.9) return "boolean";

  const numberRate = sample.filter(looksLikeNumber).length / sample.length;
  if (numberRate > 0.9) return "number";

  const dateRate = sample.filter(looksLikeDate).length / sample.length;
  if (dateRate >= 0.6) return "date";

  return "string";
}

function detectSemanticRole(
  columnName: string,
  detectedType: DetectedColumn["detectedType"],
  values: unknown[]
): DetectedColumn["semanticRole"] {
  const normalized = columnName.trim().toLowerCase();

  const nonEmptyValues = values.filter((v) => !isEmpty(v));
  const uniqueValues = new Set(nonEmptyValues.map((v) => String(v)));

  const uniquenessRatio =
    uniqueValues.size / Math.max(nonEmptyValues.length, 1);

  if (
    normalized === "id" ||
    normalized.includes("id") ||
    normalized.includes("codigo") ||
    normalized.includes("cpf") ||
    normalized.includes("cnpj") ||
    normalized.includes("matricula") ||
    normalized.includes("chave") ||
    normalized.includes("registro") ||
    normalized.includes("nr_") ||
    normalized.startsWith("nr") ||
    uniquenessRatio > 0.95
  ) {
    return "identifier";
  }

  if (
    detectedType === "date" ||
    normalized.includes("data") ||
    normalized.includes("dt_") ||
    normalized.includes("mes") ||
    normalized.includes("ano") ||
    normalized.includes("periodo") ||
    normalized.includes("competencia") ||
    normalized.includes("referencia") ||
    normalized.includes("abertura") ||
    normalized.includes("fechamento")
  ) {
    return "temporal";
  }

  if (
    detectedType === "number" &&
    (
      normalized.includes("valor") ||
      normalized.includes("total") ||
      normalized.includes("receita") ||
      normalized.includes("faturamento") ||
      normalized.includes("quantidade") ||
      normalized.includes("qtd") ||
      normalized.includes("preco") ||
      normalized.includes("saldo") ||
      normalized.includes("volume") ||
      normalized.includes("meta") ||
      normalized.includes("taxa") ||
      normalized.includes("tempo") ||
      normalized.includes("hora") ||
      normalized.includes("horas") ||
      normalized.includes("duracao") ||
      normalized.includes("duração") ||
      normalized.includes("prazo") ||
      normalized.includes("vl_") ||
      normalized.startsWith("vl") ||
      uniquenessRatio < 0.7
    )
  ) {
    return "metric";
  }

  return "dimension";
}

export function detectColumns(
  rows: Record<string, unknown>[]
): DetectedColumn[] {
  if (!rows.length) return [];

  const headers = Object.keys(rows[0]);

  return headers.map((header) => {
    const values = rows.map((row) => row[header]);

    const detectedType = detectTechnicalType(values);

    const semanticRole = detectSemanticRole(
      header,
      detectedType,
      values
    );

    return {
      name: header,
      detectedType,
      semanticRole,
    };
  });
}