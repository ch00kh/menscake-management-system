import { logout as logoutRequest, refresh } from "@/api/auth"
import { useAuthStore } from "@/hooks/useAuthStore"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"

/**
 * 인증이 필요한 API 호출용 fetch. Access Token을 자동으로 붙이고, 401을 받으면
 * refresh를 한 번 재시도한 뒤 그래도 실패하면 로그아웃 처리 후 `/login`으로 보낸다.
 *
 * 아직 이 헬퍼를 쓰는 실제 업무 API가 없다 — 백엔드의 `@RequiresPermission`과 마찬가지로
 * 인증 도메인의 일부로 메커니즘만 먼저 만들어 둔다 (docs/spec/auth/flow.md 참조).
 */
export async function authorizedFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const attempt = () =>
    fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        ...init.headers,
        Authorization: `Bearer ${useAuthStore.getState().accessToken ?? ""}`,
      },
    })

  const response = await attempt()
  if (response.status !== 401) return response

  try {
    const auth = await refresh()
    useAuthStore.getState().setAuth(auth)
  } catch {
    await forceLogout()
    return response
  }

  return attempt()
}

async function forceLogout() {
  useAuthStore.getState().clearAuth()
  await logoutRequest().catch(() => undefined)
  window.location.assign("/login")
}
