import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getBrowserClient } from "@/lib/supabase/browser";
import { getDatetime, generateFilePath } from "@/lib/utils";

const uploadFile = async (file, token) => {
  try {
    if (!file) throw new Error("Arquivo inválido.");

    const supabase = getBrowserClient(token);

    const filePath = generateFilePath(file);
    const { error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file);

    if (error)
      throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);

    return supabase.storage.from("uploads").getPublicUrl(filePath).data
      .publicUrl;
  } catch (error) {
    console.error("Erro no upload:", error);
    throw error;
  }
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const analysis = formData.get("analysis");

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo do currículo inexistente." },
        { status: 401 }
      );
    }

    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const token = await getToken({ template: "supabase" });

    const fileUrl = await uploadFile(file, token);

    if (!fileUrl) {
      return NextResponse.json(
        { error: "Erro interno no servidor." },
        { status: 500 }
      );
    }

    const supabase = supabaseClient(token);
    const datetime = getDatetime();

    const { data, error } = await supabase
      .from("cv_analysis")
      .insert([
        {
          file_url: fileUrl,
          analysis,
          user_id: userId,
          created_at: datetime,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: `Erro ao registrar a análise: ${error.message}`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { data, message: "Salvamento realizado com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro inesperado:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
