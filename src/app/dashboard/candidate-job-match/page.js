"use client";

import { useState } from "react";
import { useJobForm } from "@/hooks/use-job-form";

import { FileHeart } from "lucide-react";

import { Card } from "@/components/ui/card";

import FileInput from "@/components/file-input";
import MarkdownComponent from "@/components/ui/markdown-component";
import JobForm from "@/components/job-form";

export default function Page() {
  const { register, handleSubmit, errors, isSubmitting, onReset } =
    useJobForm();

  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    if (!file) {
      setError("Por favor, selecione um arquivo.");
      return;
    }

    setError(null);
    setOutput(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job", JSON.stringify(data));

    try {
      const response = await fetch("/api/cv/candidate-job-match", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao processar os dados");
      }

      setOutput(result.output || "Perfil gerado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro ao processar: " + error.message);
    }
  };

  return (
    <>
      <h1 className="flex items-center gap-3 text-3xl font-bold mb-1">
        <FileHeart color={"#2b7fff"} /> Match de Candidato x Vaga
      </h1>

      <p className="text-muted-foreground w-3xl">
        Realize análises estratégicas de currículos com base em vagas
        específicas. Receba relatórios profissionais que avaliam a aderência do
        candidato, destacam pontos fortes e oportunidades de melhoria, e ajudam
        a tomar decisões mais assertivas no recrutamento.
      </p>

      <FileInput handleFileChange={handleFileChange}>
        Adicionar currículo do candidato
      </FileInput>

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
