import { ActivityIcon, MessageSquareIcon, PaperclipIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Page } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { DescriptionList, StatCard } from "@/components/erp/stats"
import { num, rows, statusVariant, timeline, won } from "@/data/mock"

const record = rows[4]

export function RecordTimeline() {
  return (
    <Page>
      <PageHeader
        breadcrumb={["업무", "레코드", record.code]}
        title={record.name}
        description="한 건의 처리 경과를 시간 순으로 추적하는 화면입니다."
        actions={
          <Button size="sm">
            <MessageSquareIcon data-icon="inline-start" />
            코멘트
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant[record.status]}>{record.status}</Badge>
          <Badge variant="outline">{record.category}</Badge>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="경과일" value="14일" hint="착수 2026-08-18" />
        <StatCard label="수량" value={num(record.qty)} hint="단위 EA" />
        <StatCard label="금액" value={won(record.amount)} hint="부가세 별도" />
        <StatCard label="진행률" value={record.progress + "%"} hint="4단계 중 3단계" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList
              columns={1}
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
            <CardTitle>활동</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="전체">
              <TabsList variant="line">
                <TabsTrigger value="전체">전체</TabsTrigger>
                <TabsTrigger value="변경">변경</TabsTrigger>
                <TabsTrigger value="첨부">첨부</TabsTrigger>
              </TabsList>
              <TabsContent value="전체">
                <ol className="flex flex-col">
                  {timeline.map((entry, i) => (
                    <li key={entry.at} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <Avatar className="size-8">
                          <AvatarFallback>{entry.who.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        {i < timeline.length - 1 ? (
                          <Separator orientation="vertical" className="flex-1" />
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col gap-1 pb-6">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-medium">{entry.who}</span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {entry.at}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {entry.what}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </TabsContent>
              <TabsContent value="변경">
                <p className="py-6 text-center text-sm text-muted-foreground">
                  <ActivityIcon className="mx-auto mb-2 size-5" />
                  변경 이력만 필터링해서 보여 줍니다.
                </p>
              </TabsContent>
              <TabsContent value="첨부">
                <p className="py-6 text-center text-sm text-muted-foreground">
                  <PaperclipIcon className="mx-auto mb-2 size-5" />
                  등록된 첨부가 없습니다.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}
