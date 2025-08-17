"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Sparkles, Loader2 } from "lucide-react";

import FileInput from "@/components/file-input";
import MarkdownComponent from "@/components/ui/markdown-component";
import CopyButton from "@/components/copy-button";

export default function Page() {
    const [output, setOutput] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    const {
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleFileChange = (event) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const onSubmit = async () => {
        if (!file) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/linkedin-generator", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erro no upload ou geração do perfil");
            }

            const result = await response.json();
            setOutput(result.output || "Perfil gerado com sucesso!");
        } catch (error) {
            setError("Erro ao processar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="flex items-center gap-3 text-3xl font-bold mb-1">
                <User color="#2b7fff" /> Gerador de LinkedIn
            </h1>
            <p className="text-muted-foreground w-3xl">
                Faça o upload de um currículo e transforme-o automaticamente em
                um perfil profissional, no estilo LinkedIn, pronto para
                maximizar oportunidades, altamente otimizado para os altos
                padrões do mercado.
            </p>

            <FileInput handleFileChange={handleFileChange} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Button
                    variant="default"
                    size="lg"
                    type="submit"
                    className="text-1xl font-medium"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Gerando...
                        </>
                    ) : (
                        <>
                            <Sparkles />
                            Gerar Perfil
                        </>
                    )}
                </Button>
            </form>

            {error && <div className="text-red-500 mt-4">{error}</div>}

            {output && (
                <>
                    <div className="flex gap-3 flex-wrap mt-4">
                        <CopyButton text={output} />
                        <Button variant="ghost" onClick={onSubmit}>
                            Gerar novamente
                        </Button>
                    </div>

                    {output && (
                        <Card className="p-8">
                            <MarkdownComponent>{output}</MarkdownComponent>
                        </Card>
                    )}
                </>
            )}
        </>
    );
}
