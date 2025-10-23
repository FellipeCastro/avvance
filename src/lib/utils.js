import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";
import path from "path";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getDatetime() {
  const now = new Date();

  const format = (num) => num.toString().padStart(2, "0");

  const day = format(now.getDate());
  const month = format(now.getMonth() + 1);
  const year = now.getFullYear();

  const hours = format(now.getHours());
  const minutes = format(now.getMinutes());
  const seconds = format(now.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function sortByRelevance(items) {
  const isValid = (value) => {
    // Considera não apenas null/undefined, mas também string vazia, array vazio etc.
    if (value == null) return false;
    if (typeof value === "string") return value.trim() !== "";
    if (Array.isArray(value)) return value.length > 0;
    return true;
  };

  const getRank = (item) => {
    const hasLocation = isValid(item.location);
    const hasDatePosted = isValid(item.date_posted);

    if (hasLocation && hasDatePosted) return 0;
    if (hasLocation && !hasDatePosted) return 1;
    if (!hasLocation && hasDatePosted) return 2;
    return 3;
  };

  return items.sort((a, b) => getRank(a) - getRank(b));
}

export function generateFilePath(file) {
  const now = new Date();
  const [day, month, year] = now.toLocaleDateString("pt-BR").split("/");
  const ext = path.extname(file.name);
  const baseName = path
    .basename(file.name, ext)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return `uploads/${year}/${month}/${day}/${crypto.randomUUID()}-${baseName}${ext}`;
}

export const cleanAndParseJSON = (jsonString) => {
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

      if (!question.questionText || typeof question.questionText !== "string") {
        throw new Error(`Questão ${index} não tem questionText válido`);
      }

      if (!Array.isArray(question.alternatives)) {
        throw new Error(`Questão ${index} não tem alternatives array`);
      }

      // Valida cada alternativa
      question.alternatives.forEach((alt, altIndex) => {
        if (!alt || typeof alt !== "object" || typeof alt.text !== "string") {
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
        throw new Error(`correctAnswerIndex inválido na questão ${index}`);
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
