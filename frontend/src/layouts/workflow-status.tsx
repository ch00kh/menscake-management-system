import { CheckIcon, ClockIcon, CircleIcon, PlayIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Page, Surface } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { DescriptionList } from "@/components/erp/stats"
import { rows, timeline, formatWon } from "@/data/mock"

const record = rows[1]

const stages = [
  { name: "접수", state: "done", at: "2026-08-24 08:30", who: "정과장" },
  { name: "검토", state: "done", at: "2026-08-25 11:12", who: "최주임" },
  { name: "승인", state: "current", at: "진행 중", who: "박선임" },
  { name: "실행", state: "todo", at: "-", who: "이책임" },
  { name: "완료", state: "todo", at: "-", who: "김담당" },
] as const

export function WorkflowStatus() {
  return (
    <Page>
      <PageHeader
        breadcrumb={["업무", "진행 현황", record.code]}
        title="진행 현황"
        description="단계가 정해진 업무의 현재 위치와 이력을 한 화면에서 보여 줍니다."
        actions={
          <Button size="sm">
            <PlayIcon data-icon="inline-start" />
            다음 단계로
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>처리 단계</CardTitle>
          <CardDescription>5단계 중 3단계 진행 중</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col gap-0 md:flex-row md:items-start">
            {stages.map((stage, i) => (
              <li key={stage.name} className="flex flex-1 gap-3 md:flex-col md:gap-2">
                <div className="flex flex-col items-center md:w-full md:flex-row">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border",
                      stage.state === "done" &&
                        "border-primary bg-primary text-primary-foreground",
                      stage.state === "current" && "border-primary text-primary",
                      stage.state === "todo" && "text-muted-foreground"
                    )}
                  >
                    {stage.state === "done" ? (
                      <CheckIcon className="size-4" />
                    ) : stage.state === "current" ? (
                      <ClockIcon className="size-4" />
                    ) : (
                      <CircleIcon className="size-3" />
                    )}
                  </span>
                  {i < stages.length - 1 ? (
                    <Separator
                      orientation="vertical"
                      className="min-h-10 md:hidden"
                    />
                  ) : null}
                  {i < stages.length - 1 ? (
                    <Separator className="hidden flex-1 md:block" />
                  ) : null}
                </div>
                <div className="flex flex-col gap-0.5 pb-6 md:pb-0">
                  <span
                    className={cn(
                      "text-sm",
                      stage.state === "todo"
                        ? "text-muted-foreground"
                        : "font-medium"
                    )}
                  >
                    {stage.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stage.who}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {stage.at}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>대상 문서</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList
              columns={1}
              items={[
                { label: "문서번호", value: record.code },
                { label: "명칭", value: record.name },
                { label: "구분", value: record.category },
                { label: "금액", value: formatWon(record.amount) },
                {
                  label: "상태",
                  value: <Badge variant="default">{record.status}</Badge>,
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="py-4">
            <CardTitle>처리 이력</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Surface className="rounded-none border-x-0 border-b-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-44">일시</TableHead>
                    <TableHead className="w-28">처리자</TableHead>
                    <TableHead>내용</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeline.map((entry) => (
                    <TableRow key={entry.at}>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {entry.at}
                      </TableCell>
                      <TableCell>{entry.who}</TableCell>
                      <TableCell>{entry.what}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Surface>
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}
