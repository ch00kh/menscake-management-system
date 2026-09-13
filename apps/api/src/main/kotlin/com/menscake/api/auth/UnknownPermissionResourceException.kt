package com.menscake.api.auth

/**
 * `PUT /api/accounts/{id}/permissions` 요청에 [PermissionResource] 화이트리스트에 없는
 * `resource` 키가 하나라도 있는 경우 (docs/spec/permission-management/api.md 참조).
 */
class UnknownPermissionResourceException(
    resource: String,
) : RuntimeException("등록되지 않은 리소스 키입니다: $resource")
