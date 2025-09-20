"use client";

import { useState } from "react";
import { UserCheck } from "lucide-react";

import { useJobForm } from "@/hooks/use-job-form";
import JobForm from "@/components/job-form";
import PageTemplate from "@/components/dashboard/page-template";
import AiOutput from "@/components/dashboard/ai-output";

export default function Page() {
  const { register, handleSubmit, errors, isSubmitting, onReset } =
    useJobForm();

  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setError(null);
    setOutput(null);

    try {
      const response = await fetch("/api/modules/profile-generator", {
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
    <PageTemplate
      title={"Gerador de Perfis"}
      icon={<UserCheck />}
      description={
        "Crie perfis otimizados a partir de uma vaga, receba sugestões inteligentes de competências e habilidades, e analise candidatos com insights precisos para encontrar a combinação ideal para a sua necessidade."
      }
      error={error}
    >
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
