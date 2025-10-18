import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const supabase = getServiceRoleClient();

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

export async function POST(req) {
  try {
    const { job_url, id, description, title, date_posted, company, location } =
      await req.json();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    if (!title || !id || !company || !job_url) {
      return NextResponse.json(
        {
          error:
            "Título, URL, ID, empresa e localidade são parâmetros obrigatórios",
        },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

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
      console.log(error);
      return NextResponse.json(
        { error: `Erro ao criar job: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const supabase = getServiceRoleClient();

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
