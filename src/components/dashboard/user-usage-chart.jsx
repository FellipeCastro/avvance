"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

// 🔹 Geração de dados fictícios
function generateUsageData(days) {
  const data = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dayLabel = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
    data.push({
      date: dayLabel,
      usoGeral: Math.floor(Math.random() * 10) + 5,
      vagasBuscadas: Math.floor(Math.random() * 8) + 2,
      analisesCurriculo: Math.floor(Math.random() * 6) + 1,
      treinosEntrevista: Math.floor(Math.random() * 4) + 1,
    });
  }
  return data;
}

// 🔹 Configuração de cores e rótulos
const chartConfig = {
  usoGeral: { label: "Uso Geral", color: "#7C3AED" }, // roxo
  vagasBuscadas: { label: "Vagas Buscadas", color: "#10B981" }, // verde
  analisesCurriculo: { label: "Análises de Currículo", color: "#FBBF24" }, // amarelo
  treinosEntrevista: { label: "Treinos de Entrevista", color: "#3B82F6" }, // azul
};

export function UserUsageChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  const [data, setData] = React.useState(generateUsageData(30));
  const [chartType, setChartType] = React.useState("area"); // 🔹 JSX puro, apenas string

  React.useEffect(() => {
    if (timeRange === "7d") setData(generateUsageData(7));
    else if (timeRange === "30d") setData(generateUsageData(30));
    else if (timeRange === "90d") setData(generateUsageData(90));
  }, [timeRange]);

  const renderChart = () => {
    if (chartType === "bar") {
      return (
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {Object.keys(chartConfig).map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={chartConfig[key].color}
              radius={4}
            />
          ))}
        </BarChart>
      );
    }

    if (chartType === "line") {
      return (
        <LineChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {Object.keys(chartConfig).map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={chartConfig[key].color}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      );
    }

    // default: area chart
    return (
      <AreaChart data={data}>
        <defs>
          {Object.entries(chartConfig).map(([key, conf]) => (
            <linearGradient
              key={key}
              id={`fill${key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={conf.color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={conf.color} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.keys(chartConfig).map((key) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={chartConfig[key].color}
            fill={`url(#fill${key})`}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    );
  };

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle>📈 Seu uso na plataforma</CardTitle>
          <CardDescription>
            Acompanhe suas atividades nos últimos dias
          </CardDescription>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Controle de período */}
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden sm:flex"
          >
            <ToggleGroupItem value="7d">7 dias</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 dias</ToggleGroupItem>
            <ToggleGroupItem value="90d">90 dias</ToggleGroupItem>
          </ToggleGroup>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="sm:hidden w-28" size="sm">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>

          {/* Controle de tipo de gráfico */}
          <ToggleGroup
            type="single"
            value={chartType}
            onValueChange={setChartType}
            variant="outline"
          >
            <ToggleGroupItem value="area">Área</ToggleGroupItem>
            <ToggleGroupItem value="line">Linha</ToggleGroupItem>
            <ToggleGroupItem value="bar">Barra</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>

      <CardContent className="pt-4 sm:pt-6">
        <ChartContainer config={chartConfig} className="w-full h-[280px]">
          {renderChart()}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
