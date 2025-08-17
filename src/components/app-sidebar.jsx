import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { modules } from "@/config/modules";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar";

import { Bookmark, Home } from "lucide-react";

import { ModeToggle } from "./mode-toggle";
import NavUser from "./nav-user";
import ClientOnly from "./ui/client-only";

export async function AppSidebar() {
    const user = await currentUser();

    if (!user) {
        return <h1>Você não tem permissão para acessar esta página.</h1>;
    }

    const userData = {
        name: user.fullName || "Usuário",
        email:
            user.primaryEmailAddress?.emailAddress || "sem-email@example.com",
        avatar: user.imageUrl,
    };

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-zinc-400">
                        TalentAI
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={"/dashboard"}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="text-blue-500 flex justify-center items-center rounded-full p-1 bg-secondary">
                                            <Home size={16} />
                                        </span>
                                        Página Inicial
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {modules.map((module) => {
                                return (
                                    <SidebarMenuItem key={module.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={module.url}
                                                className="flex items-center gap-3"
                                            >
                                                <span className="text-blue-500 flex justify-center items-center rounded-full p-1 bg-secondary">
                                                    <module.icon size={16} />
                                                </span>
                                                {module.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={"/dashboard/saved"}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="text-blue-500 flex justify-center items-center rounded-full p-1 bg-secondary">
                                            <Bookmark size={16} />
                                        </span>
                                        Salvos
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <ClientOnly>
                    <ModeToggle />
                </ClientOnly>
                <NavUser user={userData} />
            </SidebarFooter>
        </Sidebar>
    );
}
