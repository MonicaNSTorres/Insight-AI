import Papa from "papaparse";

export type ParsedDataset = {
    rows: Record<string, unknown>[];
    headers: string[];
};

export function parseCsvBuffer(buffer: Buffer): ParsedDataset {
    const csvText = buffer.toString("utf-8");

    const result = Papa.parse<Record<string, unknown>>(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        transformHeader: (header) => header.trim(),
    });

    if (result.errors?.length) {
        const firstError = result.errors[0];
        throw new Error(`Erro ao processar CSV: ${firstError.message}`);
    }

    const rows = (result.data || []).filter((row) =>
        Object.values(row || {}).some(
            (value) => value !== null && value !== undefined && String(value).trim() !== ""
        )
    );

    const headers =
        result.meta.fields
            ?.map((field, index) => {
                const trimmed = field.trim();
                return trimmed || `coluna_${index + 1}`;
            }) || [];

    return {
        rows,
        headers,
    };
}