import { prisma } from "@/src/lib/prisma";
import { analyzeDataset } from "@/src/lib/dataset-analysis";

type DatasetRow = Record<string, unknown>;

export async function buildDatasetChatContext(datasetId: string) {
  const dataset = await prisma.dataset.findUnique({
    where: { id: datasetId },
    include: {
      columns: true,
    },
  });

  if (!dataset) {
    throw new Error("Dataset não encontrado.");
  }

  const rows: DatasetRow[] = Array.isArray(dataset.rawJson)
    ? (dataset.rawJson as DatasetRow[])
    : [];

  const schema = dataset.columns;

  const metricCandidates = schema
    .filter((column) => column.semanticRole === "metric")
    .map((column) => column.name);

  const dimensionCandidates = schema
    .filter(
      (column) =>
        column.semanticRole === "dimension" ||
        column.semanticRole === "category"
    )
    .map((column) => column.name);

  const temporalCandidates = schema
    .filter((column) => column.semanticRole === "temporal")
    .map((column) => column.name);

  const analysis = analyzeDataset({
    rows,
    metricCandidates,
    dimensionCandidates,
    temporalCandidates,
  });

  return {
    dataset: {
      id: dataset.id,
      name: dataset.name,
      totalRows: rows.length,
      totalColumns: Object.keys(rows[0] || {}).length,
    },
    schema: {
      metrics: schema
        .filter((c) => c.semanticRole === "metric")
        .map((c) => c.name),
      dimensions: schema
        .filter(
          (c) =>
            c.semanticRole === "dimension" || c.semanticRole === "category"
        )
        .map((c) => c.name),
      temporals: schema
        .filter((c) => c.semanticRole === "temporal")
        .map((c) => c.name),
      identifiers: schema
        .filter((c) => c.semanticRole === "identifier")
        .map((c) => c.name),
    },
    preview: rows.slice(0, 15),
    analysis,
    rows,
  };
}