"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/mode-toggle";

import { Users, Star, Sparkles, LogIn } from "lucide-react";

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

      {/* Principais Funcionalidades */}
      <section className="container mx-auto px-6 py-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold"
        >
          Principais funcionalidades
        </motion.h2>

        <p className="text-muted-foreground mt-2">
          Ferramentas completas para recrutadores e candidatos — projetadas para
          decisões mais rápidas e assertivas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {modules.map((m) => (
            <Card className="p-4 shadow-sm" key={m.title}>
              <div className="flex items-start gap-4">
                <div>
                  <Label className="text-md font-semibold">
                    <m.icon size={17} color="#c27aff" /> {m.title}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {m.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Prova Social */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold">Prova social</h2>
          <p className="text-muted-foreground mt-2">
            O que clientes e profissionais dizem sobre nós.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="">JD</div>
                <div>
                  <p className="font-semibold text-emerald-500">
                    Juliana Duarte — Head de Talentos
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    "Reduzimos em 40% o tempo de contratação graças ao Match de
                    Candidato x Vaga. O painel é incrivelmente prático."
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="">RM</div>
                <div>
                  <p className="font-semibold text-emerald-500">
                    Rafael Moreira — Recrutador
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    "O Analisador de Currículos entrega insights de qualidade e
                    me ajuda a priorizar candidatos com confiança."
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 flex flex-col justify-center items-start gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/logos/company-a.svg"
                  alt="company"
                  width={72}
                  height={32}
                />
                <Image
                  src="/logos/company-b.svg"
                  alt="company"
                  width={72}
                  height={32}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Empresas que confiam em nós.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container flex flex-col items-center mx-auto px-6 py-8">
        <h2 className="text-4xl font-bold mb-3">Planos</h2>
        <p className="text-muted-foreground mt-2">
          Planos pensados para times de todos os tamanhos — escale quando
          precisar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl">
          <Card className="p-6 border-dashed border-2 shadow-none">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Starter</h3>
                <p className="text-sm text-muted-foreground">
                  Ideal para freelancers e pequenos times
                </p>
              </div>
              <div className="text-2xl font-bold">R$0</div>
            </div>
            <ul className="mt-4 text-sm space-y-2 text-muted-foreground">
              <li>Explorador de Vagas</li>
              <li>Analisador de Currículos (limitado)</li>
              <li>Suporte por e-mail</li>
            </ul>
            <Button className="w-full mt-auto">Comece grátis</Button>
          </Card>

          <Card className="p-6 border-purple-400 border-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Growth</h3>
                <p className="text-sm text-muted-foreground">
                  Para times que precisam automatizar recrutamento
                </p>
              </div>
              <div className="text-2xl font-bold">R$199/mês</div>
            </div>
            <ul className="mt-4 text-sm space-y-2 text-muted-foreground">
              <li>Tudo do Starter</li>
              <li>Analisador + Revisor ilimitado</li>
              <li>Match de Candidato x Vaga</li>
            </ul>
            <Button className="mt-6 w-full">Assinar Growth</Button>
          </Card>

          {/* 
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Growth</h3>
                <p className="text-sm text-muted-foreground">
                  Para times que precisam automatizar recrutamento
                </p>
              </div>
              <div className="text-2xl font-bold">R$199/mês</div>
            </div>
            <ul className="mt-4 text-sm space-y-2 text-muted-foreground">
              <li>Tudo do Starter</li>
              <li>Analisador + Revisor ilimitado</li>
              <li>Match de Candidato x Vaga</li>
            </ul>
            <Button className="mt-6 w-full">Assinar Growth</Button>
          </Card> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-4 py-12 border-t">
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
