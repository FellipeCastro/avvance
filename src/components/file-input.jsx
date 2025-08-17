"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function FileInput({ children, handleFileChange }) {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState(null);
    const [error, setError] = useState(null);
    const maxFileSize = 15 * 1024 * 1024; // 15MB em bytes

    const handleChange = (event) => {
        const file = event.target.files[0];
        setError(null); // Limpar erros anteriores

        if (file) {
            // Validação do tipo
            if (file.type !== "application/pdf") {
                setError("Por favor, selecione um arquivo PDF.");
                event.target.value = null; // Limpa o input
                setFileName(null);
                return;
            }

            // Validação de tamanho
            if (file.size > maxFileSize) {
                setError("O arquivo deve ter no máximo 15MB.");
                event.target.value = null;
                setFileName(null);
                return;
            }

            setFileName(file.name);
            handleFileChange(event);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                className="hidden"
                onChange={handleChange}
            />

            <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                <Upload className="w-4 h-4 mr-1" />
                {children ? children : "Selecionar Arquivo"}
            </Button>

            {fileName && (
                <p className="text-sm text-gray-500 mt-2.5">{fileName}</p>
            )}

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
}
