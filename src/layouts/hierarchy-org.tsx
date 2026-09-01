import { PlusIcon, UsersIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { FullPage } from "@/components/erp/page"
import { PaneHeader } from "@/components/erp/page-header"
import { OWNERS } from "@/data/mock"

function OrgNode({
  name,
  role,
  count,
}: {
  name: string
  role: string
  count?: number
}) {
  return (
    <Card className="w-48 gap-0 py-3">
      <CardContent className="flex items-center gap-2.5">
        <Avatar className="size-9">
          <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">{name}</span>
          <span className="truncate text-xs text-muted-foreground">{role}</span>
        </div>
        {count ? <Badge variant="secondary">{count}</Badge> : null}
      </CardContent>
    </Card>
  )
}

export function HierarchyOrg() {
  return (
    <FullPage>
      <PaneHeader
        title="조직 · 계층"
        count="4단계"
        actions={
          <>
            <ButtonGroup>
              <Button variant="outline" size="icon-sm" aria-label="축소">
                <ZoomOutIcon />
              </Button>
              <Button variant="outline" size="icon-sm" aria-label="확대">
                <ZoomInIcon />
              </Button>
            </ButtonGroup>
            <Button size="sm">
              <PlusIcon data-icon="inline-start" />
              하위 추가
            </Button>
          </>
        }
      />
      <ScrollArea className="min-h-0 flex-1 bg-muted/30">
        <div className="flex min-w-max flex-col items-center gap-0 p-8">
          <OrgNode name="본부" role="총괄 조직" count={128} />
          <div className="h-6 w-px bg-border" />
          <div className="flex items-start gap-8">
            {["1팀", "2팀", "3팀"].map((team, i) => (
              <div key={team} className="flex flex-col items-center">
                <div className="h-0 w-px" />
                <OrgNode name={team} role="실행 조직" count={[42, 51, 35][i]} />
                <div className="h-6 w-px bg-border" />
                <div className="flex items-start gap-4">
                  {OWNERS.slice(i, i + 2).map((person) => (
                    <div key={person} className="flex flex-col items-center">
                      <OrgNode name={person} role="담당" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center gap-2 border-t px-4 py-2 text-xs text-muted-foreground">
        <UsersIcon className="size-3.5" />
        노드를 끌어 상위 조직을 바꾸고, 더블클릭으로 상세를 엽니다.
      </div>
    </FullPage>
  )
}
