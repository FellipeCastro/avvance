"use client";

import { useUser } from "@clerk/nextjs";
import { modules } from "@/config/modules";
import ModuleCard from "@/components/module-card";
import { Mail } from "lucide-react";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { UserUsageChart } from "@/components/dashboard/user-usage-chart";

// Gerar 30 dias de uso fictício
const generateMonthlyUsageData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dayLabel = `${date.getDate()}/${date.getMonth() + 1}`; // ex: "21/9"
    data.push({
      day: dayLabel,
      usage: Math.floor(Math.random() * 12) + 1, // uso aleatório de 1 a 12
    });
  }
  return data;
};

const monthlyUsageData = generateMonthlyUsageData();

const monthlyUsageChartConfig = {
  usage: { label: "Uso diário", color: "#2563eb" },
};

export default function Page() {
  const { user } = useUser();

  if (!user) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <div className="grid gap-4">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          👋 Olá, {user.firstName || "Usuário"}!
        </h1>
        <p className="flex items-center gap-2 text-sm text-purple-400">
          <Mail size={15} /> {user.primaryEmailAddress.emailAddress}
        </p>
      </div>

      <p className="text-muted-foreground">
        Estamos aqui para ajudar você a dar o próximo passo na sua carreira —
        explore as ferramentas disponíveis!
      </p>

      {/* Gráfico de uso diário - 30 dias */}
      <section className="mt-6 space-y-6">
        {/* <h2 className="text-lg font-medium mb-2 flex items-center gap-2">
          📊 Seu uso nos últimos 30 dias
        </h2> */}

        {/* <ChartContainer
          config={monthlyUsageChartConfig}
          className="max-h-80 w-full"
        >
          <BarChart data={monthlyUsageData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={5}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="usage" fill="#AB47BC" radius={4} />
          </BarChart>
        </ChartContainer> */}

        <UserUsageChart />
      </section>

      {/* Grid de módulos */}
      <section className="grid gap-6 mt-6">
        <h2 className="flex items-center gap-2 text-lg font-medium">
          <span>✨</span> Que tal explorar novas funcionalidades?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modules.map((module) => (
            <ModuleCard key={module.title} module={module} />
          ))}
        </div>
      </section>
    </>
  );
}
