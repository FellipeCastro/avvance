"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";

import Loader from "./ui/loader";
import JobCard from "./job-card";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/jobs");
        if (!response.ok)
          throw new Error(data.error || "Erro ao buscar dados.");

        const data = await response.json();
        setJobs(data);
        setError(null);
      } catch (error) {
        setError("Um erro aconteceu: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Vagas Salvas</Button>
        </DialogTrigger>

        <DialogContent
          className={"h-7xl max-h-[75vh] min-w-6xl flex-wrap flex"}
        >
          <DialogTitle>Vagas Salvas</DialogTitle>
          <Separator />

          {error && <p className="text-red-400">{error}</p>}
          {loading && <Loader />}

          <ScrollArea className={"h-[60vh]"}>
            <div className="grid grid-cols-4 gap-3">
              {jobs &&
                jobs.map((job, index) => (
                  <JobCard job={job} key={`${job.job_id}${index}`}></JobCard>
                ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
