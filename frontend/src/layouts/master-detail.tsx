import * as React from "react"
import { PencilIcon, PlusIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FullPage } from "@/components/erp/page"
import { PaneHeader } from "@/components/erp/page-header"
import { RecordTable } from "@/components/erp/record-table"
import { DescriptionList } from "@/components/erp/stats"
import { formatNumber, rows, statusVariant, timeline, formatWon } from "@/data/mock"

export function MasterDetail() {
  const [active, setActive] = React.useState(rows[0])

  return (
    <FullPage>
      <ResizablePanelGroup className="min-h-0 flex-1">
        <ResizablePanel defaultSize="55" minSize="30">
          <div className="flex h-full flex-col">
            <PaneHeader
              title="목록"
              count={rows.length + "건"}
              actions={
                <Button size="sm">
                  <PlusIcon data-icon="inline-start" />
                  신규
                </Button>
              }
            />
            <ScrollArea className="flex-1">
              <RecordTable
                selectable={false}
                columns={["code", "name", "owner", "status"]}
                activeId={active.id}
                onRowClick={setActive}
              />
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="45" minSize="25">
          <div className="flex h-full flex-col">
            <PaneHeader
              title={active.name}
              actions={
                <>
                  <Button variant="outline" size="sm">
                    <PencilIcon data-icon="inline-start" />
                    수정
                  </Button>
                  <Button variant="ghost" size="icon-sm" aria-label="닫기">
                    <XIcon />
                  </Button>
                </>
              }
            />
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[active.status]}>
                    {active.status}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    {active.code}
                  </span>
                </div>
                <Tabs defaultValue="정보">
                  <TabsList variant="line">
                    <TabsTrigger value="정보">기본 정보</TabsTrigger>
                    <TabsTrigger value="이력">변경 이력</TabsTrigger>
                  </TabsList>
                  <TabsContent value="정보">
                    <DescriptionList
                      items={[
                        { label: "구분", value: active.category },
                        { label: "담당자", value: active.owner },
                        { label: "수량", value: formatNumber(active.quantity) },
                        { label: "금액", value: formatWon(active.amount) },
                        { label: "등록일", value: active.date },
                        { label: "진행률", value: active.progress + "%" },
                      ]}
                    />
                  </TabsContent>
                  <TabsContent value="이력">
                    <div className="flex flex-col gap-3">
                      {timeline.map((entry) => (
                        <div key={entry.at} className="flex flex-col gap-0.5">
                          <p className="text-sm">{entry.what}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.who} · {entry.at}
                          </p>
                          <Separator className="mt-2" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </FullPage>
  )
}
