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
  /** `/change-password` 성공 후 라우트 가드가 더는 리다이렉트하지 않도록 스토어만 갱신한다. */
  setMustChangePassword: (mustChangePassword: boolean) => void
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
  setMustChangePassword: (mustChangePassword) =>
    set((state) =>
      state.account
        ? { account: { ...state.account, mustChangePassword } }
        : state
    ),
}))
