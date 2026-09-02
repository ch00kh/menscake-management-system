import { ArrowLeftIcon, PencilIcon, PrinterIcon, Share2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Page, Surface } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { RecordTable } from "@/components/erp/record-table"
import { DescriptionList } from "@/components/erp/stats"
import { num, rows, statusVariant, won } from "@/data/mock"

const record = rows[0]

export function DetailTabs() {
  return (
    <Page>
      <PageHeader
        breadcrumb={["업무", "목록", record.code]}
        title={record.name}
        description={record.code + " · " + record.category + " · " + record.owner}
        actions={
          <>
            <Button variant="outline" size="sm">
              <ArrowLeftIcon data-icon="inline-start" />
              목록
            </Button>
            <Button variant="outline" size="sm">
              <PrinterIcon data-icon="inline-start" />
              인쇄
            </Button>
            <Button size="sm">
              <PencilIcon data-icon="inline-start" />
              수정
            </Button>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant[record.status]}>{record.status}</Badge>
          <Badge variant="outline">{record.category}</Badge>
          <span className="text-xs text-muted-foreground tabular-nums">
            최종 수정 2026-08-28 14:20
          </span>
        </div>
      </PageHeader>

      <Tabs defaultValue="개요">
        <TabsList variant="line">
          <TabsTrigger value="개요">개요</TabsTrigger>
          <TabsTrigger value="명세">명세</TabsTrigger>
          <TabsTrigger value="첨부">첨부</TabsTrigger>
          <TabsTrigger value="이력">이력</TabsTrigger>
        </TabsList>
        <TabsContent value="개요" className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <DescriptionList
                columns={3}
                items={[
                  { label: "문서번호", value: record.code },
                  { label: "명칭", value: record.name },
                  { label: "구분", value: record.category },
                  { label: "담당자", value: record.owner },
                  { label: "수량", value: num(record.qty) },
                  { label: "금액", value: won(record.amount) },
                  { label: "등록일", value: record.date },
                  { label: "진행률", value: record.progress + "%" },
                  { label: "상태", value: record.status },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="명세">
          <Surface>
            <RecordTable
              data={rows.slice(0, 6)}
              selectable={false}
              withTotal
              columns={["code", "name", "qty", "amount"]}
            />
          </Surface>
        </TabsContent>
        <TabsContent value="첨부">
          <Empty className="rounded-lg border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Share2Icon />
              </EmptyMedia>
              <EmptyTitle>첨부된 파일이 없습니다</EmptyTitle>
              <EmptyDescription>
                근거 자료를 등록하면 이 영역에 표시됩니다.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </TabsContent>
        <TabsContent value="이력">
          <Surface>
            <RecordTable
              data={rows.slice(6, 12)}
              selectable={false}
              columns={["date", "owner", "name", "status"]}
            />
          </Surface>
        </TabsContent>
      </Tabs>
    </Page>
  )
}
