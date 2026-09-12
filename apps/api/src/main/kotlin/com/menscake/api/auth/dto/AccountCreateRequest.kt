package com.menscake.api.auth.dto

import com.menscake.api.auth.Role
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

/**
 * `POST /api/accounts` 요청. 생성된 계정은 `mustChangePassword=true`,
 * `isActive=true`로 시작한다 (요청 필드로 받지 않음 — docs/spec/account-management/api.md 참조).
 */
data class AccountCreateRequest(
    @field:NotBlank
    @field:Email
    val email: String,
    @field:NotBlank
    val name: String,
    val role: Role,
    @field:NotBlank
    val password: String,
)
