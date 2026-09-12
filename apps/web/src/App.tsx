import { Route, Routes } from "react-router-dom"

import { AppShell } from "@/app/AppShell"
import { RequireAuth } from "@/app/RequireAuth"
import { ChangePasswordPage } from "@/pages/ChangePasswordPage"
import { LoginPage } from "@/pages/LoginPage"

/**
 * 멀티탭 셸이 모든 경로를 직접 처리한다. 탭 여러 개가 동시에 살아 있어야 하는데
 * React Router 는 한 번에 한 라우트만 매칭하므로, 경로 해석은
 * `tabResolve.tsx` 가 맡는다. 로그인 화면은 셸 진입 전 단계라 별도 라우트로 빼고,
 * 셸 진입은 `RequireAuth`로 감싸 미인증 상태를 막는다.
 *
 * 계정 관리(`/accounts`)는 `tabResolve.tsx`에 등록돼 있어 `*` 경로로 셸에
 * 편입된다(사이드바/탭이 유지됨). 비밀번호 변경(`/change-password`)은 의도적으로
 * 셸 밖 독립 라우트로 남긴다 — `mustChangePassword===true`인 동안 사이드바를 통해
 * 다른 화면으로 빠져나가지 못하게 강제하는 흐름이라, 탭으로 열리면 그 강제가 깨진다.
 */
export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/change-password"
        element={
          <RequireAuth>
            <ChangePasswordPage />
          </RequireAuth>
        }
      />
      <Route
        path="*"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default App
