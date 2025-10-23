import { useState } from "react";
import {
  CircleCheck,
  XCircle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  MessageSquareQuote,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";

import { cleanAndParseJSON } from "@/lib/utils";

import AiOutput from "../dashboard/ai-output";

export default function QuizComponent({ quizData }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setOutput(null);
    setError(null);
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

  const getAiFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      setOutput(null);

      const score = calculateScore();

      // Preparar dados do resultado
      const resultData = {
        score: score,
        questions: questions.map((question, index) => ({
          questionNumber: index + 1,
          questionText: question.questionText,
          userAnswer: userAnswers[index],
          correctAnswer: question.correctAnswerIndex,
          isCorrect: userAnswers[index] === question.correctAnswerIndex,
          alternatives: question.alternatives.map((alt) => alt.text),
        })),
        summary: {
          totalQuestions: totalQuestions,
          correctAnswers: score.correct,
          wrongAnswers: totalQuestions - score.correct,
          answeredQuestions: Object.keys(userAnswers).length,
          unansweredQuestions: totalQuestions - Object.keys(userAnswers).length,
        },
      };

      console.log("📊 DADOS PARA FEEDBACK DA IA:", resultData);

      const response = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resultData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao obter feedback");
      }

      const data = await response.json();
      setOutput(data.feedback);
    } catch (error) {
      console.error("Erro ao gerar feedback:", error);
      setError("Erro ao gerar feedback: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Se houve erro no parsing, mostra mensagem de erro
  if (parseError) {
    return (
      <Card className="p-6 text-center">
        <XCircle className="mx-auto mb-4 text-red-400" size={48} />
        <h3 className="text-lg font-semibold mb-2">Erro ao carregar quiz</h3>
        <p className="text-muted-foreground mb-4">{parseError}</p>
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
        <XCircle className="mx-auto mb-4 text-red-400" size={48} />
        <h3 className="text-lg font-semibold mb-2">Quiz não disponível</h3>
        <p className="text-muted-foreground">
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

  if (!quizStarted) {
    return (
      <div className="max-w mx-auto">
        <h2 className="text-2xl font-bold mb-4">🎯 Simulação de Entrevista</h2>
        <p className="text-muted-foreground mb-6">
          Teste seus conhecimentos com {totalQuestions} perguntas baseadas no
          seu currículo e na vaga desejada.
        </p>
        <div className="space-y-3 text-left mb-6">
          <div className="flex items-center gap-3">
            <CircleCheck className="text-emerald-500" size={20} />
            <span>Perguntas técnicas e comportamentais</span>
          </div>
          <div className="flex items-center gap-3">
            <CircleCheck className="text-emerald-500" size={20} />
            <span>Baseado no seu perfil profissional</span>
          </div>
          <div className="flex items-center gap-3">
            <CircleCheck className="text-emerald-500" size={20} />
            <span>Feedback imediato</span>
          </div>
        </div>
        <Button onClick={handleStartQuiz} size="lg">
          Iniciar Entrevista
        </Button>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();

    return (
      <>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">
            📊 Resultado do Entrevista
          </h2>

          <div className="inline-flex flex-col items-center mb-6">
            <div className="text-4xl font-bold mb-2">{score.percentage}%</div>
            <div className="text-lg text-muted-foreground">
              {score.correct} de {score.total} questões corretas
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
            <div
              className="bg-purple-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${score.percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {questions.map((question, index) => {
            const userAnswerIndex = userAnswers[index];
            const isCorrect = userAnswerIndex === question.correctAnswerIndex;

            return (
              <div key={index} className="p-4 border border-dashed rounded-lg">
                <div className="flex items-start gap-3 mb-2">
                  {isCorrect ? (
                    <CircleCheck
                      className="text-emerald-500 mt-1 flex-shrink-0"
                      size={20}
                    />
                  ) : (
                    <XCircle
                      className="text-red-400 mt-1 flex-shrink-0"
                      size={20}
                    />
                  )}
                  <div>
                    <h4 className="font-semibold">Questão {index + 1}</h4>
                    <p className="text-muted-foreground">
                      {question.questionText}
                    </p>
                  </div>
                </div>

                {!isCorrect && userAnswerIndex !== undefined && (
                  <div className="ml-8 mt-2">
                    <p className="text-red-400 text-sm">
                      <strong>Sua resposta:</strong>{" "}
                      {String.fromCharCode(65 + userAnswerIndex)}.{" "}
                      {question.alternatives[userAnswerIndex].text}
                    </p>
                    <p className="text-emerald-500 text-sm mt-2">
                      <strong>Resposta correta:</strong>{" "}
                      {String.fromCharCode(65 + question.correctAnswerIndex)}.{" "}
                      {question.alternatives[question.correctAnswerIndex].text}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mx-auto flex gap-3">
          <Button onClick={handleRestart} className="flex-1" variant="outline">
            <RotateCcw />
            Refazer Entrevista
          </Button>

          <Button
            onClick={getAiFeedback}
            disabled={loading || output}
            className="flex-1"
          >
            <MessageSquareQuote />
            {loading
              ? "Gerando Feedback..."
              : output
              ? "Feedback gerado"
              : "Obter Feedback"}
          </Button>
        </div>

        {/* Output do Feedback */}
        {output && <AiOutput output={output} />}

        {error && <div className="text-red-400 mt-4">{error}</div>}
      </>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const userAnswer = userAnswers[currentQuestion];

  return (
    <div className="max-w mx-auto">
      {/* Header com progresso */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">
            Questão {currentQuestion + 1} de {totalQuestions}
          </h3>
          <p className="text-sm text-muted-foreground">
            Baseado no seu currículo e na vaga
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm mb-2">
            Progresso: {Object.keys(userAnswers).length}/{totalQuestions}
          </div>
          <Progress
            value={(Object.keys(userAnswers).length / totalQuestions) * 100}
            className="w-24"
          />
        </div>
      </div>

      {/* Questão atual */}

      <p className="text-md font-medium mb-4">
        {currentQuestionData.questionText}
      </p>

      <div className="space-y-3">
        {currentQuestionData.alternatives.map((alternative, index) => {
          const isSelected = userAnswer === index;
          const letter = String.fromCharCode(65 + index);

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion, index)}
              className={`w-full p-3 text-left border rounded-xl transition-all cursor-pointer ${
                isSelected
                  ? "border-purple-900/50 bg-purple-900/50"
                  : "hover:border-purple-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold opacity-80 ${
                    isSelected
                      ? "border-purple-900/50 bg-purple-900/50 text-white"
                      : ""
                  }`}
                >
                  {letter}
                </div>
                <span className="text-sm opacity-80">{alternative.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navegação */}
      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
        >
          <ChevronLeft size={16} />
          Anterior
        </Button>

        <div className="text-sm text-muted-foreground">
          {userAnswer !== undefined
            ? "Resposta selecionada"
            : "Selecione uma resposta"}
        </div>

        {currentQuestion === totalQuestions - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(userAnswers).length !== totalQuestions}
          >
            Finalizar
            <CircleCheck size={16} />
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={userAnswer === undefined}>
            Próxima
            <ChevronRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
