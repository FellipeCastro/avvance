Perfeito! Vou te entregar agora o **pacote completo**, atualizado e pronto para produção, com base no que conversamos: **Next.js + Clerk + Supabase + Sistema de Créditos com RPC segura**. Sem TypeScript, tudo em JavaScript.

---

# ✅ PACOTE COMPLETO - Sistema de Créditos SaaS (Next.js + Clerk + Supabase)

---

## ✅ 1. Estrutura das Tabelas + RPCs no Supabase (SQL)

### 🎯 Executa tudo isso no SQL Editor do Supabase:

```sql
-- Tabela: Saldo de Créditos
create table if not exists user_credits (
  user_id uuid primary key,
  credits integer not null default 0,
  updated_at timestamp default now()
);

-- Tabela: Custo por módulo
create table if not exists module_credits (
  module_name text primary key,
  credits_cost integer not null
);

-- Tabela: Histórico de Consumo
create table if not exists credit_usage_logs (
  id serial primary key,
  user_id uuid not null,
  module_name text not null,
  credits_used integer not null,
  used_at timestamp default now()
);

-- RPC: Consumir Créditos com Log (transação segura)
create or replace function consume_credits_and_log(
  uid uuid,
  module text,
  cost integer
)
returns void as $$
begin
  update user_credits
  set credits = credits - cost,
      updated_at = now()
  where user_id = uid
  and credits >= cost;

  if found then
    insert into credit_usage_logs (user_id, module_name, credits_used)
    values (uid, module, cost);
  else
    raise exception 'Insufficient credits';
  end if;
end;
$$ language plpgsql;

-- RPC: Adicionar Créditos (caso queira usar por API futuramente)
create or replace function add_credits(
  uid uuid,
  amt integer
)
returns void as $$
begin
  update user_credits
  set credits = credits + amt,
      updated_at = now()
  where user_id = uid;
end;
$$ language plpgsql;
```

---

## ✅ 2. Variáveis de Ambiente (.env.local)

```env
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

---

## ✅ 3. API Routes - Next.js App Router (JavaScript)

---

### 🗂️ `/app/api/consume-credits/route.js`

```js
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await req.json();
    const moduleName = body.moduleName;
    if (!moduleName) {
      return new Response(JSON.stringify({ error: "Missing moduleName" }), {
        status: 400,
      });
    }

    // Buscar custo do módulo
    const { data: module, error: moduleError } = await supabase
      .from("module_credits")
      .select("credits_cost")
      .eq("module_name", moduleName)
      .single();

    if (moduleError || !module) {
      console.error("Module Error:", moduleError);
      return new Response(JSON.stringify({ error: "Module not found" }), {
        status: 404,
      });
    }

    const creditsCost = module.credits_cost;

    // Verificar saldo do usuário
    const { data: user, error: userError } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", userId)
      .single();

    if (userError || !user) {
      console.error("User Error:", userError);
      return new Response(JSON.stringify({ error: "User credits not found" }), {
        status: 404,
      });
    }

    if (user.credits < creditsCost) {
      return new Response(JSON.stringify({ error: "Insufficient credits" }), {
        status: 402,
      });
    }

    // Consumir créditos via RPC (transação segura)
    const { error: rpcError } = await supabase.rpc("consume_credits_and_log", {
      uid: userId,
      module: moduleName,
      cost: creditsCost,
    });

    if (rpcError) {
      console.error("RPC Error:", rpcError);
      return new Response(
        JSON.stringify({ error: "Error consuming credits" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Unknown Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
```

---

### 🗂️ `/app/api/credits/balance/route.js`

```js
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { data, error } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch balance" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ credits: data.credits }), {
    status: 200,
  });
}
```

---

### 🗂️ `/app/api/credits/history/route.js`

```js
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { data, error } = await supabase
    .from("credit_usage_logs")
    .select("module_name, credits_used, used_at")
    .eq("user_id", userId)
    .order("used_at", { ascending: false })
    .limit(50);

  if (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch history" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ history: data }), { status: 200 });
}
```

---

## ✅ 4. Exemplo de Módulo Consumindo Créditos (Frontend Client Component)

### 🗂️ `/app/modules/ExampleModule.js`

```jsx
"use client";

import { useState } from "react";

export default function ExampleModule() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUseModule() {
    setLoading(true);
    setStatus("");

    const res = await fetch("/api/consume-credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleName: "example_module" }),
    });

    const result = await res.json();

    if (res.ok) {
      setStatus("✅ Módulo usado com sucesso! Créditos consumidos.");
    } else {
      setStatus("❌ Erro: " + (result.error || "Falha ao consumir módulo."));
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, border: "1px solid #ccc", marginTop: 20 }}>
      <h3>Módulo Exemplo: "example_module"</h3>
      <button onClick={handleUseModule} disabled={loading}>
        {loading ? "Usando..." : "Usar módulo (consome créditos)"}
      </button>
      <p>{status}</p>
    </div>
  );
}
```

---

## ✅ 5. Inserir Módulo e Créditos no Supabase (para testes iniciais)

### Criar o módulo:

```sql
insert into module_credits (module_name, credits_cost) values ('example_module', 5)
on conflict (module_name) do update set credits_cost = excluded.credits_cost;
```

### Adicionar créditos a um usuário (exemplo: 50 créditos):

```sql
insert into user_credits (user_id, credits) values ('SEU_USER_ID_AQUI', 50)
on conflict (user_id) do update set credits = user_credits.credits + 50;
```

(Use o `userId` real do Clerk)

---

## ✅ 6. Pronto para escalar ✅

Com isso, você já tem:

✅ Controle de saldo
✅ Consumo de créditos com segurança (transação atômica)
✅ Histórico de uso
✅ Painel de API para consultar saldo e histórico
✅ Exemplo de frontend chamando

---

👉 **Quer que eu te faça agora um painel Next.js com frontend mostrando: saldo atual + histórico + botão para cada módulo?**

Se quiser, só me pedir!

---

---

---

Sua dúvida é totalmente válida! Na verdade, eles **não são usados automaticamente** no fluxo de consumo, mas eles são **endpoints auxiliares**, que você pode (e deve) usar em partes do seu frontend onde for necessário exibir:

- ✅ **O saldo atual de créditos do usuário (endpoint `/api/credits/balance`)**
  👉 Exemplo: Para mostrar o saldo atual no dashboard, antes de consumir qualquer módulo.

- ✅ **O histórico de uso de créditos (endpoint `/api/credits/history`)**
  👉 Exemplo: Para mostrar uma lista tipo "Histórico de Transações" ao usuário.

---

### 📌 Resumo de propósito de cada endpoint:

| Endpoint               | Função                                                                       | Onde usar                                                          |
| ---------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `/api/consume-credits` | Consome créditos de fato (usado dentro de cada módulo que o usuário executa) | No botão "Usar Módulo", por exemplo                                |
| `/api/credits/balance` | Retorna o saldo atual de créditos do usuário                                 | No dashboard, no header, ou antes de liberar o uso de algum módulo |
| `/api/credits/history` | Traz o histórico de uso de créditos                                          | Na página de histórico, extrato ou detalhamento de consumo         |

---

### 📌 Exemplo de onde você vai usar cada um:

---

#### ✔ Exemplo no Dashboard:

```jsx
"use client";

import { useEffect, useState } from "react";

export default function CreditBalance() {
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    async function fetchBalance() {
      const res = await fetch("/api/credits/balance");
      const json = await res.json();
      setCredits(json.credits);
    }
    fetchBalance();
  }, []);

  return (
    <div>
      <h3>
        💳 Saldo de Créditos: {credits !== null ? credits : "Carregando..."}
      </h3>
    </div>
  );
}
```

---

#### ✔ Exemplo de Histórico:

```jsx
"use client";

import { useEffect, useState } from "react";

export default function CreditHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch("/api/credits/history");
      const json = await res.json();
      setHistory(json.history || []);
    }
    fetchHistory();
  }, []);

  return (
    <div>
      <h3>📜 Histórico de Uso de Créditos:</h3>
      <ul>
        {history.map((item, idx) => (
          <li key={idx}>
            {item.module_name} - {item.credits_used} créditos -{" "}
            {new Date(item.used_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### ✅ Em resumo:

🔑 **O fluxo de consumo (POST /consume-credits) é o único obrigatório para o consumo acontecer.**
🔑 **Os endpoints de balance e history são para você montar o painel de conta/usuário.**

---

Se quiser, posso te montar agora um **"Credit Dashboard Page" completa com:**

✅ Saldo
✅ Histórico
✅ Botões de consumo de módulos

Quer?

---

---

---

Se você já usa **Supabase** + **Next.js**, a solução ideal é guardar os **prompts** (com placeholders) em uma **tabela** no banco do Supabase e servir via **API Routes** do Next.js.
Assim você consegue editar via painel do Supabase, sem precisar _redeploy_, e ainda usa variáveis dinamicamente.

Aqui vai um **passo a passo completo** 👇

---

## 1️⃣ Criar a tabela no Supabase

No painel do Supabase (SQL Editor ou GUI), crie a tabela `prompts`:

```sql
create table prompts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,         -- nome identificador (ex.: seo_meta_title)
  template text not null,            -- texto do prompt com placeholders
  variables jsonb,                   -- array de variáveis esperadas ["keyword","length"]
  language text default 'pt-BR',     -- opcional: idioma
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

### 🔹 Exemplo de dados

| name             | template                                                           | variables              |
| ---------------- | ------------------------------------------------------------------ | ---------------------- |
| `seo_meta_title` | `Crie um título SEO de até {{length}} caracteres para {{keyword}}` | `["length","keyword"]` |
| `meta_desc`      | `Escreva uma descrição otimizada para {{topic}}`                   | `["topic"]`            |

---

## 2️⃣ Inserir/editar prompts

No painel **Table Editor** do Supabase ou via SQL, você adiciona ou edita prompts sem precisar mexer no código.

---

## 3️⃣ Criar uma API Route em Next.js

No seu projeto Next.js (ex.: `app/api/prompts/[name]/route.ts` ou `pages/api/prompts/[name].ts` se não usar App Router):

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ use Service Role só em rotas server-side
);

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("name", params.name)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
```

🔑 **Segurança:**

- Use a **Service Role Key** **somente** em rotas server-side (API Route ou Server Action).
- No **client** (browser) use apenas a chave pública e políticas de leitura (RLS) se for necessário.

---

## 4️⃣ Renderizar o template no backend

Para substituir os placeholders (`{{keyword}}`, `{{length}}`), use uma lib de templates.
Exemplo com **Mustache**:

```bash
npm install mustache
```

```typescript
import Mustache from "mustache";

export async function POST(req: Request) {
  const { name, variables } = await req.json(); // ex.: { name: 'seo_meta_title', variables: { keyword: 'marketing', length: 60 } }

  const { data, error } = await supabase
    .from("prompts")
    .select("template")
    .eq("name", name)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  const rendered = Mustache.render(data.template, variables);

  return NextResponse.json({ prompt: rendered });
}
```

---

## 5️⃣ Uso no Frontend

No React/Next.js você chama sua API e passa as variáveis:

```typescript
const generatePrompt = async () => {
  const res = await fetch("/api/prompts/seo_meta_title", {
    method: "POST",
    body: JSON.stringify({
      name: "seo_meta_title",
      variables: { keyword: "Marketing Digital", length: 60 },
    }),
    headers: { "Content-Type": "application/json" },
  });

  const { prompt } = await res.json();
  console.log(prompt);
  // -> "Crie um título SEO de até 60 caracteres para Marketing Digital"
};
```

---

## 6️⃣ Extras recomendados

✅ **Versionamento:**
Adicione coluna `version` ou `updated_at` para saber qual prompt foi usado.

✅ **Multi-idioma:**
Use a coluna `language` e filtre por `language` no SELECT.

✅ **Cache:**
Use `Next.js Cache` ou `Redis` para evitar hits constantes no Supabase em prompts que mudam pouco.

---

### 🚀 Benefícios dessa arquitetura

- **Edição em tempo real**: Ajuste no painel Supabase sem redeploy.
- **Variáveis dinâmicas**: Placeholders fáceis de substituir.
- **Escalabilidade**: Fácil adicionar novos prompts, idiomas, testes A/B.
- **Segurança**: Prompts só servidos via backend.

---

Quer que eu te ajude a criar um **script SQL de exemplo** para inserir alguns prompts logo no Supabase?
