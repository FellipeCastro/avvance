"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

import { useCvForm } from "@/hooks/use-cv-form";
import CvBuilderForm from "@/components/cv-builder-form";
import PageTemplate from "@/components/dashboard/page-template";
import AiOutput from "@/components/dashboard/ai-output";

export default function Page() {
  const { register, handleSubmit, errors, isSubmitting, onReset } =
    useCvForm();

  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setError(null);
    setOutput(null);

    try {
      const response = await fetch("/api/modules/cv-builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cv: data }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao gerar o currículo");
      }

      setOutput(result.response);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao conectar com o servidor");
    }
  };

  return (
    <PageTemplate
      title="Criador de Currículos"
      icon={<FileText />}
      description="Preencha o formulário com suas informações profissionais e gere automaticamente um currículo formatado e pronto para download em PDF."
      error={error}
    >
      <CvBuilderForm
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
