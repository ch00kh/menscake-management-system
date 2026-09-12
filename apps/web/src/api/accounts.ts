/**
 * `/api/accounts` + `/api/auth/change-password` 클라이언트. orval 없이 손으로 작성한다 —
 * 이번 이슈의 엔드포인트도 몇 개뿐이라 코드생성 파이프라인을 지금 구축하는 비용이 더 크다
 * (docs/spec/auth/tech-decisions.md와 동일한 이유). 계약은 docs/spec/account-management/api.md
 * 그대로 따른다. 둘 다 인증이 필요한 엔드포인트라 `authorizedFetch`를 사용한다.
 */

import { throwApiError, type Role } from "@/api/auth"
import { authorizedFetch } from "@/api/http"

export interface AccountResponse {
  id: number
  email: string
  name: string
  /** 분류(classification) — 인가 판단에 안 쓰임. */
  role: Role
  /** 상태(state) — `false`면 로그인 차단. */
  isActive: boolean
  /** 상태(state) — 다음 로그인 시 비밀번호 변경 강제 여부. */
  mustChangePassword: boolean
  createdAt: string
}

/** Spring Data `Page<T>` 직렬화 형태 (docs/rule/api-response-convention.md). */
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface AccountSearchParams {
  query?: string
  role?: Role
  isActive?: boolean
  page?: number
  size?: number
  sort?: string
}

export interface AccountCreateRequest {
  email: string
  name: string
  role: Role
  password: string
}

/** 보낸 필드만 갱신된다. `password`가 오면 관리자의 "비밀번호 재설정" 액션으로 처리된다. */
export interface AccountUpdateRequest {
  name?: string
  role?: Role
  isActive?: boolean
  password?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

async function parseData<T>(response: Response): Promise<T> {
  if (!response.ok) {
    await throwApiError(response)
  }
  if (response.status === 204) {
    return undefined as T
  }
  const body = (await response.json()) as { data: T }
  return body.data
}

export async function fetchAccounts(
  params: AccountSearchParams = {}
): Promise<Page<AccountResponse>> {
  const search = new URLSearchParams()
  if (params.query) search.set("query", params.query)
  if (params.role) search.set("role", params.role)
  if (params.isActive !== undefined) {
    search.set("isActive", String(params.isActive))
  }
  if (params.page !== undefined) search.set("page", String(params.page))
  if (params.size !== undefined) search.set("size", String(params.size))
  if (params.sort) search.set("sort", params.sort)

  const queryString = search.toString()
  const response = await authorizedFetch(
    `/api/accounts${queryString ? `?${queryString}` : ""}`
  )
  return parseData<Page<AccountResponse>>(response)
}

export async function createAccount(
  request: AccountCreateRequest
): Promise<AccountResponse> {
  const response = await authorizedFetch("/api/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  return parseData<AccountResponse>(response)
}

export async function updateAccount(
  id: number,
  request: AccountUpdateRequest
): Promise<AccountResponse> {
  const response = await authorizedFetch(`/api/accounts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  return parseData<AccountResponse>(response)
}

export async function deleteAccount(id: number): Promise<void> {
  const response = await authorizedFetch(`/api/accounts/${id}`, {
    method: "DELETE",
  })
  return parseData<void>(response)
}

/** 인증된 본인만 호출한다 (다른 계정 대상 아님). 성공 시 `mustChangePassword`가 서버에서 `false`로 바뀐다. */
export async function changePassword(
  request: ChangePasswordRequest
): Promise<void> {
  const response = await authorizedFetch("/api/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  return parseData<void>(response)
}
