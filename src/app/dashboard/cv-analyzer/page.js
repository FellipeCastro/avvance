"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

import PageTemplate from "@/components/dashboard/page-template";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Sparkles, Bookmark, Loader2, TextSearch } from "lucide-react";

import FileInput from "@/components/file-input";
import MarkdownComponent from "@/components/ui/markdown-component";
import CopyButton from "@/components/copy-button";

export default function Page() {
  const { user } = useUser();
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cv/analyzer", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload ou análise");
      }

      const result = await response.json();
      setOutput(
        result.output ||
          "Parece que não foi possível concluir o processamento, tente novamente!"
      );
      setError(null);
    } catch (error) {
      setError("Erro ao processar a requisição: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      setError("Usuário não autenticado.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("analysis", output);

      const response = await fetch("/api/cv/save", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar a análise");
      }

      setError(null);
      alert("Análise salva com sucesso!");
    } catch (error) {
      setError("Erro ao salvar a análise: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTemplate
      icon={<TextSearch />}
      title={"Analisador de Currículos"}
      description={
        "Envie currículos para uma IA e receba insights estratégicos juntamente com descrições e pontuações assertivas para conhecer melhor o candidato, sua área de atuação e seu posicionamento no mercado de trabalho."
      }
      error={error}
    >
      <FileInput setFile={setFile} />

      <form onSubmit={(event) => handleSubmit(event)}>
        <Button
          variant="default"
          size="lg"
          type="submit"
          className="text-1xl font-medium"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Sparkles />
              Analisar
            </>
          )}
        </Button>
      </form>

      {error && <div className="text-red-500">{error}</div>}

      {output && (
        <>
          <div className="flex gap-3 flex-wrap">
            <CopyButton text={output} />
            <Button variant="outline" onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Bookmark /> Salvar
                </>
              )}
            </Button>
            <Button variant="ghost" onClick={handleSubmit}>
              Analisar novamente
            </Button>
          </div>

          <Card className="p-8">
            <MarkdownComponent>{output}</MarkdownComponent>
          </Card>
        </>
      )}
    </PageTemplate>
  );
}
