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

        const { data: jobs, error } = await supabase
            .from("jobs")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            console.log(error);
            return NextResponse.json(
                { error: `Erro ao buscar vagas: ${error.message}` },
                { status: 400 }
            );
        }

        return NextResponse.json(jobs || [], { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Erro ao processar requisição" },
            { status: 500 }
        );
    }
}
