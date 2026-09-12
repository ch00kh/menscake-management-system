import { Route, Routes } from "react-router-dom"

import { AppShell } from "@/app/AppShell"
import { RequireAuth } from "@/app/RequireAuth"
import { AccountManagementPage } from "@/pages/AccountManagementPage"
import { ChangePasswordPage } from "@/pages/ChangePasswordPage"
import { LoginPage } from "@/pages/LoginPage"

/**
 * 멀티탭 셸이 모든 경로를 직접 처리한다. 탭 여러 개가 동시에 살아 있어야 하는데
 * React Router 는 한 번에 한 라우트만 매칭하므로, 경로 해석은
 * `tabResolve.tsx` 가 맡는다. 로그인 화면은 셸 진입 전 단계라 별도 라우트로 빼고,
 * 셸 진입은 `RequireAuth`로 감싸 미인증 상태를 막는다.
 *
 * 계정 관리(`/accounts`)와 비밀번호 변경(`/change-password`)도 아직 셸에 편입되지
 * 않은 독립 라우트다(docs/rule/repo-structure.md의 `src/pages/` 규칙). 인증은 필요하므로
 * `RequireAuth`로 감싼다 — `/change-password`는 `mustChangePassword===true`일 때
 * `RequireAuth`가 도착시키는 경로이기도 하다.
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
        path="/accounts"
        element={
          <RequireAuth>
            <AccountManagementPage />
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
