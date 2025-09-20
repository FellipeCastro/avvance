import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authHelper";
import { getServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const { userId } = await requireAuth();

    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("usage_logs")
      .insert([{ user_id: userId, module_name: "cv-analyzer" }])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: `Erro ao salvar dados de uso: ${error}`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ output: "deu certo" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar o arquivo:", error);
    return NextResponse.json(
      { error: "Erro ao processar o arquivo" },
      { status: 500 }
    );
  }
}
