import * as React from "react"
import { CheckIcon, ForwardIcon, InboxIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FullPage, Surface } from "@/components/erp/page"
import { PaneHeader } from "@/components/erp/page-header"
import { RecordTable } from "@/components/erp/record-table"
import { DescriptionList } from "@/components/erp/stats"
import { num, rows, statusVariant, timeline, won } from "@/data/mock"

export function ApprovalInbox() {
  const [activeId, setActiveId] = React.useState(rows[0].id)
  const active = rows.find((r) => r.id === activeId) ?? rows[0]

  return (
    <FullPage className="lg:flex-row">
      <section className="flex w-full shrink-0 flex-col border-b lg:w-96 lg:border-b-0 lg:border-r">
        <PaneHeader title="결재함" count={rows.length + "건"} />
        <div className="border-b px-3 py-2">
          <Tabs defaultValue="수신">
            <TabsList variant="line">
              <TabsTrigger value="수신">
                <InboxIcon />
                수신
              </TabsTrigger>
              <TabsTrigger value="상신">상신</TabsTrigger>
              <TabsTrigger value="완료">완료</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {rows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setActiveId(row.id)}
                className={cn(
                  "flex gap-3 border-b px-3 py-3 text-left hover:bg-accent/50",
                  row.id === activeId && "bg-accent"
                )}
              >
                <Avatar className="size-8">
                  <AvatarFallback>{row.owner.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                      {row.name}
                    </span>
                    <Badge variant={statusVariant[row.status]}>
                      {row.status}
                    </Badge>
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {row.owner} · {row.date} · {won(row.amount)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </section>

      <section className="flex min-w-0 flex-1 flex-col">
        <PaneHeader
          title={active.name}
          count={active.code}
          actions={
            <>
              <Button variant="outline" size="sm">
                <ForwardIcon data-icon="inline-start" />
                전결 위임
              </Button>
              <Button variant="outline" size="sm">
                <XIcon data-icon="inline-start" />
                반려
              </Button>
              <Button size="sm">
                <CheckIcon data-icon="inline-start" />
                승인
              </Button>
            </>
          }
        />
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-5 p-4">
            <DescriptionList
              columns={3}
              items={[
                { label: "구분", value: active.category },
                { label: "기안자", value: active.owner },
                { label: "기안일", value: active.date },
                { label: "수량", value: num(active.qty) },
                { label: "금액", value: won(active.amount) },
                { label: "상태", value: active.status },
              ]}
            />
            <Separator />
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">명세</h3>
              <Surface>
                <RecordTable
                  data={rows.slice(0, 4)}
                  selectable={false}
                  withTotal
                  columns={["code", "name", "qty", "amount"]}
                />
              </Surface>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">결재선</h3>
              <div className="flex flex-wrap items-center gap-2">
                {timeline.slice(0, 4).map((entry, i) => (
                  <React.Fragment key={entry.at}>
                    <div className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5">
                      <Avatar className="size-6">
                        <AvatarFallback>{entry.who.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{entry.who}</span>
                        <span className="text-[0.7rem] text-muted-foreground">
                          {i === 0 ? "승인 대기" : "승인"}
                        </span>
                      </div>
                    </div>
                    {i < 3 ? (
                      <Separator className="w-4 shrink-0" />
                    ) : null}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">결재 의견</h3>
              <Textarea rows={3} placeholder="승인/반려 사유를 입력하세요." />
            </div>
          </div>
        </ScrollArea>
      </section>
    </FullPage>
  )
}
