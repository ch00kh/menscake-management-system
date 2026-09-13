/**
 * `/api/permission-resources` + `/api/accounts/{accountId}/permissions` 클라이언트.
 * orval 없이 손으로 작성한다 — accounts.ts/auth.ts와 같은 이유
 * (docs/spec/auth/tech-decisions.md 참조). 계약은 docs/spec/permission-management/api.md
 * 그대로 따른다. 전부 인증이 필요한 엔드포인트라 `authorizedFetch`를 사용한다.
 */

import { throwApiError } from "@/api/auth"
import { authorizedFetch } from "@/api/http"

/** 권한 부여 대상이 될 수 있는 리소스 화이트리스트 항목 (백엔드 코드 상수). */
export interface PermissionResourceResponse {
  key: string
  label: string
}

export interface PermissionResponse {
  resource: string
  canCreate: boolean
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
}

export type PermissionUpdateRequest = PermissionResponse

async function parseData<T>(response: Response): Promise<T> {
  if (!response.ok) {
    await throwApiError(response)
  }
  const body = (await response.json()) as { data: T }
  return body.data
}

export async function fetchPermissionResources(): Promise<
  PermissionResourceResponse[]
> {
  const response = await authorizedFetch("/api/permission-resources")
  return parseData<PermissionResourceResponse[]>(response)
}

export async function fetchAccountPermissions(
  accountId: number
): Promise<PermissionResponse[]> {
  const response = await authorizedFetch(
    `/api/accounts/${accountId}/permissions`
  )
  return parseData<PermissionResponse[]>(response)
}

export async function updateAccountPermissions(
  accountId: number,
  items: PermissionUpdateRequest[]
): Promise<PermissionResponse[]> {
  const response = await authorizedFetch(
    `/api/accounts/${accountId}/permissions`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    }
  )
  return parseData<PermissionResponse[]>(response)
}
