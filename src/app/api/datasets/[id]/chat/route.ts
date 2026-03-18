import { NextRequest, NextResponse } from "next/server";
import { buildDatasetChatContext } from "@/src/lib/ai/context";
import { parseQuestionIntent } from "@/src/lib/ai/intent";
import { executeQuestionLocally } from "@/src/lib/ai/answer";
import { generateChatAnswer } from "@/src/lib/ai/prompt";
import { generateFallbackResponse } from "@/src/lib/ai/fallback";
import { getOrCreateDatasetChatSession } from "@/src/lib/ai/session";
import { prisma } from "@/src/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: datasetId } = await context.params;
    const body = await req.json();
    const question = String(body.question || "").trim();

    if (!question) {
      return NextResponse.json(
        { error: "Pergunta não informada." },
        { status: 400 }
      );
    }

    const session = await getOrCreateDatasetChatSession(datasetId);

    await prisma.datasetChatMessage.create({
      data: {
        sessionId: session.id,
        role: "user",
        content: question,
      },
    });

    const chatContext = await buildDatasetChatContext(datasetId);

    const parsed = parseQuestionIntent(question, chatContext);

    const computedAnswer = executeQuestionLocally({
      question,
      parsed,
      context: chatContext,
    });

    console.log("parsed", parsed);
    console.log("computedAnswer", computedAnswer);

    let response;

    try {
      response = await generateChatAnswer({
        question,
        context: chatContext,
        parsed,
        computedAnswer,
      });
    } catch (aiError) {
      console.error("AI error:", aiError);

      response = generateFallbackResponse({
        parsed,
        computedAnswer,
      });
    }

    await prisma.datasetChatMessage.create({
      data: {
        sessionId: session.id,
        role: "assistant",
        content: response.answer,
        metaJson: {
          confidence: response.confidence,
          usedColumns: response.usedColumns,
          followUps: response.followUpQuestions,
        },
      },
    });

    return NextResponse.json({
      ...response,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("dataset chat error:", error);
    return NextResponse.json(
      { error: "Erro ao processar pergunta." },
      { status: 500 }
    );
  }
}