import { auth } from "@clerk/nextjs/server";

export async function requireAuth(template = "supabase") {
  const { userId, getToken } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const token = await getToken({ template });
  return { userId, token };
}
