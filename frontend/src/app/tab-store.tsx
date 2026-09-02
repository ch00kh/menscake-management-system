import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"

import {
  TabStoreContext,
  type TabStore,
  type WorkspaceTab,
} from "@/app/tab-context"
import { resolveTab } from "@/app/tab-resolve"

const STORAGE_KEY = "erp.workspace-tabs"

function readStoredTabs(): WorkspaceTab[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (tab): tab is WorkspaceTab =>
        typeof tab === "object" &&
        tab !== null &&
        typeof (tab as WorkspaceTab).path === "string" &&
        typeof (tab as WorkspaceTab).label === "string" &&
        // 저장된 뒤 레지스트리에서 사라진 경로는 버린다.
        resolveTab((tab as WorkspaceTab).path) !== null
    )
  } catch {
    return []
  }
}

/**
 * 탭 개수에 상한을 두지 않는다.
 *
 * 상한을 두면 넘칠 때 도구가 사용자의 탭을 대신 닫아야 하고, 그 탭에 입력하던
 * 값이 사라진다. 브라우저도 탭을 대신 닫지 않는다 — 스트립이 스크롤되고 조금
 * 느려질 뿐이며 사용자는 그것을 이해한다.
 *
 * 숨은 탭의 비용은 DOM 과 메모리이고 (서버 요청은 useActiveTabInterval 이 막는다),
 * 실무에서 여는 개수(5~15)에서는 문제가 되지 않는다. 나중에 정말 느려지면
 * 해법은 상한이 아니라 "미저장 상태가 없는 탭만 언마운트"이며, 그건 탭별
 * dirty 추적이 먼저다.
 */
export function TabStoreProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [tabs, setTabs] = React.useState<WorkspaceTab[]>(readStoredTabs)

  // 주소가 열린 탭에 없으면 (딥링크, 뒤로가기, 새로고침, 사이드바 링크 클릭)
  // 탭을 만들어 준다. useEffect + setState 는 react-hooks/set-state-in-effect 에
  // 걸리므로 렌더 중 보정 패턴을 쓴다.
  const [lastPath, setLastPath] = React.useState<string | null>(null)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    const resolved = resolveTab(pathname)
    if (resolved && !tabs.some((tab) => tab.path === pathname)) {
      setTabs((prev) => [...prev, { path: pathname, label: resolved.label }])
    }
  }

  React.useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tabs))
    } catch {
      // 시크릿 모드 등에서 저장이 막혀도 탭 동작 자체는 유지한다.
    }
  }, [tabs])

  const openTab = React.useCallback(
    (path: string) => {
      const resolved = resolveTab(path)
      if (!resolved) return
      setTabs((prev) =>
        prev.some((tab) => tab.path === path)
          ? prev
          : [...prev, { path, label: resolved.label }]
      )
      navigate(path)
    },
    [navigate]
  )

  const closeTab = React.useCallback(
    (path: string) => {
      const index = tabs.findIndex((tab) => tab.path === path)
      if (index === -1) return

      const next = tabs.filter((tab) => tab.path !== path)
      setTabs(next)

      // 활성 탭을 닫으면 오른쪽 이웃으로, 없으면 왼쪽으로 이동.
      //
      // navigate 는 setTabs 의 업데이터 '밖'에서 불러야 한다. 업데이터는 렌더 중에
      // 실행되므로 그 안에서 navigate 하면 렌더 도중 라우터를 갱신하게 되고
      // ("Cannot update a component while rendering a different component"),
      // StrictMode 에서는 업데이터가 두 번 돌아 navigate 도 두 번 나간다.
      if (path === pathname) {
        const neighbor = next[index] ?? next[index - 1]
        navigate(neighbor ? neighbor.path : "/")
      }
    },
    [tabs, navigate, pathname]
  )

  const closeOthers = React.useCallback(
    (path: string) => {
      setTabs((prev) => prev.filter((tab) => tab.path === path))
      if (path !== pathname) navigate(path)
    },
    [navigate, pathname]
  )

  const store = React.useMemo<TabStore>(
    () => ({ tabs, activePath: pathname, openTab, closeTab, closeOthers }),
    [tabs, pathname, openTab, closeTab, closeOthers]
  )

  return (
    <TabStoreContext.Provider value={store}>
      {children}
    </TabStoreContext.Provider>
  )
}
