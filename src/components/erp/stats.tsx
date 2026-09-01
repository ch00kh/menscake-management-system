import type * as React from "react"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function StatCard({
  label,
  value,
  delta,
  trend = "up",
  hint,
  className,
}: {
  label: string
  value: string
  delta?: string
  trend?: "up" | "down"
  hint?: string
  className?: string
}) {
  const TrendIcon = trend === "up" ? TrendingUpIcon : TrendingDownIcon

  return (
    <Card className={cn("gap-2", className)}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        {delta ? (
          <Badge variant="outline">
            <TrendIcon />
            {delta}
          </Badge>
        ) : null}
        {hint ? (
          <span className="truncate text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </CardContent>
    </Card>
  )
}

/** 상세 화면에서 라벨/값을 나열하는 정의형 목록. */
export function DescriptionList({
  items,
  columns = 2,
  className,
}: {
  items: { label: string; value: React.ReactNode }[]
  columns?: 1 | 2 | 3
  className?: string
}) {
  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="text-sm font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
