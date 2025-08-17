"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserSearch, Sparkles, Bookmark, Loader2, TextSearch } from "lucide-react";

import FileInput from "@/components/file-input";
import MarkdownComponent from "@/components/ui/markdown-component";
import CopyButton from "@/components/copy-button";

export default function Page() {
    const { user } = useUser();
    const [output, setOutput] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [file, setFile] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
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

            const response = await fetch("/api/cv/analyzer", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erro no upload ou análise");
            }

            const result = await response.json();
            setOutput(result.output || "Parece que não foi possível concluir o processamento, tente novamente!");
            setError(null)
        } catch (error) {
            setError("Erro ao processar a requisição: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) {
            setError("Usuário não autenticado.");
            return;
        }

        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("analysis", output);

            const response = await fetch("/api/cv/save", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erro ao salvar a análise");
            }

            setError(null);
            alert("Análise salva com sucesso!");
        } catch (error) {
            setError("Erro ao salvar a análise: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <h1 className="flex items-center gap-3 text-3xl font-bold mb-1">
                <TextSearch color="#2b7fff" /> Analisador de Currículos
            </h1>
            <p className="text-muted-foreground w-3xl">
                Envie currículos para uma IA e receba insights estratégicos
                juntamente com descrições e pontuações assertivas para conhecer
                melhor o candidato, sua área de atuação e seu posicionamento no
                mercado de trabalho.
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
                            Analisando...
                        </>
                    ) : (
                        <>
                            <Sparkles />
                            Analisar
                        </>
                    )}
                </Button>
            </form>
            {error && <div className="text-red-500">{error}</div>}
            {output && (
                <>
                    <div className="flex gap-3 flex-wrap">
                        <CopyButton text={output} />
                        <Button
                            variant="outline"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Bookmark /> Salvar
                                </>
                            )}
                        </Button>
                        <Button variant="ghost" onClick={onSubmit}>
                            Analisar novamente
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
