package com.menscake.api.auth.dto

/**
 * `GET/PUT /api/accounts/{accountId}/permissions`가 공통으로 재사용하는 응답 DTO
 * (액션별로 나누지 않는다 — `docs/rule/naming-convention.md` 참조). 계약은
 * `docs/spec/permission-management/api.md` 참조.
 */
data class PermissionResponse(
    val resource: String,
    val canCreate: Boolean,
    val canRead: Boolean,
    val canUpdate: Boolean,
    val canDelete: Boolean,
)
