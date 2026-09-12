import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

import { refresh } from "@/api/auth"
import { useAuthStore } from "@/hooks/useAuthStore"

type Status = "checking" | "authenticated" | "unauthenticated"

/**
 * 셸(`AppShell`) 진입 전에 세션을 확인한다. Access Token은 메모리에만 있어
 * 새로고침하면 사라지므로, 매번 refresh 쿠키로 복구를 시도한다 — 실패하면 `/login`.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const setAuth = useAuthStore((state) => state.setAuth)
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
  return <>{children}</>
}
