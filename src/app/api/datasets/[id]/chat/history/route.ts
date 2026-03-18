import { NextRequest, NextResponse } from "next/server";
import { getOrCreateDatasetChatSession } from "@/src/lib/ai/session";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: datasetId } = await context.params;

    const session = await getOrCreateDatasetChatSession(datasetId);

    const messages = await prisma.datasetChatMessage.findMany({
      where: {
        sessionId: session.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      messages: messages.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        meta: message.metaJson ?? undefined,
        createdAt: message.createdAt,
      })),
    });
  } catch (error) {
    console.error("chat history error:", error);
    return NextResponse.json(
      { error: "Erro ao carregar histórico do chat." },
      { status: 500 }
    );
  }
}