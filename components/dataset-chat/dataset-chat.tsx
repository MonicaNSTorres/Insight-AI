"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SendHorizonal, Sparkles } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  meta?: {
    confidence?: "high" | "medium" | "low";
    usedColumns?: string[];
    followUps?: string[];
  };
};

const defaultWelcomeMessage: ChatMessage = {
  id: "welcome-message",
  role: "assistant",
  content:
    "Faça perguntas sobre seus dados, como: 'Top 5 clientes por valor' ou 'Qual mês teve maior crescimento?'",
};

function ChatHistorySkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex justify-start">
        <div className="w-[78%] rounded-[22px] border border-white/6 bg-[#171A22] px-5 py-4">
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-700" />
          <div className="mt-2 h-4 w-2/4 animate-pulse rounded-full bg-slate-700" />

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="h-8 w-36 animate-pulse rounded-full bg-slate-800" />
            <div className="h-8 w-44 animate-pulse rounded-full bg-slate-800" />
            <div className="h-8 w-40 animate-pulse rounded-full bg-slate-800" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="w-[55%] rounded-[22px] bg-[#05A36B] px-5 py-4">
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-emerald-300/30" />
        </div>
      </div>

      <div className="flex justify-start">
        <div className="w-[72%] rounded-[22px] border border-white/6 bg-[#171A22] px-5 py-4">
          <div className="h-4 w-full animate-pulse rounded-full bg-slate-700" />
          <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-slate-700" />
          <div className="mt-2 h-4 w-3/5 animate-pulse rounded-full bg-slate-700" />
        </div>
      </div>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[82%] rounded-[22px] border border-white/6 bg-[#171A22] px-5 py-4 text-sm text-slate-300">
        <div className="flex items-center gap-3">
          <Sparkles size={16} className="text-blue-400" />

          <div className="flex items-center gap-2">
            <span>IA está analisando seus dados</span>

            <div className="flex items-center gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DatasetChat({ datasetId }: { datasetId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const quickSuggestions = useMemo(
    () => [
      "Top 5 registros por valor",
      "Qual categoria teve maior valor?",
      "Qual mês teve maior crescimento?",
    ],
    []
  );

  useEffect(() => {
    let ignore = false;

    async function loadHistory() {
      try {
        setLoadingHistory(true);

        const res = await fetch(`/api/datasets/${datasetId}/chat/history`);
        const data = await res.json();

        if (ignore) return;

        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages([defaultWelcomeMessage, ...data.messages]);
        } else {
          setMessages([defaultWelcomeMessage]);
        }
      } catch {
        if (!ignore) {
          setMessages([defaultWelcomeMessage]);
        }
      } finally {
        if (!ignore) {
          setLoadingHistory(false);
        }
      }
    }

    loadHistory();

    return () => {
      ignore = true;
    };
  }, [datasetId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(customQuestion?: string) {
    const question = (customQuestion ?? input).trim();
    if (!question || loading || loadingHistory) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/datasets/${datasetId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer ?? "Não consegui responder.",
        meta: {
          confidence: data.confidence,
          usedColumns: data.usedColumns,
          followUps: data.followUpQuestions,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Ocorreu um erro ao consultar a IA.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-[28px] bg-[#05070C] p-5 shadow-[0_24px_60px_rgba(2,6,23,0.28)]">
      <div className="max-h-155 space-y-5 overflow-y-auto pr-2">
        {loadingHistory ? (
          <ChatHistorySkeleton />
        ) : (
          <>
            {messages.map((msg, index) => {
              const isWelcome = index === 0 && msg.id === "welcome-message";

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-[22px] px-5 py-4 text-sm leading-7 shadow-sm ${
                      msg.role === "user"
                        ? "bg-[#05A36B] text-white"
                        : "border border-white/6 bg-[#171A22] text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {isWelcome ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {quickSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => sendMessage(suggestion)}
                            className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-xs text-slate-200 transition hover:bg-white/5"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {msg.role === "assistant" && msg.meta?.usedColumns?.length ? (
                      <div className="mt-4 text-xs text-slate-400">
                        Colunas usadas: {msg.meta.usedColumns.join(", ")}
                      </div>
                    ) : null}

                    {msg.role === "assistant" && msg.meta?.followUps?.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {msg.meta.followUps.map((q) => (
                          <button
                            key={q}
                            onClick={() => sendMessage(q)}
                            className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-xs text-slate-200 transition hover:bg-white/5"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {loading ? <ThinkingBubble /> : null}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-[24px] bg-transparent">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Pergunte algo sobre o dataset..."
          disabled={loadingHistory}
          className="h-14 flex-1 rounded-[18px] border border-white/6 bg-[#171A22] px-5 text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-70"
        />

        <button
          onClick={() => sendMessage()}
          disabled={loading || loadingHistory}
          className="flex h-14 items-center justify-center rounded-[18px] bg-[#2F66F6] px-5 text-white transition hover:bg-[#2458e6] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SendHorizonal size={18} />
        </button>
      </div>
    </div>
  );
}