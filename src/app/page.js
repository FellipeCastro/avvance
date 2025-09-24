"use client";

import { useClerk } from "@clerk/nextjs";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Sparkles,
  Briefcase,
  FileText,
  UserCheck,
  BarChart2,
  User,
  Compass,
  Building2,
  Star,
  ArrowRight,
} from "lucide-react";

import { modules } from "@/config/modules";

import Link from "next/link";

export default function Page() {
  const { openSignIn, openSignUp } = useClerk();

  return (
    <div className="w-6xl p-8 mt-15 mb-10 mx-auto min-h-screen">
      <main className="mx-auto flex flex-col items-center justify-center gap-8">
        <h1 className="flex items-center gap-3 text-4xl font-bold mb-1">
          <span className="text-blue-400">
            <Sparkles size={25} />
          </span>
          TalentAI
        </h1>
        <p className="w-4xl text-center text-muted-foreground mb-2">
          Navegue pelas ferramentas inovadoras que criamos para simplificar sua
          transição de carreira. De buscas inteligentes a análises detalhadas,
          tudo está aqui para impulsionar o seu sucesso!
        </p>
        <SignedOut>
          <div className="flex gap-4">
            <Button
              onClick={openSignIn}
              // className="bg-red-500 hover:bg-red-600 text-white"
            >
              Entre!
            </Button>
            <Button
              variant="outline"
              onClick={openSignUp}
              // className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Cadastre-se!
            </Button>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex gap-4 items-center">
            <UserButton />
            <Link
              href="/dashboard"
              className="group flex items-center justify-center gap-3 font-medium text-muted-foreground "
            >
              Acessar!
              <ArrowRight
                size={15}
                strokeWidth={3.5}
                className="transition group-hover:translate-x-1.5 group-hover:text-blue-500"
              />
            </Link>
          </div>
        </SignedIn>

        <section className="w-3xl grid grid-cols-3 justify-center gap-4">
          {modules.map((module) => (
            <Card key={module.title}>
              <CardHeader className="space-y-1">
                <span className="text-blue-500">
                  <module.icon size={18} />
                </span>
                <CardTitle className="">{module.title}</CardTitle>
                <CardDescription>{module.shortDescription}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
