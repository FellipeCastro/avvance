"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Validação com Zod
const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  salary: z.string().optional(),
  description: z.string().min(1, "Descrição é obrigatória"),
  jobLevel: z.enum(["junior", "mid-level", "senior", "manager", "executive"]),
});

export function useJobForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      salary: "",
      description: "",
      jobLevel: "junior",
    },
  });

  const onReset = () => reset();

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onReset,
  };
}
