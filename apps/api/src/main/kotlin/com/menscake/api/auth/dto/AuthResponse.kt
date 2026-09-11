package com.menscake.api.auth.dto

import com.menscake.api.auth.Role

/**
 * `POST /api/auth/login`, `/refresh` 공통 응답. 액션별로 DTO를 나누지 않고 재사용한다
 * (docs/rule/naming-convention.md "응답 DTO는 액션별로 나누지 않는다" 참조).
 *
 * [AccountSummary]/[PermissionSummary]는 이 응답 모양을 이루는 데만 쓰이는 프리미티브라
 * 별도 파일로 쪼개지 않고 대표 타입([AuthResponse])과 한 파일에 묶는다
 * (`docs/rule/naming-convention.md`의 "관련 프리미티브 묶음 파일" 예외와 같은 취지).
 */
data class AuthResponse(
    val accessToken: String,
    val account: AccountSummary,
    val permissions: List<PermissionSummary>,
)

data class AccountSummary(
    val id: Long,
    val name: String,
    val email: String,
    val role: Role,
)

data class PermissionSummary(
    val resource: String,
    val canCreate: Boolean,
    val canRead: Boolean,
    val canUpdate: Boolean,
    val canDelete: Boolean,
)
