import { hasPermission } from "@/lib/permissions"
import type { PermissionSummary } from "@/api/auth"

describe("hasPermission", () => {
  it("리소스와 액션이 모두 일치하고 값이 true면 true를 반환한다", () => {
    const permissions: PermissionSummary[] = [
      {
        resource: "permissions",
        canCreate: false,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
    ]

    expect(hasPermission(permissions, "permissions", "canRead")).toBe(true)
    expect(hasPermission(permissions, "permissions", "canUpdate")).toBe(true)
  })

  it("값이 false면 리소스가 일치해도 false를 반환한다", () => {
    const permissions: PermissionSummary[] = [
      {
        resource: "permissions",
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
    ]

    expect(hasPermission(permissions, "permissions", "canUpdate")).toBe(false)
  })

  it("일치하는 리소스가 없으면 false를 반환한다", () => {
    expect(hasPermission([], "permissions", "canRead")).toBe(false)
  })
})
