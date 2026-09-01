import { MoreHorizontalIcon, PlusIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress"
import { FilterBar } from "@/components/erp/filter-bar"
import { Page } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { TableFooterBar } from "@/components/erp/record-table"
import { num, rows, statusVariant, won } from "@/data/mock"

export function ListCardGrid() {
  return (
    <Page>
      <PageHeader
        breadcrumb={["업무", "카드 목록"]}
        title="카드 목록"
        description="건별 요약 정보가 많고 표로는 답답한 경우. 진행률·담당자를 한눈에 보여줍니다."
        actions={
          <Button size="sm">
            <PlusIcon data-icon="inline-start" />
            신규 등록
          </Button>
        }
      />
      <FilterBar />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {rows.slice(0, 12).map((row) => (
          <Card key={row.id}>
            <CardHeader>
              <CardDescription className="font-mono text-xs">
                {row.code}
              </CardDescription>
              <CardTitle className="truncate">{row.name}</CardTitle>
              <CardAction>
                <Button variant="ghost" size="icon-sm" aria-label="더보기">
                  <MoreHorizontalIcon />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                <Badge variant="outline">{row.category}</Badge>
              </div>
              <Progress value={row.progress}>
                <ProgressTrack>
                  <ProgressIndicator />
                </ProgressTrack>
              </Progress>
              <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
                <span>수량 {num(row.qty)}</span>
                <span>{won(row.amount)}</span>
              </div>
            </CardContent>
            <CardFooter className="justify-between text-xs text-muted-foreground">
              <span>{row.owner}</span>
              <span className="tabular-nums">{row.date}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
      <TableFooterBar className="rounded-lg border bg-card px-3" />
    </Page>
  )
}
