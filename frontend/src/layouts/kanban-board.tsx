import { MoreHorizontalIcon, PlusIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { FullPage } from "@/components/erp/page"
import { PaneHeader } from "@/components/erp/page-header"
import { kanban, formatWon } from "@/data/mock"

export function KanbanBoard() {
  return (
    <FullPage>
      <PaneHeader
        title="처리 보드"
        count={kanban.reduce((sum, col) => sum + col.items.length, 0) + "건"}
        actions={
          <Button size="sm">
            <PlusIcon data-icon="inline-start" />
            카드 추가
          </Button>
        }
      />
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex min-h-full gap-4 p-4">
          {kanban.map((column) => (
            <div
              key={column.key}
              className="flex w-72 shrink-0 flex-col gap-3 rounded-lg bg-muted/50 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{column.key}</span>
                  <Badge variant="secondary">{column.items.length}</Badge>
                </div>
                <Button variant="ghost" size="icon-sm" aria-label="열 메뉴">
                  <MoreHorizontalIcon />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {column.items.map((item) => (
                  <Card key={item.id} className="cursor-grab gap-2 py-3">
                    <CardContent className="flex flex-col gap-2">
                      <span className="font-mono text-[0.7rem] text-muted-foreground">
                        {item.code}
                      </span>
                      <span className="text-sm font-medium">{item.name}</span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline">{item.category}</Badge>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {formatWon(item.amount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Avatar className="size-6">
                          <AvatarFallback>{item.owner.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {item.date}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="ghost" size="sm" className="justify-start">
                  <PlusIcon data-icon="inline-start" />
                  추가
                </Button>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </FullPage>
  )
}
