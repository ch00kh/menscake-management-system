import { buildPermissionMatrix } from "@/lib/permissionMatrix"
import type {
  PermissionResourceResponse,
  PermissionResponse,
} from "@/api/permissions"

const WHITELIST: PermissionResourceResponse[] = [
  { key: "accounts", label: "계정 관리" },
  { key: "permissions", label: "권한 관리" },
]

describe("buildPermissionMatrix", () => {
  it("저장된 권한 행이 하나도 없으면 STAFF 기본값(조회만)을 적용한다", () => {
    const rows = buildPermissionMatrix(WHITELIST, [], "STAFF")

    expect(rows).toEqual([
      {
        resource: "accounts",
        label: "계정 관리",
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
      {
        resource: "permissions",
        label: "권한 관리",
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
    ])
  })

  it("저장된 권한 행이 하나도 없으면 MANAGER 기본값(조회+수정)을 적용한다", () => {
    const rows = buildPermissionMatrix(WHITELIST, [], "MANAGER")

    for (const row of rows) {
      expect(row.canCreate).toBe(false)
      expect(row.canRead).toBe(true)
      expect(row.canUpdate).toBe(true)
      expect(row.canDelete).toBe(false)
    }
  })

  it("저장된 권한 행이 하나도 없으면 ADMIN 기본값(전부 허용)을 적용한다", () => {
    const rows = buildPermissionMatrix(WHITELIST, [], "ADMIN")

    for (const row of rows) {
      expect(row.canCreate).toBe(true)
      expect(row.canRead).toBe(true)
      expect(row.canUpdate).toBe(true)
      expect(row.canDelete).toBe(true)
    }
  })

  it("저장된 권한 행이 있으면 role 기본값을 적용하지 않고, 일치하는 리소스는 저장된 값을 쓴다", () => {
    const savedRows: PermissionResponse[] = [
      {
        resource: "accounts",
        canCreate: true,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
    ]

    const rows = buildPermissionMatrix(WHITELIST, savedRows, "ADMIN")

    expect(rows).toEqual([
      {
        resource: "accounts",
        label: "계정 관리",
        canCreate: true,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
      {
        resource: "permissions",
        label: "권한 관리",
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false,
      },
    ])
  })

  it("저장된 권한 행이 있을 때, 화이트리스트에 있지만 저장 행이 없는 리소스는 전부 false다", () => {
    const savedRows: PermissionResponse[] = [
      {
        resource: "permissions",
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
    ]

    const rows = buildPermissionMatrix(WHITELIST, savedRows, "STAFF")
    const accountsRow = rows.find((row) => row.resource === "accounts")

    expect(accountsRow).toEqual({
      resource: "accounts",
      label: "계정 관리",
      canCreate: false,
      canRead: false,
      canUpdate: false,
      canDelete: false,
    })
  })
})
