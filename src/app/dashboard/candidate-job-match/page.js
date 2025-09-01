"use client";

import { useState } from "react";
import { useJobForm } from "@/hooks/use-job-form";

import { FileHeart } from "lucide-react";

import PageTemplate from "@/components/dashboard/page-template";
import FileInput from "@/components/file-input";
import JobForm from "@/components/job-form";
import AiOutput from "@/components/dashboard/ai-output";

export default function Page() {
  const { register, handleSubmit, errors, isSubmitting, onReset } =
    useJobForm();

  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);

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
    <PageTemplate
      title={"Match de Candidato x Vaga"}
      icon={<FileHeart />}
      description={
        "Realize análises estratégicas de currículos com base em vagas específicas. Receba relatórios profissionais que avaliam a aderência do candidato, destacam pontos fortes e oportunidades de melhoria, e ajudam a tomar decisões mais assertivas no recrutamento."
      }
      error={error}
    >
      <FileInput setFile={setFile} />

      <JobForm
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onReset={onReset}
      />

      <AiOutput output={output} />
    </PageTemplate>
  );
}
