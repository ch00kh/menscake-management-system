import { create } from "zustand"

import type {
  AccountSummary,
  AuthResponse,
  PermissionSummary,
} from "@/api/auth"

interface AuthState {
  accessToken: string | null
  account: AccountSummary | null
  permissions: PermissionSummary[]
  setAuth: (auth: AuthResponse) => void
  clearAuth: () => void
}

/**
 * 인증 상태. Access Token은 메모리에만 보관한다 — `persist` 미들웨어를 쓰지 않는다
 * (docs/rule/tech-stack.md "인증 전략" 참조). 새로고침하면 사라지므로, 앱 부팅 시
 * `RequireAuth`가 refresh 쿠키로 세션을 복구한다.
 */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  account: null,
  permissions: [],
  setAuth: (auth) =>
    set({
      accessToken: auth.accessToken,
      account: auth.account,
      permissions: auth.permissions,
    }),
  clearAuth: () => set({ accessToken: null, account: null, permissions: [] }),
}))
