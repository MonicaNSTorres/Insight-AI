import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma"
import { parseCsvBuffer } from "@/src/lib/csv-parser";
import { parseExcelBuffer } from "@/src/lib/excel-parser";
import { detectColumns } from "@/src/lib/schema-detector";
import type { Prisma } from "@/src/generated/prisma/client";

export const runtime = "nodejs";

function sanitizeDatasetName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "").trim() || "Dataset sem nome";
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Não autenticado." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Arquivo não enviado." },
        { status: 400 }
      );
    }

    const fileName = file.name || "dataset";
    const lowerFileName = fileName.toLowerCase();

    const isCsv = lowerFileName.endsWith(".csv");
    const isXlsx = lowerFileName.endsWith(".xlsx") || lowerFileName.endsWith(".xls");

    if (!isCsv && !isXlsx) {
      return NextResponse.json(
        { message: "Formato inválido. Envie um arquivo CSV ou XLSX." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = isCsv
      ? parseCsvBuffer(buffer)
      : parseExcelBuffer(buffer);

    const { rows, headers } = parsed;

    if (!headers.length) {
      return NextResponse.json(
        { message: "Não foi possível identificar colunas no arquivo." },
        { status: 400 }
      );
    }

    if (!rows.length) {
      return NextResponse.json(
        { message: "O arquivo não contém linhas válidas." },
        { status: 400 }
      );
    }

    const detectedColumns = detectColumns(rows);

    const dataset = await prisma.dataset.create({
      data: {
        userId: session.user.id,
        name: sanitizeDatasetName(fileName),
        fileName,
        rowCount: rows.length,
        columnCount: headers.length,
        rawJson: rows as Prisma.InputJsonValue,
        columns: {
          create: detectedColumns.map((column) => ({
            name: column.name,
            detectedType: column.detectedType,
            semanticRole: column.semanticRole,
          })),
        },
      },
      include: {
        columns: true,
      },
    });

    return NextResponse.json(
      {
        message: "Dataset enviado com sucesso.",
        datasetId: dataset.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no upload do dataset:", error);

    return NextResponse.json(
      {
        message: error instanceof Error
          ? error.message
          : "Erro interno ao processar upload.",
      },
      { status: 500 }
    );
  }
}