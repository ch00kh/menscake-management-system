import type * as React from "react"
import { GripVerticalIcon, PlusIcon, SettingsIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { CompositionChart, TrendChart } from "@/components/erp/charts"
import { Page } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { StatCard } from "@/components/erp/stats"
import { kpis, rows, statusVariant } from "@/data/mock"

function Widget({
  title,
  span,
  children,
}: {
  title: string
  span?: string
  children: React.ReactNode
}) {
  return (
    <Card className={cn("gap-3", span)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <GripVerticalIcon className="size-4 cursor-grab text-muted-foreground" />
          {title}
        </CardTitle>
        <CardAction>
          <Button variant="ghost" size="icon-xs" aria-label="위젯 설정">
            <SettingsIcon />
          </Button>
          <Button variant="ghost" size="icon-xs" aria-label="위젯 제거">
            <XIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function WidgetBoard() {
  return (
    <Page>
      <PageHeader
        breadcrumb={["현황", "내 화면"]}
        title="위젯 보드"
        description="사용자가 직접 구성하는 개인 홈. 위젯 단위로 추가·제거·재배치합니다."
        actions={
          <Button size="sm">
            <PlusIcon data-icon="inline-start" />
            위젯 추가
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.slice(0, 2).map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            trend={kpi.trend}
          />
        ))}
        <Widget title="추이" span="md:col-span-2 xl:col-span-2 xl:row-span-2">
          <TrendChart className="h-48" />
        </Widget>
        <Widget title="내 할 일" span="md:col-span-1 xl:col-span-2">
          <div className="flex flex-col">
            {rows.slice(0, 5).map((row) => (
              <div key={row.id} className="flex flex-col gap-1 py-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm">{row.name}</span>
                  <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </Widget>
        <Widget title="구성비">
          <CompositionChart className="max-w-40" />
        </Widget>
        <Widget title="비어 있는 슬롯">
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PlusIcon />
              </EmptyMedia>
              <EmptyTitle>위젯을 추가하세요</EmptyTitle>
              <EmptyDescription>
                자주 보는 지표를 이 자리에 배치할 수 있습니다.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm">
                목록에서 선택
              </Button>
            </EmptyContent>
          </Empty>
        </Widget>
      </div>
    </Page>
  )
}
