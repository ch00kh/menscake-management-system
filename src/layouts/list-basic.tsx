import { DownloadIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { FilterBar } from "@/components/erp/filter-bar"
import { Page, Surface } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { RecordTable, TableFooterBar } from "@/components/erp/record-table"

export function ListBasic() {
  return (
    <Page>
      <PageHeader
        breadcrumb={["기준정보", "표준 목록"]}
        title="표준 목록"
        description="가장 기본이 되는 조회 화면입니다. 검색바 · 표 · 페이지네이션으로만 구성합니다."
        actions={
          <>
            <ButtonGroup>
              <Button variant="outline" size="sm">
                <DownloadIcon data-icon="inline-start" />
                내보내기
              </Button>
              <Button variant="outline" size="sm">
                <Trash2Icon data-icon="inline-start" />
                삭제
              </Button>
            </ButtonGroup>
            <Button size="sm">
              <PlusIcon data-icon="inline-start" />
              신규 등록
            </Button>
          </>
        }
      />
      <FilterBar />
      <Surface>
        <RecordTable />
        <TableFooterBar />
      </Surface>
    </Page>
  )
}
