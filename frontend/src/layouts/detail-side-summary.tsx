import { CheckIcon, PaperclipIcon, SendIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Page, Surface } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { RecordTable } from "@/components/erp/record-table"
import { DescriptionList } from "@/components/erp/stats"
import { formatNumber, rows, statusVariant, timeline, formatWon } from "@/data/mock"

const record = rows[2]

export function DetailSideSummary() {
  return (
    <Page>
      <PageHeader
        breadcrumb={["업무", "목록", record.code]}
        title={record.name}
        description="본문은 넓게, 결정에 필요한 요약과 액션은 오른쪽 고정 열에 둡니다."
        actions={
          <Button size="sm">
            <SendIcon data-icon="inline-start" />
            상신
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <DescriptionList
                items={[
                  { label: "문서번호", value: record.code },
                  { label: "구분", value: record.category },
                  { label: "담당자", value: record.owner },
                  { label: "등록일", value: record.date },
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>명세</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <Surface className="rounded-none border-x-0 border-b-0">
                <RecordTable
                  data={rows.slice(0, 5)}
                  selectable={false}
                  withTotal
                  columns={["code", "name", "quantity", "amount"]}
                />
              </Surface>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>의견</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Textarea placeholder="의견을 입력하세요." rows={3} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <PaperclipIcon data-icon="inline-start" />
                  첨부
                </Button>
                <Button size="sm">등록</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col gap-4">
          <Card className="xl:sticky xl:top-4">
            <CardHeader>
              <CardTitle>요약</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">상태</span>
                <Badge variant={statusVariant[record.status]}>
                  {record.status}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">수량</span>
                <span className="text-sm font-medium tabular-nums">
                  {formatNumber(record.quantity)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">금액</span>
                <span className="text-sm font-medium tabular-nums">
                  {formatWon(record.amount)}
                </span>
              </div>
              <Separator />
              <ItemGroup>
                {timeline.slice(0, 3).map((entry) => (
                  <Item key={entry.at} size="sm">
                    <ItemMedia variant="icon">
                      <CheckIcon />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{entry.who}</ItemTitle>
                      <ItemDescription>{entry.at}</ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            </CardContent>
          </Card>
        </aside>
      </div>
    </Page>
  )
}
