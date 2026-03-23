import { prisma } from "@/src/lib/prisma";
import type { GeneratedInsightsResult } from "@/src/lib/insight-generator";

type SaveDatasetInsightsInput = {
  datasetId: string;
  result: GeneratedInsightsResult;
};

export async function saveDatasetInsights({
  datasetId,
  result,
}: SaveDatasetInsightsInput) {
  await prisma.$transaction([
    prisma.insight.deleteMany({
      where: { datasetId },
    }),
    prisma.insight.createMany({
      data: result.insights.map((insight) => ({
        datasetId,
        title: insight.title,
        description: insight.description,
        priority: insight.priority,
        tone: insight.tone ?? null,
      })),
    }),
  ]);
}