/**
 * 권한 매트릭스 모달의 프리필(기본값) 계산. 백엔드 API 호출 없이 순수 함수로 분리해
 * 컴포넌트를 마운트하지 않고도 단위 테스트할 수 있게 한다 (docs/rule/testing-convention.md).
 * 규칙은 docs/spec/permission-management/flow.md "기본값(프리필) 계산" 그대로 따른다.
 */

import type { Role } from "@/api/auth"
import type {
  PermissionResourceResponse,
  PermissionResponse,
} from "@/api/permissions"

export interface PermissionRow {
  resource: string
  label: string
  canCreate: boolean
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
}

type PermissionFlags = Omit<PermissionRow, "resource" | "label">

const NO_PERMISSION: PermissionFlags = {
  canCreate: false,
  canRead: false,
  canUpdate: false,
  canDelete: false,
}

/** 대상 계정의 `role`에 따른 기본 CRUD 값 — 저장된 권한 행이 하나도 없을 때만 쓰인다. */
const ROLE_DEFAULT_PERMISSION: Record<Role, PermissionFlags> = {
  STAFF: { canCreate: false, canRead: true, canUpdate: false, canDelete: false },
  MANAGER: { canCreate: false, canRead: true, canUpdate: true, canDelete: false },
  ADMIN: { canCreate: true, canRead: true, canUpdate: true, canDelete: true },
}

/**
 * 화이트리스트와 저장된 권한 행을 병합해 매트릭스 행을 만든다.
 *
 * - `savedRows`가 완전히 비어 있으면(저장된 권한이 하나도 없는 계정), `targetAccountRole`
 *   기반 기본값을 화이트리스트 전체에 적용한다.
 * - `savedRows`에 항목이 하나라도 있으면 role 기본값은 전혀 적용하지 않는다 — 화이트리스트에
 *   있지만 저장된 행이 없는 리소스는 전부 권한 없음(`false`)으로 채운다.
 */
export function buildPermissionMatrix(
  whitelist: PermissionResourceResponse[],
  savedRows: PermissionResponse[],
  targetAccountRole: Role
): PermissionRow[] {
  const applyRoleDefaults = savedRows.length === 0
  const savedByResource = new Map(
    savedRows.map((row) => [row.resource, row] as const)
  )

  return whitelist.map(({ key, label }) => {
    const saved = savedByResource.get(key)
    const flags: PermissionFlags = saved
      ? {
          canCreate: saved.canCreate,
          canRead: saved.canRead,
          canUpdate: saved.canUpdate,
          canDelete: saved.canDelete,
        }
      : applyRoleDefaults
        ? ROLE_DEFAULT_PERMISSION[targetAccountRole]
        : NO_PERMISSION

    return { resource: key, label, ...flags }
  })
}
