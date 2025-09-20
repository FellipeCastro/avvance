"use client";

import { useState } from "react";

import { User } from "lucide-react";

import PageTemplate from "@/components/dashboard/page-template";
import SubmitButton from "@/components/ui/submit-button";
import FileInput from "@/components/ui/file-input";
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

      const response = await fetch("/api/modules/linkedin-generator", {
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
    <PageTemplate
      title={"Gerador de Linkedin"}
      icon={<User />}
      description={
        "Faça o upload de um currículo e transforme-o automaticamente em um perfil profissional, no estilo LinkedIn, pronto para maximizar oportunidades, altamente otimizado para os altos padrões do mercado."
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
