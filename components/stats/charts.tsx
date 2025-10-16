"use client";

import * as React from "react";
import useSWR from "swr";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Cotizacion } from "@/types/cotizacion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Ruler, Wallet } from "lucide-react";

const fetcher = async (): Promise<Cotizacion[]> => {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.from("cotizaciones").select("*");
  if (error) throw error;
  return (data || []) as Cotizacion[];
};

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function StatsChartsInteractive() {
  const { data, isLoading } = useSWR("cotizaciones-stats", fetcher);
  const items = data || [];

  const totalClientes = new Set(items.map((i) => i.correo)).size;
  const promedioArea = items.length
    ? Math.round(
        items.reduce((a, b) => a + (b.area_total || 0), 0) / items.length
      )
    : 0;

  const byMonth = new Map<string, number>();
  items.forEach((i) => {
    const key = monthKey(i.created_at || new Date().toISOString());
    byMonth.set(key, (byMonth.get(key) || 0) + (i.total_general || 0));
  });

  const chartData = Array.from(byMonth.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, total]) => ({ date: month, total_general: total }));

  const chartConfig = {
    total_general: {
      label: "Total Mensual (COP)",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const totalGeneral = chartData.reduce((a, b) => a + b.total_general, 0);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Estadísticas</h2>
        <p className="text-muted-foreground">
          Resumen de métricas y totales mensuales.
        </p>
      </div>

      {/* Tarjetas métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <MetricCard
          title="Total de clientes"
          value={isLoading ? <Skeleton className="h-6 w-12" /> : totalClientes}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Promedio de área"
          value={isLoading ? <Skeleton className="h-6 w-20" /> : `${promedioArea} m²`}
          icon={<Ruler className="h-5 w-5" />}
        />
        <MetricCard
          title="Total general histórico"
          value={
            isLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              totalGeneral.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0,
              })
            )
          }
          icon={<Wallet className="h-5 w-5" />}
        />
      </div>

      {/* Gráfica */}
      <Card className="border border-muted/40 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Estadísticas de Ventas</CardTitle>
          <CardDescription>
            Total mensual de cotizaciones (últimos meses)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[250px] w-full" />
          ) : (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[280px] w-full"
            >
              <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                  tickFormatter={(value) => {
                    const [y, m] = value.split("-");
                    return `${m}/${y.slice(2)}`;
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="total_general"
                      labelFormatter={(value) => {
                        const [y, m] = value.split("-");
                        return `${m}/${y}`;
                      }}
                    />
                  }
                />
                <Bar
                  dataKey="total_general"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Subcomponente para tarjetas limpias ---
function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border border-muted/40 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-md bg-primary/10 text-primary">{icon}</div>
      </CardContent>
    </Card>
  );
}
