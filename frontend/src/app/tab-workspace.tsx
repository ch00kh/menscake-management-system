import { Navigate, useNavigate } from "react-router-dom"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import { TabBar } from "@/app/tab-bar"
import { resolveTab } from "@/app/tab-resolve"
import { TabActiveContext, useTabStore } from "@/app/tab-context"

export function TabWorkspace() {
  const { tabs, activePath } = useTabStore()
  const navigate = useNavigate()

  // 모르는 경로면 갤러리로. 렌더 중 선언적으로 처리해 이펙트를 쓰지 않는다.
  if (resolveTab(activePath) === null) {
    return <Navigate to="/" replace />
  }

  return (
    <Tabs
      value={activePath}
      onValueChange={(value) => navigate(String(value))}
      className="flex min-h-0 flex-1 flex-col gap-0"
    >
      <TabBar />

      {tabs.map((tab) => {
        const resolved = resolveTab(tab.path)
        if (!resolved) return null
        const isActive = tab.path === activePath
        return (
          <TabsContent
            key={tab.path}
            value={tab.path}
            // 숨은 탭도 DOM 에 남겨 입력값·스크롤 위치를 보존한다.
            keepMounted
            data-tab-active={isActive}
            className="no-scrollbar mb-2 me-2 flex min-h-0 flex-1 flex-col overflow-auto rounded-b-xl border border-t-0 bg-background"
          >
            {/* 숨은 탭에서 서버 요청을 막을 수 있도록 활성 여부를 내려준다. */}
            <TabActiveContext.Provider value={isActive}>
              {resolved.element}
            </TabActiveContext.Provider>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
