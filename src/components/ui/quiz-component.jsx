import { useState } from "react";
import {
    CheckCircle,
    XCircle,
    ChevronRight,
    ChevronLeft,
    RotateCcw,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";

// Função robusta para limpar e validar JSON
const cleanAndParseJSON = (jsonString) => {
    try {
        // Se já for um objeto, retorna diretamente
        if (typeof jsonString === "object" && jsonString !== null) {
            return jsonString;
        }

        if (typeof jsonString !== "string") {
            throw new Error("Dados não são uma string JSON");
        }

        let cleaned = jsonString.trim();
        console.log("String original:", cleaned);

        // Remove code blocks markdown completos
        cleaned = cleaned.replace(/```json\s*([\s\S]*?)\s*```/g, "$1");
        cleaned = cleaned.replace(/```\s*([\s\S]*?)\s*```/g, "$1");

        // Encontra o primeiro [ e último ] para arrays JSON
        const firstBracket = cleaned.indexOf("[");
        const lastBracket = cleaned.lastIndexOf("]");

        if (firstBracket !== -1 && lastBracket !== -1) {
            cleaned = cleaned.substring(firstBracket, lastBracket + 1);
        } else {
            // Se não encontrar array, tenta encontrar objeto
            const firstBrace = cleaned.indexOf("{");
            const lastBrace = cleaned.lastIndexOf("}");

            if (firstBrace !== -1 && lastBrace !== -1) {
                cleaned = cleaned.substring(firstBrace, lastBrace + 1);
            } else {
                throw new Error("Estrutura JSON não encontrada");
            }
        }

        // Remove comentários (opcional, mas útil)
        cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, "");
        cleaned = cleaned.replace(/\/\/.*$/gm, "");

        // Corrige aspas simples para duplas em chaves
        cleaned = cleaned.replace(/([{,]\s*)'([^']+)'(\s*:)/g, '$1"$2"$3');

        // Corrige aspas simples para duplas em valores string
        cleaned = cleaned.replace(/:\s*'([^']*)'/g, ': "$1"');

        // Corrige vírgulas trailing antes de } ou ]
        cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

        // Remove quebras de linha e tabs dentro de strings
        cleaned = cleaned.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match) => {
            return match.replace(/[\n\t]/g, " ");
        });

        // Remove múltiplos espaços fora de strings
        const parts = cleaned.split('"');
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // Partes fora de strings
                parts[i] = parts[i].replace(/\s+/g, " ");
            }
        }
        cleaned = parts.join('"');

        // Corrige chaves sem aspas (propriedades não quotadas)
        cleaned = cleaned.replace(
            /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*:)/g,
            '$1"$2"$3'
        );

        // Corrige valores booleanos e numéricos
        cleaned = cleaned.replace(
            /:\s*'(true|false|null|[0-9]+\.?[0-9]*)'/g,
            ": $1"
        );
        cleaned = cleaned.replace(
            /:\s*"(true|false|null|[0-9]+\.?[0-9]*)"/g,
            ": $1"
        );

        // Validação final - verifica se é um array
        const trimmed = cleaned.trim();
        if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
            throw new Error("JSON não é um array válido");
        }

        console.log("String limpa:", cleaned);

        const parsed = JSON.parse(cleaned);

        // Valida a estrutura do array
        if (!Array.isArray(parsed)) {
            throw new Error("Dados parseados não são um array");
        }

        // Valida cada questão
        const validatedQuestions = parsed.map((question, index) => {
            if (!question || typeof question !== "object") {
                throw new Error(`Questão ${index} não é um objeto válido`);
            }

            if (
                !question.questionText ||
                typeof question.questionText !== "string"
            ) {
                throw new Error(`Questão ${index} não tem questionText válido`);
            }

            if (!Array.isArray(question.alternatives)) {
                throw new Error(`Questão ${index} não tem alternatives array`);
            }

            // Valida cada alternativa
            question.alternatives.forEach((alt, altIndex) => {
                if (
                    !alt ||
                    typeof alt !== "object" ||
                    typeof alt.text !== "string"
                ) {
                    throw new Error(
                        `Alternativa ${altIndex} da questão ${index} é inválida`
                    );
                }
            });

            if (
                typeof question.correctAnswerIndex !== "number" ||
                question.correctAnswerIndex < 0 ||
                question.correctAnswerIndex >= question.alternatives.length
            ) {
                throw new Error(
                    `correctAnswerIndex inválido na questão ${index}`
                );
            }

            return question;
        });

        console.log(
            "Quiz validado com sucesso:",
            validatedQuestions.length,
            "questões"
        );
        return validatedQuestions;
    } catch (error) {
        console.error("Erro detalhado no parsing JSON:", error);
        console.log("String que causou o erro:", jsonString);

        // Fallback: tenta encontrar e extrair qualquer estrutura que pareça um array
        try {
            const arrayMatch = jsonString.match(/\[\s*{[\s\S]*?}\s*\]/);
            if (arrayMatch) {
                console.log("Tentando fallback com match:", arrayMatch[0]);
                return JSON.parse(arrayMatch[0]);
            }
        } catch (fallbackError) {
            console.error("Fallback também falhou:", fallbackError);
        }

        throw new Error(`Falha ao processar quiz: ${error.message}`);
    }
};

export default function QuizComponent({ quizData }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [parseError, setParseError] = useState(null);

    // Função para processar os dados do quiz
    const processedQuizData = () => {
        try {
            if (!quizData) {
                throw new Error("Nenhum dado de quiz fornecido");
            }

            // Se já for um array válido, retorna diretamente
            if (
                Array.isArray(quizData) &&
                quizData.length > 0 &&
                quizData[0].questionText &&
                Array.isArray(quizData[0].alternatives)
            ) {
                return quizData;
            }

            // Caso contrário, tenta parsear
            return cleanAndParseJSON(quizData);
        } catch (error) {
            console.error("Erro ao processar dados do quiz:", error);
            setParseError(error.message);
            return [];
        }
    };

    const questions = processedQuizData();
    const totalQuestions = questions.length;

    // Se houve erro no parsing, mostra mensagem de erro
    if (parseError) {
        return (
            <Card className="p-6 text-center">
                <XCircle className="mx-auto mb-4 text-red-500" size={48} />
                <h3 className="text-lg font-semibold mb-2">
                    Erro ao carregar quiz
                </h3>
                <p className="text-gray-600 mb-4">{parseError}</p>
                <details className="text-left">
                    <summary className="cursor-pointer text-sm text-blue-600">
                        Detalhes técnicos
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                        {typeof quizData === "string"
                            ? quizData
                            : JSON.stringify(quizData, null, 2)}
                    </pre>
                </details>
            </Card>
        );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
        return (
            <Card className="p-6 text-center">
                <XCircle className="mx-auto mb-4 text-red-500" size={48} />
                <h3 className="text-lg font-semibold mb-2">
                    Quiz não disponível
                </h3>
                <p className="text-gray-600">
                    {quizData
                        ? "Os dados do quiz estão incompletos ou no formato incorreto."
                        : "Nenhum dado de quiz foi recebido."}
                </p>
                {quizData && (
                    <details className="text-left mt-4">
                        <summary className="cursor-pointer text-sm text-blue-600">
                            Ver dados recebidos
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                            {typeof quizData === "string"
                                ? quizData
                                : JSON.stringify(quizData, null, 2)}
                        </pre>
                    </details>
                )}
            </Card>
        );
    }

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        if (showResults) return; // Não permite mudar respostas após ver resultados

        setUserAnswers((prev) => ({
            ...prev,
            [questionIndex]: answerIndex,
        }));
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const handleSubmit = () => {
        setShowResults(true);
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setUserAnswers({});
        setShowResults(false);
        setQuizStarted(false);
        setParseError(null);
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((question, index) => {
            if (userAnswers[index] === question.correctAnswerIndex) {
                correct++;
            }
        });
        return {
            correct,
            total: totalQuestions,
            percentage: Math.round((correct / totalQuestions) * 100),
        };
    };

    const score = calculateScore();
    const currentQuestionData = questions[currentQuestion];
    const userAnswer = userAnswers[currentQuestion];

    const getAiFeedback = async () => {
        try {
            console.log("AI Feedback");
        } catch (error) {
            console.error("Erro:", error);
            setError("Erro ao gerar feedback: " + error.message);
        }
    }

    if (!quizStarted) {
        return (
            <div className="max-w mx-auto">
                <h2 className="text-2xl font-bold mb-4">
                    🎯 Quiz de Entrevista
                </h2>
                <p className="text-gray-600 mb-6">
                    Teste seus conhecimentos com {totalQuestions} perguntas
                    baseadas no seu currículo e na vaga desejada.
                </p>
                <div className="space-y-3 text-left mb-6">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="text-green-500" size={20} />
                        <span>Perguntas técnicas e comportamentais</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="text-green-500" size={20} />
                        <span>Baseado no seu perfil profissional</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="text-green-500" size={20} />
                        <span>Feedback imediato</span>
                    </div>
                </div>
                <Button onClick={handleStartQuiz} size="lg" className="w-full">
                    Iniciar Quiz
                </Button>
            </div>
        );
    }

    if (showResults) {
        return (
            <>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-4">
                        📊 Resultado do Quiz
                    </h2>

                    <div className="inline-flex flex-col items-center mb-6">
                        <div className="text-4xl font-bold mb-2">
                            {score.percentage}%
                        </div>
                        <div className="text-lg text-gray-600">
                            {score.correct} de {score.total} questões corretas
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
                        <div
                            className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${score.percentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    {questions.map((question, index) => {
                        const userAnswerIndex = userAnswers[index];
                        const isCorrect =
                            userAnswerIndex === question.correctAnswerIndex;

                        return (
                            <div key={index} className="p-4 border rounded-lg">
                                <div className="flex items-start gap-3 mb-2">
                                    {isCorrect ? (
                                        <CheckCircle
                                            className="text-green-500 mt-1 flex-shrink-0"
                                            size={20}
                                        />
                                    ) : (
                                        <XCircle
                                            className="text-red-500 mt-1 flex-shrink-0"
                                            size={20}
                                        />
                                    )}
                                    <div>
                                        <h4 className="font-semibold">
                                            Questão {index + 1}
                                        </h4>
                                        <p className="text-gray-700">
                                            {question.questionText}
                                        </p>
                                    </div>
                                </div>

                                {!isCorrect &&
                                    userAnswerIndex !== undefined && (
                                        <div className="ml-8 mt-2">
                                            <p className="text-red-500 text-sm">
                                                <strong>Sua resposta:</strong>{" "}
                                                {String.fromCharCode(
                                                    65 + userAnswerIndex
                                                )}
                                                .{" "}
                                                {
                                                    question.alternatives[
                                                        userAnswerIndex
                                                    ].text
                                                }
                                            </p>
                                            <p className="text-green-500 text-sm mt-2">
                                                <strong>
                                                    Resposta correta:
                                                </strong>{" "}
                                                {String.fromCharCode(
                                                    65 +
                                                        question.correctAnswerIndex
                                                )}
                                                .{" "}
                                                {
                                                    question.alternatives[
                                                        question
                                                            .correctAnswerIndex
                                                    ].text
                                                }
                                            </p>
                                        </div>
                                    )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={handleRestart}
                        className="flex-1"
                        variant="outline"
                    >
                        <RotateCcw size={16} className="mr-2" />
                        Refazer Quiz
                    </Button>
                    <Button
                        onClick={getAiFeedback}
                        className="flex-1"
                        variant="outline"
                    >
                        Obter Feedback
                    </Button>
                </div>
            </>
        );
    }

    return (
        <div className="max-w mx-auto">
            {/* Header com progresso */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold">
                        Questão {currentQuestion + 1} de {totalQuestions}
                    </h3>
                    <p className="text-sm text-gray-600">
                        Baseado no seu currículo e na vaga
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">
                        Progresso: {Object.keys(userAnswers).length}/
                        {totalQuestions}
                    </div>
                    <Progress
                        value={
                            (Object.keys(userAnswers).length / totalQuestions) *
                            100
                        }
                        className="w-24"
                    />
                </div>
            </div>

            {/* Questão atual */}
            <div className="mb-6">
                <h4 className="text-md font-medium mb-4">
                    {currentQuestionData.questionText}
                </h4>

                <div className="space-y-3">
                    {currentQuestionData.alternatives.map(
                        (alternative, index) => {
                            const isSelected = userAnswer === index;
                            const letter = String.fromCharCode(65 + index);

                            return (
                                <button
                                    key={index}
                                    onClick={() =>
                                        handleAnswerSelect(
                                            currentQuestion,
                                            index
                                        )
                                    }
                                    className={`w-full p-4 text-left border rounded-lg transition-all ${
                                        isSelected
                                            ? "border-purple-500 bg-purple-900 ring-2 ring-purple-500 "
                                            : "border-gray-300 hover:text-gray-400"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold
                                            opacity-80 
                                                ${
                                                    isSelected
                                                        ? "border-purple-500 bg-purple-500 text-white"
                                                        : "border-gray-400 text-gray-600"
                                                }
                                            `}
                                        >
                                            {letter}
                                        </div>
                                        <span className="text-sm opacity-80">
                                            {alternative.text}
                                        </span>
                                    </div>
                                </button>
                            );
                        }
                    )}
                </div>
            </div>

            {/* Navegação */}
            <div className="flex justify-between items-center">
                <Button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <ChevronLeft size={16} />
                    Anterior
                </Button>

                <div className="text-sm text-gray-600">
                    {userAnswer !== undefined
                        ? "Resposta selecionada"
                        : "Selecione uma resposta"}
                </div>

                {currentQuestion === totalQuestions - 1 ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={
                            Object.keys(userAnswers).length !== totalQuestions
                        }
                        className="flex items-center gap-2 bg-purple-500 text-white hover:bg-purple-600"
                    >
                        Finalizar
                        <CheckCircle size={16} />
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        disabled={userAnswer === undefined}
                        className="flex items-center gap-2"
                    >
                        Próxima
                        <ChevronRight size={16} />
                    </Button>
                )}
            </div>
        </div>
    );
}
