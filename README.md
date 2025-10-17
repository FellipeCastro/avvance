# Setup - Avvance

## Supabase

### Comando para gerar um dump completo do banco de dados:

Primeiramente, localize o menu Connect no topo da página inicial de seu projeto e resgate a Connection String do tipo URI Transactional Pooler.

Depois, execute o seguinte comando, que criará um arquivo chamado bd.sql contendo todas as estruturas de tabelas, roles, polices etc.

```
pg_dump --schema=public --schema-only --no-owner --no-privileges --no-comments "SUA_URI" > bd.sql
```

Seu comando deve ser algo semelhante a:

```
pg_dump --schema=public --schema-only --no-owner --no-privileges --no-comments "postgresql://postgres.xxxxxxxxxxx:SENHA-AQUI@aws-0-us-west-1.pooler.supabase.com:6543/postgres" > bd.sql
```

> ⚠️ Nunca versionar ou compartilhar este comando com a senha real exposta.

### Gerando tabelas no Supabase

Após gerar o dump, é preciso comentar as seguintes linhas do arquivo gerado (bd.sql):

```
CREATE SCHEMA public;
SET transaction_timeout = 0;
```

> Supabase já cria o schema public por padrão, e o SQL do transaction_timeout não é suportado pelo editor deles

Depois disso, copie e cole o arquivo gerado para o editor SQL do Supabase e execute para criar toda a estrutura.

### Gerando bucket de arquivos

Dentro da interface Supabase, vá em Storage e crie um bucket PÚBLICO com o nome "uploads". Após criar o bucket, vá ao editor SQL, copie e execute as seguinte polices:

```
-- Allow authenticated users to read files from uploads bucket
CREATE POLICY "Authenticated users can read from uploads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'uploads'::text
);

-- Allow authenticated users to insert files into uploads bucket
CREATE POLICY "Authenticated users can insert into uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uploads'::text
);
```

### Pegar variáveis

- Localize o menu Connect, no topo da interace da página inicial do seu projeto, abra-o e clique no menu App Frameworks, com o Framework Next.js.

- Copie as chaves geradas para seu .env, algo semelhante a:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxx
```

- Em seguida, vá até as configurações do projeto e abra o menu API Keys, copie o campo service_role secret e atualize seu .env:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxxxxxxxx
```

## Clerk

Configure os métodos de login, etc (parte totalmente personalizável)

### JWT Template

Para as requisições Supabase funcionarem com usuários autênticados pelo Clerk, é necessário estabelecer uma conexão com um template JWT. Siga os seguintes passos:

- Dentro da interface do Supabase, localize e copie o JWT Secret.

- Vá até o Clerk em JWT Templates, gere um JWT Template Supabase, insira o JWT copiado e salve.

### Clerk Webhook Integrando Supabase

Para as alterações nos usuários cadastrados no Clerk, novos registros ou edição dos mesmos, é necessário sincronizar todas essas mudanças na tabela de usuários do Supabase, para fazer isso, será necessário configurar um webhook:

> Não é necessário construir um webhook para lidar com a sincronização de usuários Supabase x Clerk, esta aplicação já tem um pronto para ser usado, localizado em src/api/clerk-webhook.

- Na interface de configurações do Clerk, vá até o menu Webhooks e crie um webhook com o seguinte padrão de endpoint: https://dominio-da-aplicacao/api/clerk-webhook.

- Selecione os eventos de user.created, user.updated, user.deleted.

- Copie o conteúdo do campo Signing Secret para usá-lo depois.

### Pegar variáveis

Vá até as configurações e localize o menu API keys, copie o conteúdo do .env, algo semelhante a:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=xxxxxxxxxxxxx
CLERK_SECRET_KEY=xxxxxxxxxxxxx
```

Depois, atualize seu .env com essas informações e adicione mais uma chave, com o Signing Secret que você salvou:

```
CLERK_WEBHOOK_SECRET=xxxxxxxxxxxxx
```

## Vercel

Antes de proseguir o deploy, certifique-se de ter todas essas informações no modelo deste .env:

```
# variaveis clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=xxxxxxxxxxxxx
CLERK_SECRET_KEY=xxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=xxxxxxxxxxxxx

# variaveis supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxxxxxxxxxx

# variavel da chave de API do gemini
GEMINI_API_KEY=xxxxxxxxxxxxx
```

Se tudo estiver certo, prossiga o deploy normalmente, criando um novo projeto, apontando para a base de código e adicionando as variáveis de ambiente.
