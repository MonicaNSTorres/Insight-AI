"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/src/auth";
import { processDatasetInsights } from "@/src/lib/process-dataset-insights";

export async function reprocessDatasetInsights(datasetId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.");
  }

  await processDatasetInsights(datasetId, session.user.id);

  revalidatePath(`/app/insights?datasetId=${datasetId}`);
  revalidatePath("/app/insights");
}