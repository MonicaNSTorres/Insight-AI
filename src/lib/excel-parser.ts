import * as XLSX from "xlsx";

export type ParsedDataset = {
  rows: Record<string, unknown>[];
  headers: string[];
};

export function parseExcelBuffer(buffer: Buffer): ParsedDataset {
  const workbook = XLSX.read(buffer, { type: "buffer" });

  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error("Nenhuma aba encontrada no arquivo Excel.");
  }

  const worksheet = workbook.Sheets[firstSheetName];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: "",
    raw: false,
  });

  const headers =
    rows.length > 0
      ? Object.keys(rows[0]).map((header) => header.trim())
      : [];

  return {
    rows,
    headers,
  };
}