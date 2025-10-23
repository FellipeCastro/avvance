"use client";

import { useState } from "react";
import { useJobForm } from "@/hooks/use-job-form";

import { MessageSquareText } from "lucide-react";

import PageTemplate from "@/components/dashboard/page-template";
import FileInput from "@/components/ui/file-input";
import JobForm from "@/components/job-form";
import AiOutput from "@/components/dashboard/ai-output";
import SavedJobs from "@/components/saved-jobs";

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
      const response = await fetch("/api/modules/interview-simulator", {
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
      title={"Simulador de entrevista de emprego"}
      icon={<MessageSquareText />}
      description={
        "Submeta um currículo e uma vaga para gerar um quiz de entrevista interativo. Responda perguntas baseadas no seu perfil e receba um score detalhado, com pontos fortes, GAPs de competência e recomendações de estudo para a vaga."
      }
      error={error}
    >
      <FileInput setFile={setFile} />

      <SavedJobs />

      <JobForm
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onReset={onReset}
      />

      <AiOutput output={output} quiz={true} />
    </PageTemplate>
  );
}
