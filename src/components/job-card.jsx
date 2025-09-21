"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";

import { Link2, Trash2, Star } from "lucide-react";

import MarkdownComponent from "@/components/ui/markdown-component";
import Loader from "./ui/loader";

const JobCardHeader = ({ job }) => (
  <CardHeader>
    <CardTitle>{job.title}</CardTitle>
  </CardHeader>
);

const JobCardContent = ({ job }) => (
  <CardContent className="space-y-1 text-sm text-muted-foreground">
    <div className="space-y-2">
      <p className="flex items-center gap-2 font-bold">🏢 {job.company}</p>
      <p className="flex items-center gap-2">
        📍 {job.location || "Não informada"}
      </p>
      <p className="mt-3 text-zinc-400">
        {job.date_posted || "Data não informada"}
      </p>
    </div>
  </CardContent>
);

const JobLink = ({ url }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group w-fit flex justify-center items-center gap-2 text-blue-400 text-sm"
      >
        <Link2
          size={18}
          className="transition duration-200 group-hover:-translate-x-0"
        />
        <span className="transition duration-200 group-hover:translate-x-1">
          Acessar vaga
        </span>
      </a>
    </TooltipTrigger>
    <TooltipContent>
      <p className="">{url}</p>
    </TooltipContent>
  </Tooltip>
);

const StatusMessage = ({ type, message }) => (
  <div
    className={`text-sm ${
      type === "success" ? "text-green-700" : "text-red-700"
    } py-1.5 px-3 rounded`}
  >
    {message}
  </div>
);

const ActionButtons = ({ saved, loading, onSave, onDelete }) => (
  <div className="flex gap-2 justify-center mb-1">
    <Button
      variant="ghost"
      size="icon"
      disabled={loading}
      className={`${
        saved ? "border-orange-300" : ""
      } hover:border-orange-300 hover:-translate-y-0.5`}
      onClick={onSave}
    >
      <Star color="orange" fill={saved ? "orange" : "none"} />
    </Button>

    <DeleteButton loading={loading} onDelete={onDelete} />
  </div>
);

const DeleteButton = ({ loading, onDelete }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button size="icon" variant="destructive" disabled={loading}>
        <Trash2 />
      </Button>
    </DialogTrigger>
    <DialogContent className="w-sm pr-10">
      <DialogHeader>
        <DialogTitle className="text-1xl">
          ⚠️ Você tem certeza que quer excluir essa vaga?
        </DialogTitle>
      </DialogHeader>
      <div className="flex gap-2">
        <DialogClose asChild>
          <Button variant="outline" disabled={loading}>
            Não
          </Button>
        </DialogClose>
        <Button variant="destructive" onClick={onDelete} disabled={loading}>
          <Trash2 />
          Sim
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default function JobCard({ job, onDelete, isSaved, children }) {
  const [saved, setSaved] = useState(isSaved);
  const [state, setState] = useState({
    loading: false,
    successMessage: "",
    errorMessage: "",
  });

  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (saved) {
      await handleUnsave();
      return;
    }

    updateState({ loading: true, successMessage: "", errorMessage: "" });

    try {
      const response = await fetch("/api/jobs/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });

      const data = await response.json();

      if (response.ok) {
        updateState({ successMessage: "Vaga salva!" });
        setSaved(true);
      } else {
        updateState({ errorMessage: `Error: ${data.error}` });
      }
    } catch (error) {
      console.log(error);
      updateState({ errorMessage: "Um erro ocorreu..." });
    }

    updateState({ loading: false });
    setTimeout(() => updateState({ successMessage: "" }), 3000);
    setTimeout(() => updateState({ errorMessage: "" }), 3000);
  };

  const handleUnsave = async () => {
    if (!saved) return;

    updateState({ loading: true, successMessage: "", errorMessage: "" });

    try {
      const response = await fetch("/api/jobs/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: job.id }),
      });

      const data = await response.json();

      if (response.ok) {
        updateState({ successMessage: "Vaga removida dos salvos!" });
        setSaved(false);
      } else {
        updateState({ errorMessage: `Error: ${data.error}` });
      }
    } catch (error) {
      console.log(error);
      updateState({ errorMessage: "Um erro ocorreu..." });
    }

    updateState({ loading: false });
    setTimeout(() => updateState({ successMessage: "" }), 3000);
    setTimeout(() => updateState({ errorMessage: "" }), 3000);
  };

  const handleDelete = async () => {
    if (saved) {
      await handleUnsave();
    }
    onDelete(job);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className={`relative gap-3 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5 ${
            saved ? "border-orange-300" : ""
          }`}
        >
          <JobCardHeader job={job} saved={saved} />
          <Separator className="mb-1" />
          <JobCardContent job={job} />
          <CardFooter className="mt-auto flex flex-wrap justify-between items-center">
            <JobLink url={job.job_url} />
            {children}
          </CardFooter>
        </Card>
      </DialogTrigger>

      <DialogContent>
        <ScrollArea>
          <div className="max-w-lg w-full max-h-[70vh] space-y-4">
            <DialogHeader className="p-2 flex flex-col gap-4 items-center">
              {state.successMessage && (
                <StatusMessage type="success" message={state.successMessage} />
              )}

              {state.errorMessage && (
                <StatusMessage type="error" message={state.errorMessage} />
              )}

              {state.loading && <Loader />}

              <ActionButtons
                saved={saved}
                loading={state.loading}
                onSave={handleSave}
                onDelete={handleDelete}
              />

              <DialogTitle className="text-center">{job.title}</DialogTitle>

              <JobLink url={job.job_url} />
            </DialogHeader>

            <Separator />

            <div className="space-y-6 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p className="flex items-center gap-2 font-bold">
                  🏢
                  {job.company}
                </p>
                <p className="flex items-center gap-2">
                  📍
                  {job.location || "Não informada"}
                </p>
                <p className="mt-3 text-zinc-400">
                  {job.date_posted || "Data não informada"}
                </p>
              </div>

              <MarkdownComponent>{job.description}</MarkdownComponent>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
