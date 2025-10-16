import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    console.log("📥 Recebendo dados...");
    const formData = await req.formData();

    const files = formData.getAll("files");

    const jobData = formData.get("job");

    if (!files || files.length === 0 || !jobData) {
      return NextResponse.json(
        { error: "Arquivos ou dados da vaga ausentes." },
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API Gemini não configurada." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Converte todos os arquivos para base64
    const candidatesData = await Promise.all(
      files.map(async (file, idx) => {
        const buffer = Buffer.from(await file.arrayBuffer()).toString("base64");
        return {
          fileBase64: buffer,
          index: idx + 1,
          filename: file.name,
        };
      })
    );

    // Criação dinâmica do prompt
    const prompt = `
Você é um analista de recrutamento experiente. Sua missão é comparar currículos de candidatos para uma vaga específica e determinar **qual é o melhor candidato**, com justificativas técnicas.

---

📄 **Vaga em Análise**
- Título: ${job.title}
- Descrição: ${job.description}

---

⚙️ **Sua Tarefa**
1. Avalie individualmente cada currículo (em PDF).
2. Compare-os entre si com base nos critérios abaixo.
3. Gere um relatório com:
   - Resumo da análise de cada candidato (com pontuação de 0 a 100).
   - Comparativo em formato de tabela.
   - Veredito final: o melhor candidato com **justificativa objetiva**.

---

📊 **Critérios para Avaliação**

| Critério                        | Peso | Descrição                                  |
|--------------------------------|------|--------------------------------------------|
| Experiência Profissional       | 25%  | Relevância e senioridade                   |
| Conhecimentos Técnicos         | 25%  | Ferramentas, linguagens, tecnologias       |
| Soft Skills                    | 15%  | Comunicação, liderança, resolução de conflitos |
| Formação Acadêmica             | 10%  | Nível e relevância da formação             |
| Alinhamento com a Vaga         | 15%  | Aderência à descrição e responsabilidades  |
| Clareza e Apresentação do CV   | 10%  | Organização, objetividade, estética        |

---

📘 **Formato da Resposta Esperada**

## 🏆 Melhor candidato(a)

O melhor candidato é: **Candidato X**  
Justificativa objetiva: ...  
Recomendações para a empresa: ...

## 🧑‍💻 Avaliação Individual

### Candidato 1 (ex: ${candidatesData[0].filename})
- Pontuação: XX/100
- Destaques:
  - ...
- Fragilidades:
  - ...

### Candidato 2 (ex: ${candidatesData[1]?.filename || "N/A"})
...

## 📊 Comparativo Resumido

| Candidato     | Pontuação | Melhor Critério     | Pior Critério       |
|---------------|-----------|----------------------|----------------------|
| Candidato 1   | 78        | Técnicos             | Soft Skills          |
| Candidato 2   | 85        | Experiência          | Formação             |

⚠️ Evite repetições, floreios ou elogios vazios. Seja direto, técnico e objetivo. A resposta será usada por recrutadores profissionais.
`;

    // Criação do conteúdo da requisição com os PDFs embutidos
    const requestParts = [
      {
        role: "user",
        parts: [
          { text: prompt },
          ...candidatesData.map((c) => ({
            inlineData: {
              mimeType: "application/pdf",
              data: c.fileBase64,
            },
          })),
        ],
      },
    ];

    const result = await model.generateContent({
      contents: requestParts,
    });

    const output = await result.response.text();

    return NextResponse.json({ output }, { status: 200 });
  } catch (error) {
    console.error("❌ Erro ao processar análise:", error);
    return NextResponse.json(
      { error: "Erro ao processar a análise comparativa." },
      { status: 500 }
    );
  }
}
