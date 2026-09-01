import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { composition, monthly } from "@/data/mock"

const planActualConfig = {
  plan: { label: "계획", color: "var(--chart-1)" },
  actual: { label: "실적", color: "var(--chart-2)" },
} satisfies ChartConfig

export function TrendChart({ className }: { className?: string }) {
  return (
    <ChartContainer config={planActualConfig} className={cn("w-full", className)}>
      <AreaChart data={monthly} margin={{ left: 4, right: 4, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="plan"
          type="monotone"
          fill="var(--color-plan)"
          fillOpacity={0.15}
          stroke="var(--color-plan)"
        />
        <Area
          dataKey="actual"
          type="monotone"
          fill="var(--color-actual)"
          fillOpacity={0.25}
          stroke="var(--color-actual)"
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function ComparisonChart({ className }: { className?: string }) {
  return (
    <ChartContainer config={planActualConfig} className={cn("w-full", className)}>
      <BarChart data={monthly} margin={{ left: 4, right: 4, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="plan" fill="var(--color-plan)" radius={4} />
        <Bar dataKey="actual" fill="var(--color-actual)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

const compositionConfig = {
  value: { label: "비중" },
  A그룹: { label: "A그룹", color: "var(--chart-1)" },
  B그룹: { label: "B그룹", color: "var(--chart-2)" },
  C그룹: { label: "C그룹", color: "var(--chart-3)" },
  D그룹: { label: "D그룹", color: "var(--chart-4)" },
} satisfies ChartConfig

export function CompositionChart({ className }: { className?: string }) {
  return (
    <ChartContainer
      config={compositionConfig}
      className={cn("mx-auto aspect-square w-full max-w-64", className)}
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <Pie data={composition} dataKey="value" nameKey="name" innerRadius={56}>
          {composition.map((entry, i) => (
            <Cell key={entry.name} fill={`var(--chart-${i + 1})`} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
      </PieChart>
    </ChartContainer>
  )
}
