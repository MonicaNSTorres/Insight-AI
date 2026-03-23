import { prisma } from "@/src/lib/prisma";
import { prepareDatasetAnalysis } from "@/src/lib/prepare-analysis";
import { analyzeDataset } from "@/src/lib/dataset-analysis";
import {
  generateDatasetInsights,
  type GeneratedInsightsResult,
} from "@/src/lib/insight-generator";
import { saveDatasetInsights } from "@/src/lib/save-dataset-insights";

type ProcessDatasetInsightsResult = {
  analysis: ReturnType<typeof analyzeDataset> | null;
  result: GeneratedInsightsResult | null;
};

export async function processDatasetInsights(
  datasetId: string,
  userId: string
): Promise<ProcessDatasetInsightsResult> {
  const dataset = await prisma.dataset.findFirst({
    where: {
      id: datasetId,
      userId,
    },
  });

  if (!dataset) {
    return {
      analysis: null,
      result: null,
    };
  }

  const rows = (dataset.rawJson as any[]) || [];
  const prepared = prepareDatasetAnalysis(rows);

  if (!prepared) {
    await prisma.insight.deleteMany({
      where: { datasetId },
    });

    return {
      analysis: null,
      result: null,
    };
  }

  const analysis = analyzeDataset(prepared);
  const result = generateDatasetInsights(analysis);

  await saveDatasetInsights({
    datasetId,
    result,
  });

  return {
    analysis,
    result,
  };
}