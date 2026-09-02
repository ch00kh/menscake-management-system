import type { ReactNode } from "react"

import { Gallery } from "@/app/gallery"
import { LayoutPage } from "@/app/layout-page"
import { MENU_LAYOUTS, MENU_ROOT } from "@/app/menu"
import { getLayout } from "@/layouts/registry"

/** 탭 하나가 무엇을 보여주는지. 경로 문자열이 탭의 식별자다. */
export type ResolvedTab = {
  /** 탭에 표시할 짧은 이름. */
  label: string
  /** 헤더 브레드크럼. 사이드바 경로를 위에서부터 나열한다. */
  trail: string[]
  element: ReactNode
}

/**
 * 경로를 탭 내용으로 바꾼다. 라우트 매칭을 여기서 직접 하는 이유:
 * 탭 여러 개가 동시에 살아 있어야 하는데 React Router 는 한 번에 한 라우트만
 * 매칭하므로, useParams 대신 경로에서 직접 값을 뽑아 컴포넌트에 넘긴다.
 *
 * 모르는 경로면 null. 호출부가 갤러리로 되돌린다.
 */
export function resolveTab(pathname: string): ResolvedTab | null {
  if (pathname === "/") {
    // 갤러리는 메뉴 트리 밖(브랜드·사이드바 하단)에서 열리므로 접두부를 붙이지 않는다.
    return {
      label: "레이아웃 갤러리",
      trail: ["레이아웃 갤러리"],
      element: <Gallery />,
    }
  }

  const match = /^\/layouts\/([^/]+)$/.exec(pathname)
  if (match) {
    const slug = match[1]
    const layout = getLayout(slug)
    if (!layout) return null
    return {
      label: layout.name,
      trail: [MENU_ROOT.label, MENU_LAYOUTS.label, layout.group, layout.name],
      element: <LayoutPage slug={slug} />,
    }
  }

  return null
}
