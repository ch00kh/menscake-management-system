/**
 * 로그인 계정의 `PermissionSummary[]`로 화면 노출/편집 가능 여부를 판단하는 순수 함수.
 * `account.role`은 분류(classification)일 뿐이라 인가 판단에 쓰지 않는다
 * (docs/rule/naming-convention.md "필드 설계 — 상태 vs 분류").
 */

import type { PermissionSummary } from "@/api/auth"

type PermissionAction = "canCreate" | "canRead" | "canUpdate" | "canDelete"

export function hasPermission(
  permissions: PermissionSummary[],
  resource: string,
  action: PermissionAction
): boolean {
  return permissions.some(
    (permission) => permission.resource === resource && permission[action]
  )
}
