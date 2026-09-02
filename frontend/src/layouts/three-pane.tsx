import * as React from "react"
import { ChevronRightIcon, FolderIcon, PlusIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FullPage } from "@/components/erp/page"
import { PaneHeader } from "@/components/erp/page-header"
import { DescriptionList } from "@/components/erp/stats"
import { CATEGORIES, formatNumber, rows, statusVariant, formatWon } from "@/data/mock"

export function ThreePane() {
  const [category, setCategory] = React.useState(CATEGORIES[0])
  const list = rows.filter((r) => r.category === category)
  const [activeId, setActiveId] = React.useState(list[0]?.id)
  const active = rows.find((r) => r.id === activeId) ?? list[0]

  return (
    <FullPage className="flex-row">
      <nav className="hidden w-52 shrink-0 flex-col border-r md:flex">
        <PaneHeader title="분류" />
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-0.5 p-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                  c === category && "bg-accent font-medium text-accent-foreground"
                )}
              >
                <FolderIcon className="size-4 text-muted-foreground" />
                <span className="flex-1 truncate">{c}</span>
                <ChevronRightIcon className="size-3.5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </ScrollArea>
      </nav>

      <section className="flex w-full min-w-0 flex-col border-r lg:w-80 lg:shrink-0">
        <PaneHeader
          title={category}
          count={list.length + "건"}
          actions={
            <Button variant="ghost" size="icon-sm" aria-label="신규">
              <PlusIcon />
            </Button>
          }
        />
        <div className="border-b p-2">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="이 분류에서 검색" />
          </InputGroup>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {list.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setActiveId(row.id)}
                className={cn(
                  "flex flex-col gap-1 border-b px-3 py-2.5 text-left hover:bg-accent/50",
                  row.id === active?.id && "bg-accent"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{row.name}</span>
                  <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {row.code} · {row.owner}
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </section>

      <section className="hidden min-w-0 flex-1 flex-col lg:flex">
        <PaneHeader
          title={active?.name ?? "선택된 항목 없음"}
          actions={<Button size="sm">수정</Button>}
        />
        <ScrollArea className="flex-1">
          <div className="p-4">
            {active ? (
              <DescriptionList
                columns={2}
                items={[
                  { label: "문서번호", value: active.code },
                  { label: "구분", value: active.category },
                  { label: "담당자", value: active.owner },
                  { label: "상태", value: active.status },
                  { label: "수량", value: formatNumber(active.quantity) },
                  { label: "금액", value: formatWon(active.amount) },
                  { label: "등록일", value: active.date },
                  { label: "진행률", value: active.progress + "%" },
                ]}
              />
            ) : null}
          </div>
        </ScrollArea>
      </section>
    </FullPage>
  )
}
