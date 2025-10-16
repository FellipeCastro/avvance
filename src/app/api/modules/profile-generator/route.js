import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const body = await req.json();
    const { job } = body;

    if (!job || !job.title || !job.description) {
      return NextResponse.json(
        { message: "Dados incompletos da vaga." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "Chave da API Gemini não configurada." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Você é um profissional especialista em Recursos Humanos, com sólida experiência em análise de perfis, recrutamento e construção de descrições realistas de candidatos para fins comparativos em processos seletivos.

Sua tarefa é gerar um **perfil aderente e bem estruturado**, com base nas informações da vaga fornecida a seguir. O objetivo é criar um **modelo de referência confiável**, que represente com clareza e realismo **o tipo de candidato compatível e plenamente qualificado** para ocupar essa posição — sem exageros, idealizações ou descrições genéricas.

Esse perfil será usado por recrutadores para fins de benchmark em entrevistas e triagem de currículos.

---

🔹 TÍTULO DA VAGA:
${job.title}

🔹 DESCRIÇÃO DA VAGA:
${job.description}

---

📄 ESTRUTURA DO PERFIL REFERENCIAL:

👤 **Resumo Profissional**  
Descreva, em texto corrido de 5 a 8 linhas, a trajetória de um candidato plenamente qualificado para essa vaga. Inclua informações sobre áreas de atuação, tempo de experiência, tipos de empresas por onde passou, cargos anteriores, competências técnicas e comportamentais adquiridas, estilo de trabalho e motivações profissionais. Foque em realismo e aderência à vaga, sem superlativos ou adjetivos exagerados.

🎓 **Formação Acadêmica**  
Liste cursos compatíveis com a vaga, incluindo nível de formação (técnico, graduação, pós), áreas de conhecimento relevantes e eventuais especializações que estejam alinhadas com as exigências da posição.

💼 **Experiências Profissionais Relevantes**  
Cite de 2 a 3 experiências profissionais anteriores que demonstrem a compatibilidade com a vaga. Para cada uma, inclua:  
- Cargo ocupado  
- Tipo de empresa (porte, segmento)  
- Tempo médio na função  
- Principais atribuições e responsabilidades, com foco nas que são exigidas na vaga  
Evite inventar projetos grandiosos; seja realista e aplicável.

🛠️ **Conhecimentos Técnicos / Ferramentas / Métodos**  
Liste as ferramentas, sistemas, técnicas e metodologias que o profissional precisa dominar para atender bem às exigências da vaga. Seja preciso e conciso.

🤝 **Competências Comportamentais (Soft Skills)**  
Liste e explique de forma objetiva as características comportamentais que são necessárias para o bom desempenho nessa função específica. Evite frases genéricas.

🗣️ **Idiomas e Comunicação**  
Informe os idiomas requeridos, o nível esperado de fluência e os contextos de uso no dia a dia (leitura de documentos, reuniões, comunicação com clientes, etc.).

🏅 **Diferenciais Relevantes (opcional)**  
Inclua apenas os diferenciais que realmente agregam valor à vaga — certificações, experiências específicas, vivência em contexto internacional, ou conhecimento técnico complementar. Somente mencione o que for realista e aplicável ao tipo de vaga.

📍 **Localização e Disponibilidade**  
Descreva o cenário ideal de disponibilidade do candidato, conforme o modelo de trabalho indicado (remoto, híbrido ou presencial), além de possíveis exigências de horário, deslocamento ou mudança.

---

⚠️ **Importante**: Este perfil deve representar um candidato compatível e pronto para ocupar a vaga com segurança. Não use linguagem idealizada ou excessivamente otimista. Foque na coerência com a vaga, consistência técnica e adequação comportamental. Este conteúdo será utilizado por profissionais de RH como referência objetiva.

`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const output = await result.response.text();

    return NextResponse.json({ response: output }, { status: 200 });
  } catch (error) {
    console.error("Erro na geração de perfil:", error);
    return NextResponse.json(
      { message: "Erro ao gerar perfil." },
      { status: 500 }
    );
  }
}
