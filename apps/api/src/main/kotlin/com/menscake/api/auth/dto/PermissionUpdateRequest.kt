package com.menscake.api.auth.dto

/**
 * `PUT /api/accounts/{accountId}/permissions` 요청 배열의 각 항목 — 화이트리스트
 * 전체 키에 대한 CRUD 상태를 통째로 보낸다 (docs/spec/permission-management/api.md 참조).
 */
data class PermissionUpdateRequest(
    val resource: String,
    val canCreate: Boolean,
    val canRead: Boolean,
    val canUpdate: Boolean,
    val canDelete: Boolean,
)
