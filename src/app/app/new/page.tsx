"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Bell, UserCircle2 } from "lucide-react";
import { AppHeader } from "@/components/app/app-header";

export default function NewDatasetPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChooseFile() {
    inputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setError("");
    setMessage("");
  }

  function handleUpload() {
    if (!selectedFile) {
      setError("Selecione um arquivo antes de enviar.");
      return;
    }

    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    startTransition(async () => {
      try {
        const response = await fetch("/api/datasets/upload", {
          method: "POST",
          body: formData,
        });

        const contentType = response.headers.get("content-type") || "";
        const rawText = await response.text();

        let data: any = null;

        if (contentType.includes("application/json")) {
          data = JSON.parse(rawText);
        }

        if (!response.ok) {
          setError(data?.message || rawText || "Não foi possível enviar o arquivo.");
          return;
        }

        setMessage("Upload concluído com sucesso.");
        router.push(`/app/dataset/${data.datasetId}`);
      } catch {
        setError("Erro inesperado ao enviar o arquivo.");
      }
    });
  }

  return (
    <>
      <AppHeader
        title="Upload de Dataset"
        description="Envie Conjunto de Dados"
        action={
          <div className="flex items-center gap-3 text-slate-400">
            <Mail size={16} />
            <Bell size={16} />
            <UserCircle2 size={28} />
          </div>
        }
      />

      <section className="mx-auto max-w-7xl">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-bold text-[#27346b]">
            Envie Conjunto de Dados
          </h2>

          <div className="mt-5 flex gap-3 text-sm">
            {["CSV", "Excel", "Google Sheets"].map((tab, index) => (
              <button
                key={tab}
                className={`rounded-xl px-4 py-2 ${
                  index === 0
                    ? "bg-blue-50 text-blue-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={handleChooseFile}
              className="mx-auto block text-lg font-medium text-slate-600"
            >
              Arraste o arquivo aqui
              <br />
              ou clique para selecionar
            </button>
          </div>

          {selectedFile ? (
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div>
                <p className="font-medium text-slate-900">{selectedFile.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </p>
              </div>

              <button
                type="button"
                onClick={handleUpload}
                disabled={isPending}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {isPending ? "Enviando..." : "Enviar"}
              </button>
            </div>
          ) : null}

          <p className="mt-4 text-sm text-slate-400">Suporte: CSV, XLSX até 50MB</p>

          {error ? (
            <p className="mt-4 text-sm font-medium text-red-500">{error}</p>
          ) : null}

          {message ? (
            <p className="mt-4 text-sm font-medium text-emerald-600">{message}</p>
          ) : null}
        </div>
      </section>
    </>
  );
}