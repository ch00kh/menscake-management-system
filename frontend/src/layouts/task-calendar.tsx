import { CalendarPlusIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { FullPage } from "@/components/erp/page"
import { PaneHeader } from "@/components/erp/page-header"
import { rows, statusVariant } from "@/data/mock"

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"]
const DAYS = Array.from({ length: 35 }, (_, i) => i - 2)

export function TaskCalendar() {
  return (
    <FullPage className="lg:flex-row">
      <section className="flex min-w-0 flex-1 flex-col">
        <PaneHeader
          title="2026년 9월"
          actions={
            <>
              <ToggleGroup defaultValue={["월"]} variant="outline" size="sm">
                <ToggleGroupItem value="일">일</ToggleGroupItem>
                <ToggleGroupItem value="주">주</ToggleGroupItem>
                <ToggleGroupItem value="월">월</ToggleGroupItem>
              </ToggleGroup>
              <ButtonGroup>
                <Button variant="outline" size="icon-sm" aria-label="이전 달">
                  <ChevronLeftIcon />
                </Button>
                <Button variant="outline" size="sm">
                  오늘
                </Button>
                <Button variant="outline" size="icon-sm" aria-label="다음 달">
                  <ChevronRightIcon />
                </Button>
              </ButtonGroup>
              <Button size="sm">
                <CalendarPlusIcon data-icon="inline-start" />
                일정 추가
              </Button>
            </>
          }
        />
        <div className="grid shrink-0 grid-cols-7 border-b">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="grid grid-cols-7">
            {DAYS.map((day) => {
              const inMonth = day >= 1 && day <= 30
              const events = rows.filter((r) => Number(r.id) % 7 === day % 7)
              return (
                <div
                  key={day}
                  className={cn(
                    "flex min-h-28 flex-col gap-1 border-r border-b p-1.5",
                    !inMonth && "bg-muted/30"
                  )}
                >
                  <span className="text-xs text-foreground tabular-nums">
                    {inMonth ? day : ""}
                  </span>
                  {inMonth
                    ? events.slice(0, 2).map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          className="truncate rounded bg-primary/10 px-1.5 py-0.5 text-left text-[0.7rem] text-primary hover:bg-primary/20"
                        >
                          {event.name}
                        </button>
                      ))
                    : null}
                  {inMonth && events.length > 2 ? (
                    <span className="px-1.5 text-[0.7rem] text-muted-foreground">
                      +{events.length - 2}건 더보기
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </section>

      <aside className="flex w-full shrink-0 flex-col border-t lg:w-72 lg:border-t-0 lg:border-l">
        <PaneHeader title="이번 주 일정" count={rows.length + "건"} />
        <ScrollArea className="flex-1">
          <div className="flex flex-col p-3">
            {rows.slice(0, 10).map((row) => (
              <div key={row.id} className="flex flex-col gap-1 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{row.name}</span>
                  <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {row.date} · {row.owner}
                </span>
                <Separator className="mt-1" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>
    </FullPage>
  )
}
