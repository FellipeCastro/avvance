"use client";

import { useState } from "react";

import { Gavel } from "lucide-react";

import PageTemplate from "@/components/dashboard/page-template";
import FileInput from "@/components/ui/file-input";
import SubmitButton from "@/components/ui/submit-button";
import AiOutput from "@/components/dashboard/ai-output";

export default function Page() {
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/modules/reviewer", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload ou análise");
      }

      const result = await response.json();
      setOutput(result.output || "Análise concluída com sucesso!");
    } catch (error) {
      setError("Erro ao processar a requisição: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate
      icon={<Gavel />}
      title={"Revisor de Currículos"}
      description={
        "Envie currículos para uma IA e receba insights estratégicos juntamente com descrições e pontuações assertivas para otimizá-lo, aumentando as chances de se destacar nas próximas oportunidades."
      }
      error={error}
    >
      <form onSubmit={(event) => handleSubmit(event)} className="space-y-6">
        <FileInput setFile={setFile} />
        <SubmitButton loading={loading} />
      </form>

      <AiOutput output={output} />
    </PageTemplate>
  );
}
