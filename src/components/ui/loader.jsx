import { Loader2 } from "lucide-react";

export default function Loader() {
    return (
        <div className="w-fit text-sm flex gap-2 items-center bg-secondary text-muted-foreground px-3 py-1.5 rounded-full">
            <Loader2 size={14} className="animate-spin" />
            <p>Carregando...</p>
        </div>
    );
}
