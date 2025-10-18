import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    try {
        console.log("Recebendo requisição de upload...");
        const formData = await req.formData();
        const file = formData.get("file");
        const jobData = formData.get("job");

        if (!file) {
            console.error("Erro: Nenhum arquivo foi enviado.");
            return NextResponse.json(
                { error: "Arquivo não encontrado" },
                { status: 400 }
            );
        }

        if (!jobData) {
            return NextResponse.json(
                { error: "Dados da vaga ausentes." },
                { status: 400 }
            );
        }

        const job = JSON.parse(jobData);
        if (!job.title || !job.description) {
            return NextResponse.json(
                { error: "Informações da vaga incompletas." },
                { status: 400 }
            );
        }

        console.log("Arquivo recebido. Convertendo para Base64...");
        const arrayBuffer = await file.arrayBuffer();
        const base64File = Buffer.from(arrayBuffer).toString("base64");

        console.log("Arquivo convertido com sucesso.");

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Erro: API Key do Gemini não configurada.");
            return NextResponse.json(
                { error: "API Key do Gemini não configurada" },
                { status: 500 }
            );
        }

        console.log(
            "Chave da API do Gemini verificada. Enviando solicitação para análise..."
        );
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
Você é um especialista sênior em Recrutamento e Seleção (Tech Recruiter) com vasta experiência em desenvolvimento de software. Sua tarefa é analisar um currículo e uma descrição de vaga para criar um quiz de entrevista simulada.

**Contexto:**
- **Vaga:** ${job.title} (${job.jobLevel})
- **Descrição da Vaga:** ${job.description}

**Sua Tarefa:**
Crie um quiz de 10 a 12 perguntas que avaliem a aderência do candidato (baseado no currículo) à vaga (baseada na descrição).

**Regras para as Perguntas:**
1.  **Cross-Reference:** As perguntas DEVEM cruzar informações. Elas devem ser sobre como a "Experiência do Currículo" se aplica aos "Requisitos da Vaga".
    -   *Exemplo Ruim (Genérico):* "O que é React?"
    -   *Exemplo Bom (Específico):* "Vimos no seu currículo que você usou Redux no Projeto X. Para esta vaga, lidamos com gerenciamento de estado complexo em tempo real. Qual alternativa melhor descreve como você usaria Redux (ou outra ferramenta) para otimizar a performance nesse cenário?"
2.  **Tipos de Pergunta:** Gere um mix de:
    -   **Técnicas (Hard Skills):** Sobre tecnologias, arquiteturas ou metodologias listadas em ambos os documentos.
    -   **Comportamentais (Soft Skills):** Cenários baseados nos desafios da vaga (ex: "A vaga exige colaboração com PMs. Como você lidaria com...").
    -   **Situacionais:** "No seu currículo, você menciona [Projeto Y]. Qual foi o maior desafio técnico que você enfrentou e como o resolveu?"
3.  **Alternativas:** Crie de 3 a 4 alternativas para cada pergunta.
    -   As alternativas devem ser plausíveis, mas apenas uma deve ser a "ideal" ou "mais correta" no contexto da vaga.
4.  **Índice Correto:** Você DEVE fornecer o índice da resposta correta (começando em 0). Isso é crucial para a avaliação.

**Formato de Saída OBRIGATÓRIO:**
A sua resposta deve ser APENAS um objeto JSON válido, sem nenhum texto antes ou depois (sem markdown, sem "aqui está o json:").

**Estrutura JSON Esperada:**
[
  {
    "questionText": "Texto completo da pergunta 1...",
    "alternatives": [
      { "text": "Texto da alternativa A" },
      { "text": "Texto da alternativa B" },
      { "text": "Texto da alternativa C" }
    ],
    "correctAnswerIndex": 1 // O índice (0, 1 ou 2) da alternativa correta
  },
  {
    "questionText": "Texto completo da pergunta 2...",
    "alternatives": [
      { "text": "Texto da alternativa A" },
      { "text": "Texto da alternativa B" },
      { "text": "Texto da alternativa C" },
      { "text": "Texto da alternativa D" }
    ],
    "correctAnswerIndex": 0
  }
]
`;

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: "application/pdf",
                                data: base64File,
                            },
                        },
                    ],
                },
            ],
        });

        console.log("Resposta recebida do Gemini. Processando...");

        const output = await result.response.text();

        console.log("Resumo gerado com sucesso.");

        return NextResponse.json({ output }, { status: 200 });
    } catch (error) {
        console.error("Erro ao processar o arquivo:", error);
        return NextResponse.json(
            { error: "Erro ao processar o arquivo" },
            { status: 500 }
        );
    }
}
