package com.menscake.api.auth.dto

import com.menscake.api.auth.Role
import java.time.Instant

/**
 * `GET/POST/PATCH /api/accounts`가 공통으로 재사용하는 응답 DTO (액션별로 나누지
 * 않는다 — `docs/rule/naming-convention.md` 참조). 계약은
 * `docs/spec/account-management/api.md` 참조.
 */
data class AccountResponse(
    val id: Long,
    val email: String,
    val name: String,
    val role: Role,
    val isActive: Boolean,
    val mustChangePassword: Boolean,
    val createdAt: Instant,
)
