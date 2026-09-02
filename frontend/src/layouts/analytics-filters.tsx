import { FilterIcon, SlidersHorizontalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  ComparisonChart,
  CompositionChart,
  TrendChart,
} from "@/components/erp/charts"
import { Page } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { StatCard } from "@/components/erp/stats"
import { CATEGORIES, kpis, OWNERS } from "@/data/mock"

export function AnalyticsFilters() {
  return (
    <Page>
      <PageHeader
        breadcrumb={["현황", "분석"]}
        title="분석"
        description="조건을 바꿔가며 여러 각도로 보는 화면. 필터는 상단에 고정하고 아래에 차트를 배치합니다."
        actions={
          <Button variant="outline" size="sm">
            <SlidersHorizontalIcon data-icon="inline-start" />
            지표 선택
          </Button>
        }
      />

      <div className="sticky top-0 z-10 flex flex-col gap-3 rounded-lg border bg-card/95 p-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup defaultValue={["월"]} variant="outline" size="sm">
            <ToggleGroupItem value="일">일</ToggleGroupItem>
            <ToggleGroupItem value="주">주</ToggleGroupItem>
            <ToggleGroupItem value="월">월</ToggleGroupItem>
            <ToggleGroupItem value="분기">분기</ToggleGroupItem>
          </ToggleGroup>
          <Separator orientation="vertical" className="h-6" />
          <NativeSelect size="sm" className="w-32">
            <NativeSelectOption value="">전체 구분</NativeSelectOption>
            {CATEGORIES.map((c) => (
              <NativeSelectOption key={c} value={c}>
                {c}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect size="sm" className="w-32">
            <NativeSelectOption value="">전체 담당자</NativeSelectOption>
            {OWNERS.map((o) => (
              <NativeSelectOption key={o} value={o}>
                {o}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Button size="sm" className="ms-auto">
            <FilterIcon data-icon="inline-start" />
            적용
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">적용된 조건</span>
          <Badge variant="secondary">기간 2026-01 ~ 2026-08</Badge>
          <Badge variant="secondary">구분 A그룹</Badge>
          <Badge variant="secondary">상태 진행</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            trend={kpi.trend}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>추이</CardTitle>
          <CardDescription>선택한 조건 기준 계획 대비 실적</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendChart className="h-72" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>구간 비교</CardTitle>
          </CardHeader>
          <CardContent>
            <ComparisonChart className="h-64" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>구성비</CardTitle>
          </CardHeader>
          <CardContent>
            <CompositionChart />
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}
