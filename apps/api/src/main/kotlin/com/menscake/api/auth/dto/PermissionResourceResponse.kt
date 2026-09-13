package com.menscake.api.auth.dto

/**
 * `GET /api/permission-resources` 응답 — 권한 부여 대상 리소스 키 화이트리스트
 * (docs/spec/permission-management/api.md 참조).
 */
data class PermissionResourceResponse(
    val key: String,
    val label: String,
)
