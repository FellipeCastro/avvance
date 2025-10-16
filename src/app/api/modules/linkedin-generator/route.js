import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo não encontrado" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64File = Buffer.from(arrayBuffer).toString("base64");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key do Gemini não configurada" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Você é um consultor de carreira sênior, com vasta experiência em construção de perfis profissionais para o LinkedIn. Sua tarefa é transformar o conteúdo de um currículo em um **perfil de LinkedIn extremamente atrativo, completo, detalhado e alinhado com as exigências do mercado de trabalho atual**.

Se alguma informação não estiver no currículo, simplesmente ignore a seção e não inclua nenhuma informação extra.

Com base no currículo em anexo, crie um perfil de LinkedIn estruturado com todas as seções relevantes, focado em apresentar o candidato da melhor forma para oportunidades de alto nível.

O conteúdo deve ser bem escrito, **agradável de ler**, com tom profissional, atraente, moderno e orientado a resultados. Use linguagem clara, voz (
em **primeira pessoa**, destaque conquistas, valorize experiências e torne o perfil atrativo para recrutadores.

🧩 FORMATO DE SAÍDA ESPERADO:

🔹 ## 👤 Nome do Candidato

🔹 ## Sobre (Resumo do Perfil)  
[Resumo com 5 a 10 linhas. Destaque trajetória, áreas de especialização, competências centrais, estilo de trabalho, diferenciais e ambições profissionais.]

🔹 ## Experiência  
(Para cada experiência profissional, use o seguinte modelo)

**[Cargo]**  
[Nome da Empresa] – [Cidade/Estado ou Remoto]  
[MM/AAAA] – [MM/AAAA ou Atualmente]  
Descrição:  
- [Responsabilidade ou conquista 1]  
- [Responsabilidade ou conquista 2]  
- [Projetos relevantes, tecnologias utilizadas ou equipes lideradas, se aplicável]

🔹 ## Formação Acadêmica

**[Curso]**  
[Instituição] – [Cidade/Estado]  
[MM/AAAA] – [MM/AAAA ou Concluído]

🔹 ## Certificações  
- [Nome da Certificação] – [Instituição] – [Ano]  
- [Outras certificações relevantes]

🔹 ## Competências e Habilidades  
[Liste habilidades técnicas e comportamentais: ferramentas, idiomas, metodologias, soft skills com foco no mercado de trabalho atual]

🔹 ## Idiomas  
- [Idioma 1] – [Nível de fluência]  
- [Idioma 2, se houver]

🔹 ## Cursos Complementares / Especializações  
- [Curso 1] – [Instituição] – [Carga horária ou ano]  
- [Curso 2, se houver]

⚠️ Importante: gere conteúdo atrativo, estratégico e com forte apelo profissional. Não apenas converta dados — transforme o currículo em um perfil poderoso, alinhado com o estilo do LinkedIn e com alta aderência a boas oportunidades.

⚠️ Importante: entregue o perfil pronto para copiar e colar no LinkedIn, sem instruções ou colchetes no texto final.
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
    console.error("Erro ao processar o currículo:", error);
    return NextResponse.json(
      { error: "Erro ao gerar perfil do LinkedIn" },
      { status: 500 }
    );
  }
}
