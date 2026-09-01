import { PlusIcon, SlidersHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FilterFields } from "@/components/erp/filter-bar"
import { FullPage } from "@/components/erp/page"
import { PaneHeader } from "@/components/erp/page-header"
import { RecordTable, TableFooterBar } from "@/components/erp/record-table"

export function ListFilterPanel() {
  return (
    <FullPage className="flex-row">
      <aside className="hidden w-64 shrink-0 flex-col border-r lg:flex">
        <PaneHeader
          title="검색 조건"
          actions={
            <Button variant="ghost" size="icon-sm" aria-label="조건 설정">
              <SlidersHorizontalIcon />
            </Button>
          }
        />
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-3">
            <FilterFields />
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                초기화
              </Button>
              <Button size="sm" className="flex-1">
                조회
              </Button>
            </div>
          </div>
        </ScrollArea>
      </aside>
      <section className="flex min-w-0 flex-1 flex-col">
        <PaneHeader
          title="조회 결과"
          count="128건"
          actions={
            <Button size="sm">
              <PlusIcon data-icon="inline-start" />
              신규
            </Button>
          }
        />
        <ScrollArea className="flex-1">
          <RecordTable />
        </ScrollArea>
        <TableFooterBar />
      </section>
    </FullPage>
  )
}
