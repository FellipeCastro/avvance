import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
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

    const arrayBuffer = await file.arrayBuffer();
    const base64File = Buffer.from(arrayBuffer).toString("base64");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Erro: API Key do Gemini não configurada.");
      return NextResponse.json(
        { error: "API Key do Gemini não configurada" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Você é um analista sênior de Recrutamento e Seleção, especializado na avaliação de currículos frente a vagas específicas. Sua tarefa é analisar o currículo fornecido e gerar uma **avaliação estruturada e objetiva da aderência do candidato à vaga descrita abaixo**.

A resposta deve ser baseada apenas nas informações concretas extraídas do currículo, comparando com as exigências da vaga. Evite idealizações ou julgamentos subjetivos.

---

🔹 **TÍTULO DA VAGA**:
${job.title}

🔹 **NÍVEL DA VAGA**:
${job.jobLevel}

🔹 **DESCRIÇÃO DA VAGA**:
${job.description}

---

📄 **ESTRUTURA DA RESPOSTA ESPERADA**:

## 🎯 **Aderência Geral**  
Dê a avaliação sobre o quão aderente o candidato é à vaga (em uma escala de 0 a 100) e justifique com base em critérios objetivos, como: tempo de experiência, conhecimentos técnicos, formação, senioridade, clareza do CV e relação com a descrição da vaga.

## 👤 **Resumo da Aderência Profissional**  
Avalie a trajetória profissional do candidato frente ao que a vaga exige. Destaque similaridades em áreas de atuação, tempo de experiência, tipos de empresas, cargos e responsabilidades compatíveis. Seja direto e realista.

## 🎓 **Formação Acadêmica**  
Comente se o nível e a área de formação do candidato são compatíveis com o perfil desejado para a vaga.

## 💼 **Experiências Profissionais Relevantes**  
Liste de 1 a 2 experiências que tenham relação direta com a descrição da vaga. Descreva se há sintonia com as responsabilidades, setor e nível de senioridade.

## 🛠️ **Conhecimentos Técnicos / Ferramentas**  
Indique quais ferramentas, linguagens, sistemas ou métodos o candidato demonstra conhecer e como isso se relaciona com o que a vaga exige.

## 🤝 **Competências Comportamentais (Soft Skills)**  
Com base no conteúdo textual do currículo, identifique indícios de competências como proatividade, comunicação, adaptabilidade, trabalho em equipe ou liderança — apenas se forem evidentes.

## 🗣️ **Idiomas e Comunicação**  
Avalie o nível de domínio de idiomas, se mencionado, e a clareza da comunicação escrita do candidato.

---

⚠️ **Importante**:  
Evite elogios genéricos ou frases como "excelente candidato". A análise deve ser técnica, realista e útil para recrutadores e profissionais tomarem decisões.
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

    const output = await result.response.text();

    return NextResponse.json({ output }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar o arquivo:", error);
    return NextResponse.json(
      { error: "Erro ao processar o arquivo" },
      { status: 500 }
    );
  }
}
