import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { getDatetime, generateFilePath } from "@/lib/utils";

export async function GET(req) {
  try {
    const { userId } = await auth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("cv_analysis")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw new Error(
        `Erro ao buscar dados das análises: ${error.message || error}`
      );
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error("Erro em /api/cv:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}

const uploadFile = async (file) => {
  try {
    if (!file) throw new Error("Arquivo inválido.");

    const supabase = getServiceRoleClient();

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

    const { userId } = await auth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const fileUrl = await uploadFile(file);

    if (!fileUrl) {
      return NextResponse.json(
        { error: "Erro interno no servidor." },
        { status: 500 }
      );
    }

    const supabase = getServiceRoleClient();
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

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const { userId } = await auth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const supabase = getServiceRoleClient();

    const { data: existingCvAnalysis, error } = await supabase
      .from("cv_analysis")
      .select("user_id")
      .eq("id", id)
      .single();

    if (error || !existingCvAnalysis) {
      console.log(error);
      return NextResponse.json(
        { error: `Analise de Cv não encontrado: ${error}` },
        { status: 404 }
      );
    }

    if (existingCvAnalysis.user_id !== userId) {
      return NextResponse.json(
        { error: "Usuário não autorizado" },
        { status: 403 }
      );
    }

    // Deleta o job
    const { error: deleteError } = await supabase
      .from("cv_analysis")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        { error: `Erro ao remover: ${deleteError.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Analise removida com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar requisição: " + error.message },
      { status: 500 }
    );
  }
}
