/**
 * `/api/auth/*` 클라이언트. orval 없이 손으로 작성한다 — 엔드포인트가 3~4개뿐이라
 * 코드생성 파이프라인을 지금 구축하는 비용이 더 크다 (docs/spec/auth/tech-decisions.md 참조).
 * 계약은 docs/spec/auth/api.md 그대로 따른다.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"

/** 분류(classification) 필드 — 인가 판단에는 안 쓰임, 화면 표시/필터용. */
export type Role = "ADMIN" | "MANAGER" | "STAFF"

export interface AccountSummary {
  id: number
  name: string
  email: string
  role: Role
}

/** 상태(state) 필드들 — @RequiresPermission 판단에 대응하는 값. 백엔드는 아직 실사용처 없음. */
export interface PermissionSummary {
  resource: string
  canCreate: boolean
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
}

export interface AuthResponse {
  accessToken: string
  account: AccountSummary
  permissions: PermissionSummary[]
}

/** 4xx/5xx 응답(ProblemDetail)을 감싼 에러. */
export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = "ApiError"
  }
}

async function parseAuthResponse(response: Response): Promise<AuthResponse> {
  if (!response.ok) {
    const problem = (await response.json().catch(() => null)) as {
      detail?: string
    } | null
    throw new ApiError(
      problem?.detail ?? "요청 처리에 실패했습니다",
      response.status
    )
  }
  const body = (await response.json()) as { data: AuthResponse }
  return body.data
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  return parseAuthResponse(response)
}

/** Refresh Token 쿠키만으로 호출한다 — 실패하면 세션이 없다는 뜻. */
export async function refresh(): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
  return parseAuthResponse(response)
}

/** 멱등 — 쿠키가 없거나 이미 무효해도 에러를 던지지 않는다. */
export async function logout(): Promise<void> {
  await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  })
}
