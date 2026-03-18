import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = await req.json();

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: body.name,
        email: body.email,
        theme: body.theme,
        language: body.language,
        notificationsEnabled: body.notificationsEnabled,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao salvar configurações." },
      { status: 500 }
    );
  }
}