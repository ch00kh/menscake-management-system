package com.menscake.api.auth.jwt

import com.menscake.api.auth.Role
import com.menscake.api.auth.dto.PermissionSummary

/**
 * Access Token에서 파싱한 인증 정보. `SecurityContextHolder`의
 * `Authentication.principal`로 들어가며, [com.menscake.api.auth.permission.PermissionAspect]가
 * 이걸 읽어 권한을 검사한다.
 */
data class JwtPrincipal(
    val accountId: Long,
    val email: String,
    val role: Role,
    val permissions: List<PermissionSummary>,
)
