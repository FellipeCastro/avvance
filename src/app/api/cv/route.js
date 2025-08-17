import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

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
        const supabase = supabaseClient(token);

        const { data: cvAnalysis, error } = await supabase
            .from("cv_analysis")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            return NextResponse.json(
                { error: `Erro ao buscar análises dos currículos: ${error.message}` },
                { status: 400 }
            );
        }

        return NextResponse.json(cvAnalysis || [], { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao processar requisição" },
            { status: 500 }
        );
    }
}
