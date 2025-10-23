"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 🔹 Validação com Zod
const experienceSchema = z.object({
  position: z.string().min(1, "O cargo é obrigatório"),
  company: z.string().min(1, "O nome da empresa é obrigatório"),
  description: z.string().optional(),
});

const educationSchema = z.object({
  degree: z.string().min(1, "O curso é obrigatório"),
  institution: z.string().min(1, "A instituição é obrigatória"),
});

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().min(1, "O e-mail é obrigatório").email("E-mail inválido"),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  experiences: z
    .array(experienceSchema)
    .min(1, "Adicione ao menos uma experiência profissional"),
  educations: z
    .array(educationSchema)
    .min(1, "Adicione ao menos uma formação acadêmica"),
  languages: z.string().optional(),
});

export function useCvForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      experiences: [{ position: "", company: "", description: "" }],
      educations: [{ degree: "", institution: "" }],
      languages: "",
    },
  });

  const onReset = () =>
    reset({
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      experiences: [{ position: "", company: "", description: "" }],
      educations: [{ degree: "", institution: "" }],
      languages: "",
    });

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onReset,
  };
}
