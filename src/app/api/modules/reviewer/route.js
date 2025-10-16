import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    console.log("Recebendo requisição de upload...");
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      console.error("Erro: Nenhum arquivo foi enviado.");
      return NextResponse.json(
        { error: "Arquivo não encontrado" },
        { status: 400 }
      );
    }

    console.log("Arquivo recebido. Convertendo para Base64...");
    const arrayBuffer = await file.arrayBuffer();
    const base64File = Buffer.from(arrayBuffer).toString("base64");

    console.log("Arquivo convertido com sucesso.");

    // Configurar a API do Gemini
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
Você é um especialista em Recrutamento Estratégico e Outplacement com 15+ anos de experiência em análise de currículos para posições de alto nível. Sua tarefa é realizar uma avaliação detalhada do currículo fornecido, aplicando as melhores práticas de mercado e oferecer insights acionáveis para maximizar a empregabilidade do candidato.

## 🔍 Diretrizes de Análise (Método STAR-R)
1. **Contexto Mercadológico**: Avalie o currículo considerando as demandas atuais do mercado para a área do candidato
2. **Diferenciação Competitiva**: Identifique elementos únicos que possam posicionar o candidato à frente da concorrência
3. **Estrutura ATS-Friendly**: Verifique a otimização para sistemas de rastreamento de candidatos
4. **Narrativa Profissional**: Analise a coerência e progressão da carreira
5. **Evidência de Resultados**: Avalie a quantificação de conquistas e impacto

## 📊 Saída Esperada (Estrutura Analítica)

### 🎯 Avaliação Estratégica
- **Alinhamento Mercadológico**: [0-100] - Quão bem o perfil atende às demandas atuais do setor?
- **Potencial de Destaque**: [0-100] - Capacidade de se diferenciar em processos seletivos
- **Prontidão para Contratação**: [0-100] - Maturidade profissional demonstrada

### 🔬 Análise por Componentes Críticos (Matriz 5D)
| Dimensão           | Critério                  | Peso (%) | Avaliação (1-5 ⭐) | Insights                                                                 |
|---------------------|---------------------------|----------|-----------------|--------------------------------------------------------------------------|
| **Dados Estratégicos** | Contato/LinkedIn/Portfólio | 10%      | [ ]             | [Análise da presença profissional]                                      |
| **Trajetória**         | Progressão de Carreira     | 25%      | [ ]             | [Padrão de crescimento, saltos profissionais]                           |
| **Resultados**         | Métricas e Impacto         | 30%      | [ ]             | [Quantificação de conquistas, ROI gerado]                               |
| **Competências**       | Hard & Soft Skills         | 20%      | [ ]             | [Balanceamento técnico-comportamental, gaps]                            |
| **Diferenciais**       | Valor Único                | 15%      | [ ]             | [Elementos raros no mercado que agregam valor]                          |

### 📌 Insights Acionáveis
1. **Otimização Imediata** (ajustes que podem ser feitos em <2h):
   - [Lista de 3-5 melhorias rápidas com maior ROI]

2. **Desenvolvimento Estratégico** (para médio prazo):
   - [Recomendações de capacitação ou ajustes estruturais]

3. **Posicionamento de Mercado**:
   - [Melhores nichos/posições onde o candidato teria vantagem competitiva]

### 🚀 Recomendações Específicas por Seção
**Experiência Profissional**:
- [Padrão OARR (Oportunidade-Ação-Resultado-Relevância) para reformulação]
- [Sugestões de métricas específicas para incluir]

**Competências**:
- [Priorização baseada em benchmarks de mercado]
- [Reformulação para alinhamento com palavras-chave do setor]

**Diferenciais**:
- [Estratégias para destacar elementos únicos]
- [Recomendações para fortalecer o perfil]

## ⚠️ Requisitos de Qualidade
- Evitar generalidades - cada ponto deve ser específico ao currículo analisado
- Manter tom profissional mas acessível
- Fornecer exemplos concretos de reformulação quando sugerir mudanças
- Priorizar insights baseados em dados e tendências de recrutamento
- Incluir referências a benchmarks setoriais quando aplicável

## 📈 Métrica de Sucesso
A análise será considerada eficaz se:
1. Proporcionar clareza sobre pontos fortes estratégicos
2. Identificar oportunidades não óbvias de melhoria
3. Oferecer um plano acionável com priorização clara
4. Facilitar a tomada de decisão por recrutadores
5. Aumentar significativamente a visibilidade do perfil em sistemas ATS
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

    // const id = crypto.randomUUID();
    return NextResponse.json({ output }, { status: 200 });
    // return NextResponse.json({ id, output }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar o arquivo:", error);
    return NextResponse.json(
      { error: "Erro ao processar o arquivo" },
      { status: 500 }
    );
  }
}
