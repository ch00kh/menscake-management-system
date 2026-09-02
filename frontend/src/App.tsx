import { Route, Routes } from "react-router-dom"

import { AppShell } from "@/app/app-shell"

/**
 * 멀티탭 셸이 모든 경로를 직접 처리한다. 탭 여러 개가 동시에 살아 있어야 하는데
 * React Router 는 한 번에 한 라우트만 매칭하므로, 경로 해석은
 * `tab-resolve.tsx` 가 맡는다.
 */
export function App() {
  return (
    <Routes>
      <Route path="*" element={<AppShell />} />
    </Routes>
  )
}

export default App
