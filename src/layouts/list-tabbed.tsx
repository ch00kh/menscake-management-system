import { PlusIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilterBar } from "@/components/erp/filter-bar"
import { Page, Surface } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { RecordTable, TableFooterBar } from "@/components/erp/record-table"
import { rows, STATUSES } from "@/data/mock"

const TABS = ["전체", ...STATUSES]

export function ListTabbed() {
  return (
    <Page>
      <PageHeader
        breadcrumb={["업무", "상태별 목록"]}
        title="상태별 목록"
        description="상태·구분처럼 상호배타적인 축으로 목록을 나눌 때 씁니다."
        actions={
          <Button size="sm">
            <PlusIcon data-icon="inline-start" />
            신규 등록
          </Button>
        }
      />
      <Tabs defaultValue="전체" className="min-h-0 flex-1">
        <TabsList variant="line">
          {TABS.map((tab) => {
            const count =
              tab === "전체"
                ? rows.length
                : rows.filter((r) => r.status === tab).length
            return (
              <TabsTrigger key={tab} value={tab}>
                {tab}
                <Badge variant="secondary">{count}</Badge>
              </TabsTrigger>
            )
          })}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent key={tab} value={tab} className="flex flex-col gap-4">
            <FilterBar />
            <Surface>
              <RecordTable
                data={
                  tab === "전체" ? rows : rows.filter((r) => r.status === tab)
                }
              />
              <TableFooterBar />
            </Surface>
          </TabsContent>
        ))}
      </Tabs>
    </Page>
  )
}
