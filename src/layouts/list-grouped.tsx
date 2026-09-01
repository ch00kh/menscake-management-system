import { PlusIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FilterBar } from "@/components/erp/filter-bar"
import { Page, Surface } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { RecordTable } from "@/components/erp/record-table"
import { CATEGORIES, rows, won } from "@/data/mock"

export function ListGrouped() {
  return (
    <Page>
      <PageHeader
        breadcrumb={["업무", "그룹 목록"]}
        title="그룹 목록"
        description="분류별 소계가 중요할 때. 그룹 헤더에 건수·합계를 얹고 펼쳐서 상세를 봅니다."
        actions={
          <Button size="sm">
            <PlusIcon data-icon="inline-start" />
            신규 등록
          </Button>
        }
      />
      <FilterBar />
      <Accordion defaultValue={[CATEGORIES[0]]} className="flex flex-col gap-2">
        {CATEGORIES.map((category) => {
          const group = rows.filter((r) => r.category === category)
          const sum = group.reduce((acc, r) => acc + r.amount, 0)
          return (
            <AccordionItem
              key={category}
              value={category}
              className="rounded-lg border bg-card px-3"
            >
              <AccordionTrigger>
                <span className="flex flex-1 items-center gap-2">
                  {category}
                  <Badge variant="secondary">{group.length}건</Badge>
                  <span className="ms-auto pe-2 text-xs text-muted-foreground tabular-nums">
                    {won(sum)}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Surface className="mb-3">
                  <RecordTable
                    data={group}
                    selectable={false}
                    columns={["code", "name", "owner", "status", "qty", "amount"]}
                  />
                </Surface>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </Page>
  )
}
