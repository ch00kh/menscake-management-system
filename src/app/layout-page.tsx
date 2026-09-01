import { useParams } from "react-router-dom"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { SearchXIcon } from "lucide-react"
import { getLayout } from "@/layouts/registry"

export function LayoutPage() {
  const { slug } = useParams()
  const layout = getLayout(slug)

  if (!layout) {
    return (
      <Empty className="flex-1">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>
          <EmptyTitle>레이아웃을 찾을 수 없습니다</EmptyTitle>
          <EmptyDescription>
            좌측 목록에서 다른 레이아웃을 선택하세요.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const Component = layout.component
  return <Component />
}
