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

  if (brDate.test(trimmed) || isoDate.test(trimmed)) {
    return true;
  }

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
    .slice(0, 30)
    .map((value) => String(value).trim());

  if (sample.length === 0) return "string";

  const allBoolean = sample.every(looksLikeBoolean);
  if (allBoolean) return "boolean";

  const allNumber = sample.every(looksLikeNumber);
  if (allNumber) return "number";

  const allDate = sample.every(looksLikeDate);
  if (allDate) return "date";

  return "string";
}

function detectSemanticRole(
  columnName: string,
  detectedType: DetectedColumn["detectedType"]
): DetectedColumn["semanticRole"] {
  const normalized = columnName.trim().toLowerCase();

  if (!normalized) {
    return "identifier";
  }

  if (
    normalized === "id" ||
    normalized.startsWith("id_") ||
    normalized.endsWith("_id") ||
    normalized.includes("codigo") ||
    normalized.includes("código") ||
    normalized.includes("cpf") ||
    normalized.includes("cnpj") ||
    normalized.includes("matricula") ||
    normalized.includes("matrícula") ||
    normalized.includes("chave") ||
    normalized.includes("registro") ||
    normalized.includes("nr_") ||
    normalized.startsWith("nr")
  ) {
    return "identifier";
  }

  if (
    detectedType === "date" &&
    !normalized.includes("nascimento")
  ) {
    return "temporal";
  }

  if (
    (
      normalized.includes("data") ||
      normalized.includes("dt_") ||
      normalized.includes("mes") ||
      normalized.includes("mês") ||
      normalized.includes("ano") ||
      normalized.includes("periodo") ||
      normalized.includes("período") ||
      normalized.includes("competencia") ||
      normalized.includes("competência") ||
      normalized.includes("referencia") ||
      normalized.includes("referência")
    ) &&
    !normalized.includes("nascimento")
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
      normalized.includes("qtde") ||
      normalized.includes("preco") ||
      normalized.includes("preço") ||
      normalized.includes("saldo") ||
      normalized.includes("volume") ||
      normalized.includes("montante") ||
      normalized.includes("meta") ||
      normalized.includes("percentual") ||
      normalized.includes("porcentagem") ||
      normalized.includes("taxa") ||
      normalized.includes("vl_") ||
      normalized.startsWith("vl")
    )
  ) {
    return "metric";
  }

  if (detectedType === "number") {
    return "identifier";
  }

  return "dimension";
}

export function detectDatasetSchema(
  rows: Record<string, unknown>[],
  headers: string[]
): DetectedColumn[] {
  return headers.map((header) => {
    const values = rows.map((row) => row[header]);
    const detectedType = detectTechnicalType(values);
    const semanticRole = detectSemanticRole(header, detectedType);

    return {
      name: header,
      detectedType,
      semanticRole,
    };
  });
}