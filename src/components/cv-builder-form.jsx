"use client";

import React, { useState } from "react";
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Languages,
  FileText,
  PlusCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CvBuilderForm({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  onSubmit,
  onReset,
}) {
  const [experiences, setExperiences] = useState([{ id: 1 }]);
  const [educations, setEducations] = useState([{ id: 1 }]);

  const addExperience = () =>
    setExperiences([...experiences, { id: experiences.length + 1 }]);

  const addEducation = () =>
    setEducations([...educations, { id: educations.length + 1 }]);

  const handleReset = () => {
    setExperiences([{ id: 1 }]);
    setEducations([{ id: 1 }]);
    onReset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {/* 🔹 Dados Pessoais */}
      <Label className="flex items-center gap-2 text-lg font-semibold mb-4">
        <User size={18} /> Dados Pessoais
      </Label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">
            Nome Completo: <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Ex: João da Silva"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail size={15} /> E-mail: <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            placeholder="Ex: joao@email.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone size={15} /> Telefone:
          </Label>
          <Input
            id="phone"
            placeholder="(11) 99999-9999"
            {...register("phone")}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin size={15} /> Localização:
          </Label>
          <Input
            id="location"
            placeholder="Cidade / Estado"
            {...register("location")}
          />
        </div>
      </div>

      {/* 🔹 Sobre Mim */}
      <div className="grid gap-3">
        <Label htmlFor="summary" className="flex items-center gap-2">
          <FileText size={15} /> Resumo Profissional:
        </Label>
        <Textarea
          id="summary"
          placeholder="Fale brevemente sobre suas principais habilidades, experiências e objetivos profissionais."
          className="min-h-[150px]"
          {...register("summary")}
        />
      </div>

      {/* 🔹 Experiências Profissionais */}
      <Label className="flex items-center gap-2 text-lg font-semibold">
        <Briefcase size={18} /> Experiência Profissional
      </Label>

      {experiences.map((exp, index) => (
        <div
          key={exp.id}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 border-b pb-4"
        >
          <div className="grid gap-3">
            <Label htmlFor={`experience_${index}_position`}>Cargo:</Label>
            <Input
              id={`experience_${index}_position`}
              placeholder="Ex: Desenvolvedor Front-end"
              {...register(`experiences.${index}.position`)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor={`experience_${index}_company`}>Empresa:</Label>
            <Input
              id={`experience_${index}_company`}
              placeholder="Ex: Empresa XYZ"
              {...register(`experiences.${index}.company`)}
            />
          </div>

          <div className="grid gap-3 md:col-span-2">
            <Label htmlFor={`experience_${index}_description`}>
              Descrição:
            </Label>
            <Textarea
              id={`experience_${index}_description`}
              placeholder="Principais atividades, resultados e tecnologias utilizadas."
              className="min-h-[100px]"
              {...register(`experiences.${index}.description`)}
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addExperience}>
        <PlusCircle size={16} className="mr-2" /> Adicionar Experiência
      </Button>

      {/* 🔹 Formação Acadêmica */}
      <Label className="flex items-center gap-2 text-lg font-semibold mt-8">
        <GraduationCap size={18} /> Formação Acadêmica
      </Label>

      {educations.map((edu, index) => (
        <div
          key={edu.id}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 border-b pb-4"
        >
          <div className="grid gap-3">
            <Label htmlFor={`education_${index}_degree`}>Curso:</Label>
            <Input
              id={`education_${index}_degree`}
              placeholder="Ex: Bacharelado em Ciência da Computação"
              {...register(`educations.${index}.degree`)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor={`education_${index}_institution`}>
              Instituição:
            </Label>
            <Input
              id={`education_${index}_institution`}
              placeholder="Ex: Universidade de São Paulo"
              {...register(`educations.${index}.institution`)}
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addEducation}>
        <PlusCircle size={16} className="mr-2" /> Adicionar Formação
      </Button>

      {/* 🔹 Idiomas */}
      <div className="grid gap-3 mt-8">
        <Label htmlFor="languages" className="flex items-center gap-2">
          <Languages size={15} /> Idiomas:
        </Label>
        <Input
          id="languages"
          placeholder="Ex: Inglês (Avançado), Espanhol (Intermediário)"
          {...register("languages")}
        />
      </div>

      {/* 🔹 Botões */}
      <div className="flex flex-wrap gap-4 items-center mt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Gerando Currículo...
            </>
          ) : (
            "Gerar Currículo"
          )}
        </Button>
        <Button type="button" variant="ghost" onClick={handleReset}>
          Limpar Campos
        </Button>
      </div>
    </form>
  );
}
