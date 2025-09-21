import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      console.error("Erro: Nenhum arquivo foi enviado.");
      return NextResponse.json(
        { error: "Arquivo não encontrado" },
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
🎯 Você é um especialista sênior em Recursos Humanos, com forte atuação em Recrutamento, Seleção e Recolocação Profissional. Sua missão é **ler e interpretar o currículo anexado**, extraindo **informações estratégicas e detalhadas** sobre o profissional, **sem emitir julgamentos, notas ou avaliações numéricas**.

Seu parecer deve ajudar profissionais de RH a compreender **quem é o candidato**, seu histórico, posicionamento no mercado, áreas de atuação, potencial de carreira e **faixa salarial estimada**. A resposta deve ser **qualitativa, analítica, estruturada e pronta para ser utilizada em processos de triagem, entrevistas ou consultoria de carreira**.


---

📦 **Formato Esperado da Resposta (Profissional, Direto e Estratégico):**

## 👤 Perfil Profissional do Candidato
- Breve resumo da trajetória profissional, principais áreas de atuação e tipo de profissional apresentado no currículo.
- Destaque para senioridade, setor, escopo de atuação, principais resultados ou responsabilidades recorrentes.

## 🎯 Posicionamento de Carreira
- Análise sobre o direcionamento de carreira evidenciado: foco claro, consistência de trajetória, transições de cargo/setor e o quanto o currículo expressa um objetivo profissional sólido e alinhado ao mercado.

## 💼 Experiência Profissional – Panorama Estratégico
- Descreva os principais segmentos em que o candidato atuou, tipos de empresa (porte, setor), níveis de responsabilidade e funções exercidas.
- Identifique padrões de progressão (ou não), estabilidade e perfil de entrega (tático, operacional, estratégico).

## 🛠 Competências Técnicas e Áreas de Especialização
- Liste as competências técnicas identificáveis no currículo: ferramentas, tecnologias, metodologias ou áreas específicas de domínio.
- Comente sobre o grau de especialização e como essas competências se alinham com as demandas atuais do mercado.

## 💬 Perfil Comportamental Percebido
- A partir do estilo de escrita, das experiências descritas e da organização geral, descreva o tipo de perfil comportamental que o candidato aparenta ter (ex: comunicativo, analítico, executor, líder, resiliente etc.).
- Identifique possíveis soft skills implícitas.

## 🌍 Diferenciais Estratégicos
- Destaque aspectos como: idiomas, experiências internacionais, prêmios, projetos, voluntariado, certificações de impacto, publicações, entre outros pontos que agreguem valor competitivo.

## 🎓 Formação Acadêmica e Educação Continuada
- Liste os cursos formais (graduação, pós etc.) e cursos complementares/certificações relevantes.
- Analise a coerência entre a formação e a atuação profissional.

## 📈 Estimativa de Faixa Salarial Atual
- Com base nas informações do currículo (cargo, setor, localização, senioridade, escopo de atuação), forneça uma **estimativa de faixa salarial mensal em BRL** (valores brutos).
- Especifique os parâmetros utilizados para essa estimativa.

💰 **Estimativa Aproximada:** R$ [xxx - xxx]

## 🔍 Insights Estratégicos para o RH
- O que o RH precisa saber sobre este candidato que **não está explícito**, mas pode ser inferido?
- O que torna esse perfil único, promissor ou adequado para determinadas funções/setores?
- Pontos de atenção para a triagem ou entrevista.

---

🧠 **Instruções Importantes para o Modelo:**
- Não inclua notas, pontuações ou classificações.
- Use linguagem clara, coesa, técnica e orientada à ação.
- A resposta deve parecer que foi feita por um profissional experiente em RH com leitura estratégica de perfis.
        
---
⚠️ Seja COERENTE E REALISTA com as suas conclusões, estamos lidando com o real mercado de trabalho e uma situação séria. NÃO MINTA.

⚠️ Evite textos genéricos e vagos. Não inclua instruções ou colchetes no conteúdo final. A resposta precisa parecer uma análise feita por um analista experiente, clara, coesa e com impacto prático imediato, sem necessidade de considerações adicionais, sua resposta deve ser pronta para um profissional utiliza-la das mais diversas formas no processo de recrutamento e seleção/análise de candidatos.

⚠️ Seu conteúdo deve ser agradável de ler, evite muitas linhas blocadas e me retorne um conteúdo fluido.
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
