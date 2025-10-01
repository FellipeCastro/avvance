"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/mode-toggle";

import {
  Users,
  Star,
  Sparkles,
  LogIn,
  CheckCircle2,
  Rocket,
} from "lucide-react";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

import { modules } from "@/config/modules";

export default function LandingPage() {
  const { isSignedIn } = useUser();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background">
      {/* Topbar com Clerk */}
      <header>
        <nav className="container mx-auto flex items-center justify-around px-5 py-3 border-b border-dashed  mt-7">
          <h1 className="flex items-center gap-2 text-3xl font-bold mb-1">
            <span className="text-purple-400">
              <Sparkles size={25} />
            </span>
            Avvance
          </h1>
          <div className="flex gap-2">
            <ModeToggle />
            <Button variant={"outline"}>Cadastre-se</Button>
            <Button>
              <LogIn /> Entrar
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
            Lançamento
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-purple-400 ">Avvance</span>{" "}
            <span className="font-medium">—</span>{" "}
            <span className="">
              O futuro do trabalho começa com o match ideal.
            </span>
          </h1>

          <p className="mt-4 text-lg ">
            Uma plataforma inteligente que conecta candidatos e vagas com
            análises baseadas em IA, otimizações de perfil e insights de mercado
            — reduza tempo de contratação e aumente a assertividade.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button className="px-6 py-3" variant="default">
              Experimente grátis
            </Button>
            <Button className="px-6 py-3" variant="outline">
              Solicitar demonstração
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex items-center gap-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Users size={18} color="#00bc7d" />
              Testado por profissionais experientes
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Star size={18} color="orange" />
              Sucesso em contratações
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-5/12"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold">
              Teste grátis — Para você se debruçar em nossa plataforma.
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Sem cartão. Comece com 7 dias grátis e explore o Explorador de
              Vagas e o Analisador de Currículos.
            </p>

            <form className="mt-4 grid gap-3">
              <div>
                <Label className="text-sm">Nome</Label>
                <Input placeholder="Seu nome" />
              </div>

              <div>
                <Label className="text-sm">E-mail</Label>
                <Input placeholder="seu@exemplo.com" type="email" />
              </div>

              <Button className="w-full">Comece gratuitamente</Button>
            </form>

            <p className="text-xs text-muted-foreground mt-3">
              Ao se inscrever você concorda com nossos termos de serviço e
              política de privacidade.
            </p>
          </Card>
        </motion.div>
      </section>

      <section className="container mx-auto bg-gradient-to-br p-10 from-white/5  to-background via-background rounded-xl">
        <div className="">
          <h2 className="text-4xl font-bold flex gap-4 items-center">
            <span className="text-purple-400">
              <Rocket size={30} />
            </span>
            Uma plataforma, todas as ferramentas
          </h2>
          <p className="mt-8 max-w-5xl text-lg text-muted-foreground">
            Do sourcing à análise de perfil, o Avvance centraliza e otimiza cada
            etapa do seu processo de recrutamento.
          </p>
        </div>

        <div className="mt-7 max-w-6xl grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <Card key={m.title} className={"gap-2"}>
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/40">
                  <m.icon className="text-purple-500" size={24} />
                </div>
                <CardTitle>{m.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {m.shortDescription}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-6 py-15 mt-5 rounded-xl bg-gradient-to-b from-purple-400/50 to-background">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Planos flexíveis para você</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Escolha o plano que se adapta ao seu crescimento. Comece grátis e
            faça o upgrade quando precisar de mais poder.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="flex flex-col p-6">
            <h3 className="text-xl font-semibold">Iniciante</h3>
            <p className="mt-2 text-muted-foreground">
              Perfeito para indivíduos e pequenas equipes começando.
            </p>
            <div className="my-8">
              <span className="text-5xl font-bold">R$0</span>
              <span className="text-muted-foreground"> / para sempre</span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                Explorador de Vagas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                Analisador de Currículos (10/mês)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                Suporte via comunidade
              </li>
            </ul>
            <Button variant="outline" className="mt-auto w-full">
              Comece agora
            </Button>
          </Card>

          <Card className="relative flex flex-col border-2 border-purple-500 p-6">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-purple-500 px-3 py-1 text-sm font-semibold text-white">
              Mais Popular
            </span>
            <h3 className="text-xl font-semibold">Crescimento</h3>
            <p className="mt-2 text-muted-foreground">
              Para equipes que buscam escalar suas contratações.
            </p>
            <div className="my-8">
              <span className="text-5xl font-bold">R$149</span>
              <span className="text-muted-foreground"> /mês</span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={18} className="text-purple-500" />
                Tudo do plano Iniciante, e mais:
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                Análises e revisões ilimitadas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                Match de Candidato x Vaga
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                Gerador de Perfis e LinkedIn
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                Suporte prioritário via e-mail
              </li>
            </ul>
            <Button className="mt-auto w-full">Escolher Crescimento</Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 py-12 border-t border-dashed">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="flex items-center gap-2 text-3xl font-bold mb-1">
                <span className="text-purple-400">
                  <Sparkles size={25} />
                </span>
                Avvance
              </h1>
              <span className="text-sm text-muted-foreground">
                AI · Hiring Intelligence
              </span>
            </div>
            <p className="text-sm mt-2">
              Transformando contratações com inteligência. ©{" "}
              {new Date().getFullYear()} Avvance
            </p>
          </div>

          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="/terms" className="hover:text-primary transition">
                Termos
              </a>
              <a href="/privacy" className="hover:text-primary transition">
                Privacidade
              </a>
              <a href="/contact" className="hover:text-primary transition">
                Contato
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                aria-label="twitter"
                className="text-muted-foreground hover:text-primary transition"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com"
                aria-label="linkedin"
                className="text-muted-foreground hover:text-primary transition"
              >
                LinkedIn
              </a>
            </div>

            <div className="hidden md:block">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <SignInButton mode="modal">
                  <Button>Entrar</Button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
