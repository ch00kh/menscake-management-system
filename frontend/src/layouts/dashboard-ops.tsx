import { AlertTriangleIcon, CircleDotIcon, RefreshCwIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ComparisonChart } from "@/components/erp/charts"
import { FullPage } from "@/components/erp/page"
import { PaneHeader } from "@/components/erp/page-header"
import { formatNumber, rows, statusVariant, formatWon } from "@/data/mock"

export function DashboardOps() {
  return (
    <FullPage className="lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col">
        <PaneHeader
          title="실시간 운영 현황"
          count="10초마다 갱신"
          actions={
            <Button variant="outline" size="sm">
              <RefreshCwIcon data-icon="inline-start" />
              새로고침
            </Button>
          }
        />
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-4">
            <Alert>
              <AlertTriangleIcon />
              <AlertTitle>지연 건 27건</AlertTitle>
              <AlertDescription>
                기준 시간을 초과한 건이 있습니다. 담당자 배정을 확인하세요.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {[
                { label: "가동률", value: 86 },
                { label: "처리율", value: 72 },
                { label: "적재율", value: 54 },
                { label: "정시율", value: 93 },
              ].map((metric) => (
                <Card key={metric.label}>
                  <CardContent>
                    <Progress value={metric.value} className="flex flex-col gap-2">
                      <div className="flex items-baseline justify-between">
                        <ProgressLabel>{metric.label}</ProgressLabel>
                        <ProgressValue className="text-sm font-medium tabular-nums" />
                      </div>
                      <ProgressTrack>
                        <ProgressIndicator />
                      </ProgressTrack>
                    </Progress>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>구간별 처리량</CardTitle>
                <CardDescription>계획 대비 실적</CardDescription>
              </CardHeader>
              <CardContent>
                <ComparisonChart className="h-72" />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>

      <aside className="flex w-full shrink-0 flex-col border-t lg:w-80 lg:border-t-0 lg:border-l">
        <PaneHeader title="처리 대기열" count={rows.length + "건"} />
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {rows.map((row) => (
              <div key={row.id} className="flex flex-col gap-1.5 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <CircleDotIcon className="size-3 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm font-medium">
                      {row.name}
                    </span>
                  </span>
                  <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
                  <span>{row.owner}</span>
                  <span>
                    {formatNumber(row.quantity)} · {formatWon(row.amount)}
                  </span>
                </div>
                <Separator className="mt-1" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>
    </FullPage>
  )
}
