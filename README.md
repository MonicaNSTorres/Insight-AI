# 🚀 InsightAI
Plataforma de Business Intelligence com Inteligência Artificial

<p align="center">
  <img src="./public/icon.png" width="140" />
</p>

Transforme dados brutos em insights acionáveis com dashboards automáticos e IA

---

## 💡 Sobre o projeto

O InsightAI é uma plataforma SaaS de Business Intelligence que utiliza Inteligência Artificial para transformar:

📄 planilhas → 📊 dashboards → 🧠 insights → 🤖 respostas inteligentes

O sistema permite que qualquer pessoa, mesmo sem conhecimento técnico, consiga analisar dados de forma profissional.

---

## 🎯 Objetivo do MVP

O MVP foi projetado para validar o conceito central:

Transformar dados brutos em análises acionáveis automaticamente

Principais entregas:

- Upload de datasets (CSV e Excel)
- Detecção automática de estrutura
- Geração automática de dashboards
- KPIs inteligentes
- Insights automáticos
- Chat com IA sobre os dados
- Histórico de perguntas
- Interface premium estilo SaaS

---

## 🔥 Diferencial do produto

- Zero necessidade de conhecimento técnico
- Análise automática de dados
- IA interpretando perguntas em linguagem natural
- Experiência similar a ferramentas como Power BI e Tableau

---

## 🧠 Como funciona

Upload de dados
↓
Detecção automática de estrutura
↓
Geração de dashboard
↓
Insights automáticos
↓
Chat com IA sobre os dados

---

## 🧑‍💼 Público-alvo

- Pequenas e médias empresas
- Times comerciais
- Gestores financeiros
- Clínicas e consultórios
- Startups
- Analistas de negócio

---

## 🛠️ Arquitetura tecnológica

Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- ShadCN UI
- TanStack Table
- Recharts

Backend:
- Next.js API Routes
- Prisma ORM
- PostgreSQL

Processamento:
- PapaParse (CSV)
- XLSX (Excel)

IA:
- OpenAI API
- Prompts estruturados
- Zod

---

## 📂 Estrutura do projeto

├── app/
├── components/
├── services/
├── lib/
├── hooks/
├── types/
├── prisma/
├── public/
└── README.md

---

## 📊 Estrutura das páginas

/ → Landing Page  
/login → Login  
/register → Cadastro  
/app → Dashboard principal  
/app/new → Upload de dataset  
/app/dataset/[id] → Dashboard completo  
/app/dataset/[id]/history → Histórico de chat  
/app/settings → Configurações  

---

## 📈 Funcionalidades do Dashboard

KPIs automáticos:
- Valor total
- Média
- Melhor categoria
- Crescimento

Gráficos:
- Evolução temporal
- Ranking
- Distribuição
- Top categorias

Insights automáticos:
- A região Sudeste representa 42% do total
- Março foi o melhor mês
- Produto X cresceu 18%

Tabela:
- Filtros
- Ordenação
- Paginação
- Busca

Chat com IA:
- Qual produto vendeu mais?
- Qual região teve melhor resultado?
- Compare janeiro com fevereiro
- Mostre os top 5 vendedores

---

## 🧠 Resposta estruturada da IA

{
  "intent": "top_n",
  "metric": "valor",
  "dimension": "produto",
  "n": 5,
  "chart_type": "bar"
}

---

## 🗄️ Modelagem de dados

- users
- datasets
- dataset_columns
- insights
- conversations

---

## 🔌 API Endpoints

Auth:
POST /api/auth/register  
POST /api/auth/login  

Datasets:
POST /api/datasets/upload  
GET /api/datasets  
GET /api/datasets/:id  

Chat:
POST /api/datasets/:id/chat  
GET /api/datasets/:id/chat-history  

Export:
GET /api/datasets/:id/export  

---

## ⚙️ Como rodar o projeto

git clone https://github.com/seu-usuario/insight-ai.git  
cd insight-ai  
npm install  
npm run dev  

---

## 🔄 Fluxo de desenvolvimento

dev → desenvolvimento  
main → produção  

---

## 🧠 Roadmap

- Autenticação ✔️  
- Upload de dados ✔️  
- Geração de dashboard ✔️  
- Insights automáticos ✔️  
- Chat com IA ✔️  
- Exportação de relatórios 🚧  
- Refinamento UI 🚧  

---

## 🚀 Evolução futura

O InsightAI evoluirá para um Data Copilot:

- Por que minhas vendas caíram?
- Qual produto devo priorizar?
- Previsão de faturamento

Tecnologias futuras:
- LangChain
- Vector DB
- Redis
- Docker + Kubernetes
- Machine Learning

---

## 👩‍💻 Autora

Mônica Torres  
Desenvolvedora Fullstack  
Especialista em desenvolvimento web  
