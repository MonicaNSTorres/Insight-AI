import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Não autenticado." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const dataset = await prisma.dataset.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!dataset) {
      return NextResponse.json(
        { message: "Dataset não encontrado." },
        { status: 404 }
      );
    }

    if (dataset.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Você não tem permissão para excluir este dataset." },
        { status: 403 }
      );
    }

    await prisma.dataset.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Dataset excluído com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao excluir dataset:", error);

    return NextResponse.json(
      { message: "Erro interno ao excluir dataset." },
      { status: 500 }
    );
  }
}