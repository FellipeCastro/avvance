"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

export default function TopLoader() {
    const pathname = usePathname();

    useEffect(() => {
        NProgress.start();

        // Simula carregamento para rotas instantâneas (Next.js 15 é rápido)
        const timeout = setTimeout(() => {
            NProgress.done();
        }, 300); // ajuste conforme necessidade

        return () => {
            clearTimeout(timeout);
        };
    }, [pathname]);

    return null;
}
