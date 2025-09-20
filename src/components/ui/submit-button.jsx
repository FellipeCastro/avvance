import { Loader2, Sparkles } from "lucide-react";
import { Button } from "./button";

export default function SubmitButton({ loading, text, textLoading }) {
  return (
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
          {textLoading || "Carregando"}
        </>
      ) : (
        <>
          <Sparkles />
          {text || "Enviar"}
        </>
      )}
    </Button>
  );
}
