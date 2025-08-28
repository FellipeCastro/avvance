// aqui tem como add uma verificação com o useUser para verificar se o user está conectado, caso não, redirect para outra page

export default function PageTemplate({
  icon,
  title,
  description,
  children,
  error,
}) {
  return (
    <div className="space-y-8">
      <h1 className="flex items-center gap-3 text-3xl font-bold">
        <span className="text-blue-500">{icon}</span> {title}
      </h1>

      <p className="opacity-80 w-3xl mb-6">{description}</p>

      {children}

      {error && <p className="text-red-500 mt-4">Erro: {error}</p>}
    </div>
  );
}
