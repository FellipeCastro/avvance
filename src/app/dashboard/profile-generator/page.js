"use client";

import { useState } from "react";
import { UserCheck } from "lucide-react";

import JobForm from "@/components/job-form";
import { Card } from "@/components/ui/card";
import MarkdownComponent from "@/components/ui/markdown-component";
import { useJobForm } from "@/hooks/use-job-form";

export default function Page() {
    const { register, handleSubmit, errors, isSubmitting, onReset } =
        useJobForm();

    const [output, setOutput] = useState(null);
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        setError(null);
        setOutput(null);

        try {
            const response = await fetch("/api/profile-generator", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ job: data }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Erro desconhecido");
            }

            setOutput(result.response);
        } catch (err) {
            console.error(err);
            setError(err.message || "Erro ao conectar com o servidor");
        }
    };

    return (
        <>
            <h1 className="flex items-center gap-3 text-3xl font-bold mb-1">
                <UserCheck color={"#2b7fff"} /> Gerador de Perfis
            </h1>

            <p className="text-muted-foreground w-3xl">
                Crie perfis otimizados a partir de uma vaga, receba sugestões
                inteligentes de competências e habilidades, e analise candidatos
                com insights precisos para encontrar a combinação ideal para a
                sua necessidade.
            </p>

            <JobForm
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                isSubmitting={isSubmitting}
                onSubmit={onSubmit}
                onReset={onReset}
            />

            {error && <p className="text-red-500 mt-4">Erro: {error}</p>}

            {output && (
                <Card className="p-8">
                    <MarkdownComponent>{output}</MarkdownComponent>
                </Card>
            )}
        </>
    );
}
