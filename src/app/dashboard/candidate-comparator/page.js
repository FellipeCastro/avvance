"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { FileHeart, UserCheck, Plus, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import FileInput from "@/components/file-input";
import MarkdownComponent from "@/components/ui/markdown-component";
import JobForm from "@/components/job-form";

// Schema de validação (incluindo as infos da vaga + candidatos)
const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  salary: z.string().optional(),
  description: z.string().min(1, "Descrição é obrigatória"),
  jobLevel: z.enum(["junior", "mid-level", "senior", "manager", "executive"]),
  candidates: z.array(
    z.object({
      file: z.any().refine((file) => file instanceof File, {
        message: "Arquivo obrigatório",
      }),
    })
  ),
});

export default function Page() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      salary: "",
      description: "",
      jobLevel: "junior",
      candidates: [{ file: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "candidates",
  });

  const [output, setOutput] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const onSubmit = async (data) => {
    setSubmitError(null);
    setOutput(null);

    try {
      const formData = new FormData();
      formData.append(
        "job",
        JSON.stringify({
          title: data.title,
          salary: data.salary,
          description: data.description,
          jobLevel: data.jobLevel,
        })
      );

      data.candidates.forEach((candidate) => {
        formData.append(`files`, candidate.file);
      });

      const response = await fetch("/api/cv/candidate-comparator", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao processar os dados");
      }

      setOutput(result.output || "Relatório gerado com sucesso!");
    } catch (err) {
      console.error("Erro:", err);
      setSubmitError("Erro ao processar: " + err.message);
    }
  };

  const handleFileChange = (file, index) => {
    setValue(`candidates.${index}.file`, file);
    clearErrors(`candidates.${index}.file`);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <>
      <h1 className="flex items-center gap-3 text-3xl font-bold mb-1">
        <FileHeart color={"#2b7fff"} /> Comparador de Candidatos
      </h1>

      <p className="text-muted-foreground w-3xl mb-6">
        Realize análises estratégicas de currículos com base em uma vaga.
        Compare múltiplos candidatos e receba relatórios precisos para decisões
        mais eficazes.
      </p>

      <section className="mb-2">
        <Label className="flex items-center gap-2 text-lg font-semibold mb-4">
          <UserCheck size={18} /> Candidatos
        </Label>

        <div className="flex flex-wrap gap-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="w-xs">
              <CardHeader className="flex-row items-center justify-between">
                <span className="font-medium">Candidato(a) #{index + 1}</span>
                {fields.length > 1 && (
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => remove(index)}
                    size="icon"
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <FileInput
                  handleFileChange={(e) =>
                    handleFileChange(e.target.files[0], index)
                  }
                >
                  Upload do currículo
                </FileInput>
                {errors?.candidates?.[index]?.file && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.candidates[index].file.message}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ file: null })}
          className="flex items-center gap-2 mt-4"
        >
          <Plus size={16} /> Adicionar Candidato
        </Button>
      </section>

      {/* Sessão de Informações da Vaga com o novo JobForm */}
      <JobForm
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onReset={handleReset}
      />

      {/* Sessão de Candidatos */}

      {/* Exibição de erros ou output */}
      {submitError && <p className="text-red-500 mt-4">Erro: {submitError}</p>}

      {output && (
        <Card className="p-8 mt-6">
          <MarkdownComponent>{output}</MarkdownComponent>
        </Card>
      )}
    </>
  );
}
