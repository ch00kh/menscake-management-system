import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"

import { refresh } from "@/api/auth"
import { useAuthStore } from "@/hooks/useAuthStore"

type Status = "checking" | "authenticated" | "unauthenticated"

/** `/change-password`에서 성공 후 되돌아갈 원래 목적지를 실어 보내는 state 모양. */
export interface RequireAuthLocationState {
  from?: { pathname: string }
}

const CHANGE_PASSWORD_PATH = "/change-password"

/**
 * 셸(`AppShell`) 진입 전에 세션을 확인한다. Access Token은 메모리에만 있어
 * 새로고침하면 사라지므로, 매번 refresh 쿠키로 복구를 시도한다 — 실패하면 `/login`.
 *
 * 인증된 이후에는 `account.mustChangePassword`도 확인한다. `true`인 동안은
 * `/change-password` 외 경로 접근을 강제로 막는다 (docs/spec/account-management/flow.md).
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const account = useAuthStore((state) => state.account)
  const setAuth = useAuthStore((state) => state.setAuth)
  const location = useLocation()
  const [status, setStatus] = useState<Status>(
    accessToken ? "authenticated" : "checking"
  )

  useEffect(() => {
    if (accessToken) return

    let cancelled = false
    refresh()
      .then((auth) => {
        if (cancelled) return
        setAuth(auth)
        setStatus("authenticated")
      })
      .catch(() => {
        if (cancelled) return
        setStatus("unauthenticated")
      })

    return () => {
      cancelled = true
    }
  }, [accessToken, setAuth])

  if (status === "checking") return null
  if (status === "unauthenticated") return <Navigate to="/login" replace />

  if (account?.mustChangePassword && location.pathname !== CHANGE_PASSWORD_PATH) {
    const state: RequireAuthLocationState = { from: location }
    return <Navigate to={CHANGE_PASSWORD_PATH} replace state={state} />
  }

  return <>{children}</>
}
