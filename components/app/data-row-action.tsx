"use client";

import Link from "next/link";
import { ArrowRight, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DatasetRowActionsProps = {
  datasetId: string;
  datasetName: string;
};

export function DatasetRowActions({
  datasetId,
  datasetName,
}: DatasetRowActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o dataset "${datasetName}"?`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/datasets/${datasetId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Erro ao excluir dataset.");
      }

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o dataset."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Link
        href={`/app/dataset/${datasetId}`}
        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
      >
        Abrir
        <ArrowRight size={16} />
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        title="Excluir dataset"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}