import { createClient } from "@supabase/supabase-js";
import { getBrowserClient } from "./browser";
import { generateFilePath, getDatetime } from "../utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function saveUsageLog(moduleName, creditsUsed = 1, userId) {
  const { error } = await supabase.from("usage_logs").insert({
    module_name: moduleName,
    credits_used: creditsUsed,
    user_id: userId,
  });

  if (error) {
    console.error("Erro ao salvar log:", error);
    throw new Error(
      `Erro ao salvar log no Supabase: ${error.message || error}`
    );
  }
}

// olhar aqui pra ver se n dá pra ser na service role key
export const uploadFile = async (file, token) => {
  try {
    if (!file) throw new Error("Arquivo inválido.");

    const supabase = getBrowserClient(token);

    const filePath = generateFilePath(file);
    const { error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file);

    if (error)
      throw new Error(
        `Erro ao fazer upload do arquivo: ${error.message || error}`
      );

    return supabase.storage.from("uploads").getPublicUrl(filePath).data
      .publicUrl;
  } catch (error) {
    console.error("Erro no upload:", error);
    throw error;
  }
};

export async function getCvAnalysis(token, userId) {
  const supabase = getBrowserClient(token);

  const { data, error } = await supabase
    .from("cv_analysis")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(
      `Erro ao buscar dados das análises: ${error.message || error}`
    );
  }

  return data;
}

export async function saveCvAnalysis(token, userId, fileUrl, analysis) {
  if (!fileUrl) {
    throw new Error(`URL do Arquivo não identificada ou ausente.`);
  }

  const supabase = getBrowserClient(token);

  const { error } = await supabase
    .from("cv_analysis")
    .insert([
      {
        file_url: fileUrl,
        analysis,
        user_id: userId,
        created_at: getDatetime(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar análise: ${error.message || error}`);
  }
}
