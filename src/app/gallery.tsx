import { ArrowRightIcon, LayoutGridIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Page } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { layoutGroups, layouts } from "@/layouts/registry"

export function Gallery() {
  return (
    <Page>
      <PageHeader
        title="ERP 레이아웃 갤러리"
        description="도메인에 매이지 않은 화면 골격 30종입니다. 만들려는 업무에 맞는 것을 고르고, 더미 데이터를 실제 도메인으로 바꾸면 됩니다."
        actions={
          <Badge variant="secondary">
            <LayoutGridIcon />
            {layouts.length}종
          </Badge>
        }
      />

      {layoutGroups.map((group) => (
        <section key={group} className="flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <h2 className="font-heading text-base font-semibold">{group}</h2>
            <span className="text-xs text-muted-foreground">
              {layouts.filter((layout) => layout.group === group).length}종
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {layouts
              .filter((layout) => layout.group === group)
              .map((layout) => (
                <Card key={layout.slug} className="gap-3">
                  <CardHeader>
                    <CardDescription className="tabular-nums">
                      {String(layout.no).padStart(2, "0")}
                    </CardDescription>
                    <CardTitle>{layout.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <Badge variant="outline">{layout.summary}</Badge>
                    <p className="text-sm text-muted-foreground">
                      {layout.useWhen}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      nativeButton={false}
                      render={<Link to={"/layouts/" + layout.slug} />}
                    >
                      열어 보기
                      <ArrowRightIcon data-icon="inline-end" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </section>
      ))}
    </Page>
  )
}
