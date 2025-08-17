import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
    try {
        const {
            job_url,
            id,
            description,
            title,
            date_posted,
            company,
            location,
        } = await req.json();
        const { userId, getToken } = await auth(req);

        if (!userId) {
            return NextResponse.json(
                { error: "Usuário não autenticado" },
                { status: 401 }
            );
        }

        if (!title || !id || !company || !job_url) {
            return NextResponse.json(
                {
                    error: "Título, URL, ID, empresa e localidade são parâmetros obrigatórios",
                },
                { status: 400 }
            );
        }

        const token = await getToken({ template: "supabase" });
        const supabase = supabaseClient(token);

        const { data, error } = await supabase
            .from("jobs")
            .insert([
                {
                    job_url,
                    job_id: id,
                    description,
                    title,
                    date_posted,
                    company,
                    location,
                    user_id: userId,
                },
            ])
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { error: `Erro ao criar job: ${error.message}` },
                { status: 400 }
            );
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao processar requisição" },
            { status: 500 }
        );
    }
}
