import { Card } from "@/components/ui/card";

export default function PageTemplate({
    icon,
    title,
    description,
    children,
    output,
    error,
}) {
    return (
        <div className="space-y-8">
            <h1 className="flex items-center gap-3 text-3xl font-bold">
                {icon} {title}
            </h1>

            <p className="opacity-80 w-3xl mb-6">{description}</p>

            {children}

            {error && <p className="text-red-500 mt-4">Erro: {error}</p>}

            {output && (
                <Card className="p-8 mt-6">
                    <pre>{output}</pre>
                </Card>
            )}
        </div>
    );
}
