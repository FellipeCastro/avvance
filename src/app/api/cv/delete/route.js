import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getBrowserClient } from "@/lib/supabase/browser";

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const { userId, getToken } = await auth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const token = await getToken({ template: "supabase" });
    const supabase = getBrowserClient(token);

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
