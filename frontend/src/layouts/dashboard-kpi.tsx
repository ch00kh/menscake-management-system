import { CalendarIcon, DownloadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { CompositionChart, TrendChart } from "@/components/erp/charts"
import { Page, Surface } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { RecordTable } from "@/components/erp/record-table"
import { StatCard } from "@/components/erp/stats"
import { kpis, rows } from "@/data/mock"

export function DashboardKpi() {
  return (
    <Page>
      <PageHeader
        breadcrumb={["현황", "대시보드"]}
        title="업무 대시보드"
        description="KPI 4장 + 추이 차트 + 최근 목록. 대부분의 ERP 첫 화면이 이 형태입니다."
        actions={
          <>
            <NativeSelect size="sm" className="w-32">
              <NativeSelectOption>최근 7일</NativeSelectOption>
              <NativeSelectOption>최근 30일</NativeSelectOption>
              <NativeSelectOption>이번 분기</NativeSelectOption>
            </NativeSelect>
            <Button variant="outline" size="sm">
              <CalendarIcon data-icon="inline-start" />
              기간 지정
            </Button>
            <Button variant="outline" size="sm">
              <DownloadIcon data-icon="inline-start" />
              내보내기
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            trend={kpi.trend}
            hint="전월 대비"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>계획 대비 실적</CardTitle>
            <CardDescription>월별 추이 · 최근 8개월</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart className="h-64" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>구분별 비중</CardTitle>
            <CardDescription>당월 기준</CardDescription>
          </CardHeader>
          <CardContent>
            <CompositionChart />
          </CardContent>
        </Card>
      </div>

      <Card className="gap-0 py-0">
        <CardHeader className="py-4">
          <CardTitle>최근 처리 내역</CardTitle>
          <CardDescription>최근 8건</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Surface className="rounded-none border-x-0 border-b-0">
            <RecordTable
              data={rows.slice(0, 8)}
              selectable={false}
              columns={["code", "name", "owner", "status", "amount", "date"]}
            />
          </Surface>
        </CardContent>
      </Card>
    </Page>
  )
}
