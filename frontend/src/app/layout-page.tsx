import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { SearchXIcon } from "lucide-react"
import { getLayout } from "@/layouts/registry"

/**
 * slug 는 `tab-resolve.tsx` 가 경로에서 뽑아 넘긴다. useParams 를 쓰지 않는
 * 이유: 탭 여러 개가 동시에 마운트돼 있고, 라우트 매칭은 활성 탭 하나에만
 * 해당하므로 숨은 탭이 잘못된 slug 를 읽게 된다.
 */
export function LayoutPage({ slug }: { slug?: string }) {
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
