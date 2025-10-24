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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link2, FileText, Trash2, Loader2 } from "lucide-react";

import MarkdownComponent from "./ui/markdown-component";
import Loader from "./ui/loader";

export default function CvCard({ cv, onDelete }) {
  const [saved, setSaved] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleDelete = async () => {
    if (saved) {
      await handleUnsave();
    }

    onDelete(cv);
  };

  const handleUnsave = async () => {
    if (!saved) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cv", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cv.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setSaved(false);
      } else {
        setErrorMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Um erro ocorreu...");
    }

    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="gap-5 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <FileText size={20} className="text-purple-500" />
              <span>{cv.created_at}</span>
            </CardTitle>
          </CardHeader>
          <Separator className="mb-1" />
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <embed
              src={cv.file_url}
              type="application/pdf"
              className="w-full h-32 rounded-md border"
            />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <a
              href={cv.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-purple-400 text-sm"
            >
              <Link2
                size={18}
                className="transition duration-200 group-hover:-translate-x-0.5"
              />
              <span className="transition duration-200 group-hover:translate-x-0.5">
                Acessar currículo
              </span>
            </a>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent
        className={
          "max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[80vh] rounded-2xl p-6 sm:p-8"
        }
      >
        <ScrollArea className="p-3">
          <div className="w-full max-h-[70vh] space-y-4">
            <DialogHeader className="p-2 flex flex-col gap-4 items-center">
              <div className="flex gap-2 justify-center mb-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="hover:-translate-y-0.5"
                    >
                      <Trash2 />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-sm pr-10">
                    <DialogHeader>
                      {errorMessage && (
                        <div className="text-sm text-red-700 py-1.5 px-3 rounded">
                          {errorMessage}
                        </div>
                      )}

                      {loading && <Loader />}

                      <DialogTitle className="text-1xl">
                        ⚠️ Você tem certeza que quer excluir?
                      </DialogTitle>
                    </DialogHeader>

                    <div className="flex gap-2">
                      <DialogClose asChild>
                        <Button variant="outline" disabled={loading}>
                          Não
                        </Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        className={`hover:-translate-y-0.5`}
                        onClick={handleDelete}
                        disabled={loading}
                      >
                        <Trash2 />
                        Sim
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <DialogTitle className="text-center">{cv.created_at}</DialogTitle>

              <a
                href={cv.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-fit flex justify-center items-center gap-2 text-purple-400 text-sm cursor-pointer"
              >
                <Link2
                  size={18}
                  className="transition duration-200 group-hover:-translate-x-0.5"
                />
                <span className="transition duration-200 group-hover:translate-x-0.5">
                  Acessar currículo
                </span>
              </a>
            </DialogHeader>
            <Separator />
            <div className="space-y-6 text-sm text-muted-foreground">
              <embed
                src={cv.file_url}
                type="application/pdf"
                className="w-full h-64 rounded-md border"
              />
              <MarkdownComponent>{cv.analysis}</MarkdownComponent>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
