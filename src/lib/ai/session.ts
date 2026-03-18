import { prisma } from "@/src/lib/prisma";

export async function getOrCreateDatasetChatSession(datasetId: string) {
  let session = await prisma.datasetChatSession.findFirst({
    where: { datasetId },
    orderBy: { createdAt: "asc" },
  });

  if (!session) {
    session = await prisma.datasetChatSession.create({
      data: {
        datasetId,
        title: "Conversa principal",
      },
    });
  }

  return session;
}