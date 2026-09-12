package com.menscake.api.auth.dto

import jakarta.validation.constraints.NotBlank

/**
 * `POST /api/auth/change-password` 요청 — 인증된 본인만 호출한다
 * (docs/spec/account-management/api.md 참조).
 */
data class ChangePasswordRequest(
    @field:NotBlank
    val currentPassword: String,
    @field:NotBlank
    val newPassword: String,
)
