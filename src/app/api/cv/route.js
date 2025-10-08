import { NextResponse } from "next/server";
import { getBrowserClient } from "@/lib/supabase/browser";
import { auth } from "@clerk/nextjs/server";
import {
  getCvAnalysis,
  saveCvAnalysis,
  uploadFile,
} from "@/lib/supabase/functions";

export async function GET(req) {
  try {
    const { userId, getToken } = await auth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const token = await getToken({ template: "supabase" });
    const data = await getCvAnalysis(token, userId);

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error("Erro em /api/cv:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { userId, getToken } = await auth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const analysis = formData.get("analysis");

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo do currículo inexistente." },
        { status: 400 }
      );
    }

    const token = await getToken({ template: "supabase" });
    const fileUrl = await uploadFile(file, token);
    await saveCvAnalysis(token, userId, fileUrl, analysis);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Erro em /api/cv:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}

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

    const { data, error } = await supabase
      .from("cv_analysis")
      .select("user_id")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.log(error);
      return NextResponse.json(
        { error: `Analise de Cv não encontrada` },
        { status: 404 }
      );
    }

    if (data.user_id !== userId) {
      return NextResponse.json(
        { error: "Usuário não autorizado" },
        { status: 403 }
      );
    }

    const { error: deleteError } = await supabase
      .from("cv_analysis")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        { error: `Erro ao remover: ${deleteError.message || error}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Analise removida com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro em /api/cv DELETE:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição." },
      { status: 500 }
    );
  }
}
