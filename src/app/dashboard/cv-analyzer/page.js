"use client";

import { useState } from "react";

import { TextSearch } from "lucide-react";

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

      const response = await fetch("/api/modules/analyzer", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload ou análise");
      }

      const result = await response.json();
      setOutput(
        result.output ||
          "Parece que não foi possível concluir o processamento, tente novamente!"
      );
      setError(null);
    } catch (error) {
      setError("Erro ao processar a requisição: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate
      icon={<TextSearch />}
      title={"Analisador de Currículos"}
      description={
        "Envie currículos para uma IA e receba insights estratégicos juntamente com descrições e pontuações assertivas para conhecer melhor o candidato, sua área de atuação e seu posicionamento no mercado de trabalho."
      }
      error={error}
    >
      <form onSubmit={(event) => handleSubmit(event)} className="space-y-6">
        <FileInput setFile={setFile} />
        <SubmitButton loading={loading} />
      </form>

      <AiOutput output={output} file={file} setError={setError} />
    </PageTemplate>
  );
}
