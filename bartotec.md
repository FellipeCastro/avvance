# Desenvolver uma página de geração de perguntas de entrevistas de emprego geradas por IA

> Setup básico: Clone o repositório + npm install + renomeie o arquivo .env.example para .env.local + variáveis de ambiente adequadas

### O que deve conter:

Formulário:

- Campo para adicionar os detalhes da vaga (/components/job-form)
- Campo para adicionar o arquivo do currículo (/components/ui/file-input)
- Botão para enviar (/components/ui/submit-button)

Output:

- Perguntas e alternativas sobre o conteúdo do currícul do candidato e as habilidades dele, condizentes para o que a vaga pede (podem ser 10 - 12 perguntas, com 3 - 4 alternativas) (este componente você deve criar)

- Após verificar as respostas, gerar um output de score do candidato, mostrando seu desempenho e os conteúdos que precisa se aprofundar, mostrando pontos que o desfavorecem para a aderencia da vaga. (o componente que eu uso para renderizar MarkDown é /components/ui/markdown-component)

### Exemplo de página que utiliza os components que mencionei:

```js
"use client";

import { useState } from "react";
import { useJobForm } from "@/hooks/use-job-form";

import { FileHeart } from "lucide-react";

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
      const response = await fetch("/api/modules/candidate-job-match", {
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

      <SavedJobs />

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
```
