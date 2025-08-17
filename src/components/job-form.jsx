"use client";

import React, { useState } from "react";
import {
  Loader2,
  Baby,
  BriefcaseBusiness,
  MessageSquareText,
  DollarSign,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function JobForm({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  onSubmit,
  onReset,
}) {
  const [salaryValue, setSalaryValue] = useState("");
  const [jobLevel, setJobLevel] = useState("junior");

  const formatToBrl = (value) => {
    if (!value) return "";

    const cleanValue = value.replace(/[^\d,.-]/g, "").replace(",", ".");
    const number = parseFloat(cleanValue);
    if (isNaN(number)) return "";

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  };

  const handleSalaryChange = (e) => {
    const userInput = e.target.value;
    setSalaryValue(userInput);
    register("salary").onChange({
      target: { name: "salary", value: userInput },
    });
  };

  const handleSalaryBlur = () => {
    if (salaryValue) {
      const formattedValue = formatToBrl(salaryValue);
      setSalaryValue(formattedValue);
    }
  };

  const handleSalaryFocus = () => {
    const rawValue = salaryValue.replace(/[^\d,.-]/g, "");
    setSalaryValue(rawValue);
  };

  const handleReset = () => {
    setJobLevel("junior");
    setSalaryValue("");
    onReset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <Label className="flex items-center gap-2 text-lg font-semibold mb-6">
        <BriefcaseBusiness size={18} /> Informações da vaga
      </Label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid gap-3">
          <Label htmlFor="title" className="flex items-center gap-2">
            <MessageSquareText size={15} /> Título da Vaga:
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Ex: Desenvolvedor Front-end"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="salary" className="flex items-center gap-2">
            <DollarSign size={15} /> Salário (opcional):
          </Label>
          <Input
            id="salary"
            placeholder="Ex: R$ 5.000,00"
            value={salaryValue}
            onChange={handleSalaryChange}
            onBlur={(e) => {
              handleSalaryBlur();
              register("salary").onBlur(e);
            }}
            onFocus={handleSalaryFocus}
          />
          {errors.salary && (
            <p className="text-red-500 text-sm">{errors.salary.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="description" className="flex items-center gap-2">
          <FileText size={15} /> Descrição da Vaga:
          <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Inclua responsabilidades, requisitos, tecnologias, etc."
          className="min-h-[180px] w-2xl"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-6">
        <Label className="flex items-center gap-2">
          <Baby size={15} /> Nível da Vaga:
        </Label>
        <RadioGroup
          value={jobLevel}
          onValueChange={(value) => {
            setJobLevel(value);
            register("jobLevel").onChange({
              target: { name: "jobLevel", value },
            });
          }}
          className="text-1xl flex flex-wrap gap-8"
        >
          {[
            ["junior", "Júnior"],
            ["mid-level", "Pleno"],
            ["senior", "Sênior"],
            ["manager", "Gerente"],
            ["executive", "Executivo"],
          ].map(([value, label]) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem
                value={value}
                id={value}
                {...register("jobLevel")}
              />
              <Label htmlFor={value}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
        {errors.jobLevel && (
          <p className="text-red-500 text-sm">{errors.jobLevel.message}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Gerando...
            </>
          ) : (
            "Gerar"
          )}
        </Button>
        <Button type="button" variant="ghost" onClick={handleReset}>
          Limpar Campos
        </Button>
      </div>
    </form>
  );
}
