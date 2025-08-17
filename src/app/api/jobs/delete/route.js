import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

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

        if (!id) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }

        const token = await getToken({ template: "supabase" });
        const supabase = supabaseClient(token);

        const columnName = typeof id === "number" ? "id" : "job_id";

        const { data: existingJob, error } = await supabase
            .from("jobs")
            .select("user_id")
            .eq(columnName, id)
            .single();

        if (error || !existingJob) {
            console.error(error);
            return NextResponse.json(
                { error: "Vaga não encontrada" },
                { status: 404 }
            );
        }

        if (existingJob.user_id !== userId) {
            return NextResponse.json(
                { error: "Usuário não autorizado" },
                { status: 403 }
            );
        }

        const { error: deleteError } = await supabase
            .from("jobs")
            .delete()
            .eq(columnName, id);

        if (deleteError) {
            return NextResponse.json(
                { error: `Erro ao remover: ${deleteError.message}` },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Vaga removida com sucesso" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: `Erro interno: ${error.message}` },
            { status: 500 }
        );
    }
}
