package com.menscake.api.auth.dto

import com.menscake.api.auth.Role

/**
 * `PATCH /api/accounts/{id}` 요청 — 모든 필드가 선택이며 보낸 필드만 갱신한다.
 * `password`가 오면 관리자의 "비밀번호 재설정" 액션으로 처리되어
 * `mustChangePassword`를 `true`로 되돌린다 (docs/spec/account-management/api.md 참조).
 */
data class AccountUpdateRequest(
    val name: String? = null,
    val role: Role? = null,
    val isActive: Boolean? = null,
    val password: String? = null,
)
