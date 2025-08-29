import { useState } from "react";

import { Bookmark, Loader2 } from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import CopyButton from "../copy-button";
import MarkdownComponent from "../ui/markdown-component";

export default function AiOutput({ output, file, setError }) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
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
    output && (
      <>
        <div className="flex gap-3 flex-wrap">
          <CopyButton text={output} />
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Bookmark />
                Salvar
              </>
            )}
          </Button>
        </div>

        <Card className="p-8">
          <MarkdownComponent>{output}</MarkdownComponent>
        </Card>
      </>
    )
  );
}
