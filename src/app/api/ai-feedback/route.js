import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    try {
        console.log("Recebendo requisição de feedback...");

        const { resultData } = await req.json();

        if (!resultData) {
            console.error("Erro: Nenhum resultado foi enviado.");
            return NextResponse.json(
                { error: "Resultado não enviado" },
                { status: 400 }
            );
        }

        console.log("Dados do resultado recebidos:", {
            score: resultData.score,
            totalQuestions: resultData.summary?.totalQuestions,
        });

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Erro: API Key do Gemini não configurada.");
            return NextResponse.json(
                { error: "API Key do Gemini não configurada" },
                { status: 500 }
            );
        }

        console.log("Gerando feedback personalizado...");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Construir o prompt detalhado para análise
        const prompt = `
            Você é um Tech Recruiter sênior especializado em análise de desempenho em entrevistas. Analise os resultados do quiz abaixo e forneça um feedback construtivo e personalizado **EM FORMATO MARKDOWN**.

            **DADOS DO QUIZ:**
            - **Pontuação:** ${resultData.score?.correct || 0}/${
                        resultData.score?.total || 0
                    } (${resultData.score?.percentage || 0}%)
            - **Total de questões:** ${resultData.summary?.totalQuestions || 0}
            - **Respostas corretas:** ${resultData.summary?.correctAnswers || 0}
            - **Respostas erradas:** ${resultData.summary?.wrongAnswers || 0}

            **QUESTÕES DETALHADAS:**
            ${
                resultData.questions
                    ? resultData.questions
                        .map(
                            (q, index) => `
            **Questão ${q.questionNumber}:**
            - **Pergunta:** ${q.questionText}
            - **Resposta do candidato:** ${
                                q.userAnswer !== undefined
                                    ? `Alternativa ${String.fromCharCode(
                                            65 + q.userAnswer
                                        )} - ${q.alternatives?.[q.userAnswer] || "N/A"}`
                                    : "Não respondida"
                            }
            - **Resposta correta:** Alternativa ${String.fromCharCode(
                                65 + q.correctAnswer
                            )} - ${q.alternatives?.[q.correctAnswer] || "N/A"}
            - **Status:** ${q.isCorrect ? "✅ CORRETA" : "❌ ERRADA"}
            `
                        )
                        .join("\n")
                    : "Nenhuma questão disponível"
            }

            **SUA TAREFA:**
            Forneça um feedback completo EM MARKDOWN seguindo esta estrutura:

            # 🎯 Feedback da Entrevista Simulada

            ## 📊 Análise Geral
            - **Desempenho geral:** [Avaliação baseada na porcentagem]
            - **Nível de preparação:** [Classifique como: Excelente/Bom/Regular/Necessita melhoria]
            - **Pontos chave observados:** [Lista com bullets]

            ## 🏆 Pontos Fortes
            - [Liste 2-3 pontos fortes identificados com base nas questões corretas]
            - [Mencione áreas onde o candidato demonstrou bom domínio]
            - [Use ✅ para destacar acertos relevantes]

            ## 📈 Áreas para Desenvolvimento
            - [Liste 2-3 áreas que precisam de atenção]
            - [Especifique tópicos baseados nas questões erradas]
            - [Use ❌ para indicar oportunidades de melhoria]

            ## 💡 Plano de Ação Recomendado
            ### Estudos Técnicos
            - [Liste tópicos específicos para estudar]
            - [Sugira recursos ou abordagens]

            ### Prática Comportamental
            - [Recomende exercícios ou práticas]
            - [Sugira como melhorar em entrevistas]

            ### Preparação para Próximas Etapas
            - [Dicas para entrevistas técnicas]
            - [Estratégias para se destacar]

            ## 🔍 Perspectiva do Recrutador
            - **Probabilidade de avanço:** [Baixa/Média/Alta]
            - **Recomendações para o processo:** [O que focar daqui para frente]
            - **Observações finais:** [Mensagem motivacional]

            ---

            **REGRAS DE FORMATAÇÃO:**
            - Use headings Markdown (#, ##, ###)
            - Use listas com bullets (-) e números (1.)
            - Use **negrito** para ênfase
            - Use emojis relevantes 🎯 📊 💡
            - Mantenha o tom profissional mas acolhedor
            - Seja específico baseando-se nas questões analisadas

            **IDIOMA:** Português brasileiro
        `;

        const result = await model.generateContent(prompt);

        console.log("Feedback recebido do Gemini. Processando...");

        const feedback = await result.response.text();

        console.log("Feedback gerado com sucesso.");

        return NextResponse.json(
            {
                success: true,
                feedback: feedback,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao gerar feedback:", error);
        return NextResponse.json(
            {
                error: "Erro ao gerar feedback",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
