import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";
import path from "path";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function getDatetime() {
    const now = new Date();

    const format = (num) => num.toString().padStart(2, "0");

    const day = format(now.getDate());
    const month = format(now.getMonth() + 1);
    const year = now.getFullYear();

    const hours = format(now.getHours());
    const minutes = format(now.getMinutes());
    const seconds = format(now.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Ordena um array de objetos com base na relevância dos campos.
 *
 * Ordem de prioridade:
 * 1. Objetos que possuem ambos os campos: "location" e "date_posted".
 * 2. Objetos que possuem "location" mas estão sem "date_posted".
 * 3. Objetos que possuem "date_posted" mas estão sem "location".
 * 4. Objetos sem ambos os campos.
 *
 * @param {Array<Object>} items - Array de objetos a ser ordenado.
 * @returns {Array<Object>} Array ordenado de acordo com a relevância.
 */
export function sortByRelevance(items) {
    const isValid = (value) => {
        // Considera não apenas null/undefined, mas também string vazia, array vazio etc.
        if (value == null) return false;
        if (typeof value === "string") return value.trim() !== "";
        if (Array.isArray(value)) return value.length > 0;
        return true;
    };

    const getRank = (item) => {
        const hasLocation = isValid(item.location);
        const hasDatePosted = isValid(item.date_posted);

        if (hasLocation && hasDatePosted) return 0;
        if (hasLocation && !hasDatePosted) return 1;
        if (!hasLocation && hasDatePosted) return 2;
        return 3;
    };

    return items.sort((a, b) => getRank(a) - getRank(b));
}

export function generateFilePath(file) {
    const now = new Date();
    const [day, month, year] = now.toLocaleDateString("pt-BR").split("/");
    const ext = path.extname(file.name);
    const baseName = path
        .basename(file.name, ext)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    return `uploads/${year}/${month}/${day}/${crypto.randomUUID()}-${baseName}${ext}`;
}
