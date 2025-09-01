"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Briefcase,
  TextSearchIcon,
  MapPin,
  Grid3x3,
  Baby,
  Calendar,
} from "lucide-react";

import { sortByRelevance } from "@/lib/utils";

import PageTemplate from "@/components/dashboard/page-template";
import SubmitButton from "@/components/submit-button";
import JobCard from "@/components/job-card";

export default function Page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onSubmit = async (jobsData) => {
    if (errors.keywords) return;

    const filterJobs = (rawJobs) => {
      const hiddenJobs = JSON.parse(localStorage.getItem("hiddenJobs")) || [];

      if (hiddenJobs.length > 0) {
        return rawJobs.filter(
          (job) => !hiddenJobs.some((h) => h.id === job.id)
        );
      }

      return rawJobs;
    };

    jobsData = {
      ...jobsData,
      hours_old: parseInt(jobsData.hours_old),
      use_tor: true,
      linkedin_fetch_description: true,
    };

    try {
      setLoading(true);
      const response = await fetch("/api/jobs/jobspy/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobsData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Ooops! Tivemos um erro ao tentar buscar vagas, tente novamente mais tarde!"
        );
      }

      setError(false);
      setJobs(sortByRelevance(filterJobs(data.jobs)));
    } catch (error) {
      console.log(error);
      setError(
        `Ooops! Tivemos um erro ao tentar buscar vagas, tente novamente mais tarde!`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (job) => {
    if (!job?.id) {
      console.error("Job inválido.");
      return;
    }

    const hiddenJobs = JSON.parse(localStorage.getItem("hiddenJobs")) || [];
    localStorage.setItem("hiddenJobs", JSON.stringify([...hiddenJobs, job]));

    setJobs((prevJobs) => prevJobs.filter((j) => j.id !== job.id));
  };

  return (
    <PageTemplate
      title={"Explorador de Vagas"}
      icon={<Briefcase />}
      description={
        "Explore oportunidades de trabalho com recursos avançados de filtragem e acesso direto às principais plataformas, facilitando a identificação das vagas mais alinhadas ao seu perfil."
      }
      error={error}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-xl space-y-8">
        <div className="space-y-8">
          <div className="grid gap-3">
            <Label htmlFor="search_term" className="flex items-center gap-2">
              <TextSearchIcon size={15} /> Palavras-chave:
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="search_term"
              placeholder="palavras-chave:"
              {...register("search_term", { required: true })}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin size={15} /> Localização:
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="location"
              placeholder="localização:"
              {...register("location", { required: true })}
            />
          </div>

          <div className="grid gap-4">
            <Label className="flex items-center gap-2">
              <Baby size={15} />
              Nivel das vagas:
            </Label>
            <RadioGroup
              defaultValue="junior"
              className="text-1xl flex flex-wrap gap-8"
            >
              {[
                ["junior", "Júnior"],
                ["mid-level", "Pleno"],
                ["senior", "Sênior"],
                ["manager", "Gerente"],
                ["executive", "Executivo"],
              ].map(([value, label]) => (
                <div key={value} className="group flex items-center gap-2">
                  <RadioGroupItem
                    className="transition duration-200 group-hover:border-zinc-700"
                    value={value}
                    id={value}
                    {...register("job_level")}
                  />
                  <Label
                    className="cursor-pointer text-zinc-500 transition duration-200 group-hover:text-zinc-700"
                    htmlFor={value}
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="grid gap-4">
          <Label className="flex items-center gap-2">
            <Grid3x3 size={15} /> Tipo das vagas:
          </Label>

          <RadioGroup
            defaultValue="fulltime"
            className="text-1xl flex flex-wrap gap-8"
          >
            {[
              ["fulltime", "Tempo Integral"],
              ["parttime", "Meio Período"],
              ["intership", "Estágio"],
              ["contract", "Contrato"],
            ].map(([value, label]) => (
              <div key={value} className="group flex items-center gap-2">
                <RadioGroupItem
                  className="transition duration-200 group-hover:border-zinc-700"
                  value={value}
                  id={value}
                  {...register("job_type")}
                />
                <Label
                  className="cursor-pointer text-zinc-500 transition duration-200 group-hover:text-zinc-700"
                  htmlFor={value}
                >
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="grid gap-4">
          <Label className="flex items-center gap-2">
            <Calendar size={15} />
            Buscar vagas de:
          </Label>
          <RadioGroup
            defaultValue={24}
            className="text-1xl flex flex-wrap gap-8"
          >
            {[
              [24, "Hoje"],
              [48, "Até um dia"],
              [72, "Até três dias"],
              [168, "Até uma semana"],
            ].map(([value, label]) => (
              <div key={value} className="group flex items-center gap-2">
                <RadioGroupItem
                  className="transition duration-200 group-hover:border-zinc-700"
                  value={value}
                  id={value}
                  {...register("hours_old")}
                />
                <Label
                  className="cursor-pointer text-zinc-500 transition duration-200 group-hover:text-zinc-700"
                  htmlFor={value}
                >
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <SubmitButton loading={loading} />
          <Button variant={"ghost"} onClick={() => reset()}>
            Limpar Campos
          </Button>
        </div>
      </form>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {jobs.length > 0 &&
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onDelete={handleDelete} />
          ))}
      </section>
    </PageTemplate>
  );
}
