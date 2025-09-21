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

import { ModeToggle } from "./ui/mode-toggle";
import NavUser from "./nav-user";
import ClientOnly from "./ui/client-only";

export async function AppSidebar() {
  const user = await currentUser();

  if (!user) {
    return <h1>Você não tem permissão para acessar esta página.</h1>;
  }

  const userData = {
    name: user.fullName || "Usuário",
    email: user.primaryEmailAddress?.emailAddress || "sem-email@example.com",
    avatar: user.imageUrl,
  };

  return (
    <Sidebar className="p-3 w-fit overflow-hidden">
      <div className="h-full rounded-lg flex flex-col justify-between overflow-hidden">
        <SidebarContent className="bg-transparent">
          <SidebarGroup>
            <SidebarGroupLabel className="text-white">
              TalentAI
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={"transition duration-200 hover:bg-white/20"}
                  >
                    <Link
                      href={"/dashboard"}
                      className="flex items-center"
                    >
                      <span className="text-blue-700 flex justify-center items-center">
                        <Home size={16} />
                      </span>
                      Página Inicial
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {modules.map((module) => {
                  return (
                    <SidebarMenuItem className={""} key={module.title}>
                      <SidebarMenuButton
                        asChild
                        className={"transition duration-200 hover:bg-white/20"}
                      >
                        <Link
                          href={module.url}
                          className="flex items-center text-sm "
                        >
                          <span className="text-blue-700 flex justify-center items-center">
                            <module.icon size={16} />
                          </span>

                          {module.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={"transition duration-200 hover:bg-white/20"}
                  >
                    <Link
                      href={"/dashboard/saved"}
                      className="text-sm flex items-center"                    >
                      <span className="text-blue-700 flex justify-center items-center">
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
        <SidebarFooter className="bg-transparent">
          <ClientOnly>
            <ModeToggle />
          </ClientOnly>
          <NavUser user={userData} />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
