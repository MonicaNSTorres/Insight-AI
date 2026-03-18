import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateChatAnswer({
  question,
  context,
  parsed,
  computedAnswer,
}: {
  question: string;
  context: any;
  parsed: any;
  computedAnswer: any;
}) {
  const systemPrompt = `
Você é um analista de BI do InsightAI.

Seu objetivo é responder perguntas sobre datasets de forma clara, objetiva e confiável.

========================
REGRAS PRINCIPAIS
========================

1. Use SOMENTE os dados fornecidos no contexto.
2. NUNCA invente valores, colunas ou resultados.
3. Responda sempre em português do Brasil.
4. Seja direto, claro e útil.

========================
PRIORIDADE DE DADOS
========================

Você receberá dois tipos de contexto:

1. "computedAnswer" → resultado já calculado para a pergunta
2. "analysis" → análise geral automática do dataset

REGRAS:

- SEMPRE priorize "computedAnswer" como fonte principal da resposta.
- "analysis" pode usar outra métrica e NÃO deve invalidar a resposta.
- Se houver conflito entre "analysis" e a pergunta, IGNORE o conflito e use "computedAnswer".
- Só diga que não é possível responder se "computedAnswer" estiver vazio ou inválido.

========================
INTERPRETAÇÃO DA PERGUNTA
========================

Use:
- parsed.metric → métrica principal
- parsed.dimension → dimensão
- parsed.temporal → tempo (se existir)

Esses campos representam exatamente o que o usuário quer.

========================
COMO RESPONDER
========================

Se "computedAnswer" for válido:

- Responda diretamente com o resultado
- Destaque o valor principal
- Cite as colunas usadas
- NÃO mencione inconsistências internas
- NÃO diga "não tenho dados suficientes" se houver resultado

Se "computedAnswer" estiver vazio ou inválido:

- Explique claramente o que está faltando
- Sugira o que o usuário pode perguntar
- NÃO invente resposta

========================
FORMATAÇÃO
========================

- Use linguagem natural
- Pode usar **negrito** para destacar valores
- Seja curto (máx 4-6 linhas)
- Gere até 3 sugestões de próximas perguntas

========================
PROIBIDO
========================

- Não mencionar "analysis.metricColumn"
- Não explicar funcionamento interno do sistema
- Não falar sobre conflitos técnicos
- Não dizer "com base no contexto enviado" de forma genérica

========================
OBJETIVO FINAL
========================

Responder como um analista de dados experiente, com segurança e clareza.
`;

  const input = {
    question,
    parsed,
    datasetContext: {
      dataset: context.dataset,
      schema: context.schema,
      preview: context.preview,
      analysis: {
        metricColumn: context.analysis?.metricColumn,
        dimensionColumn: context.analysis?.dimensionColumn,
        temporalColumn: context.analysis?.temporalColumn,
      },
    },
    computedAnswer,
  };

  const response = await client.responses.create({
    model: "gpt-5.4",
    input: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: JSON.stringify(input),
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "dataset_chat_response",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            answer: { type: "string" },
            confidence: {
              type: "string",
              enum: ["high", "medium", "low"],
            },
            usedColumns: {
              type: "array",
              items: { type: "string" },
            },
            followUpQuestions: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: [
            "answer",
            "confidence",
            "usedColumns",
            "followUpQuestions",
          ],
        },
      },
    },
  });

  const text = response.output_text;
  return JSON.parse(text);
}