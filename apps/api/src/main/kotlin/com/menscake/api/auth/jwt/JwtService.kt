package com.menscake.api.auth.jwt

import com.menscake.api.auth.Account
import com.menscake.api.auth.Role
import com.menscake.api.auth.dto.PermissionSummary
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.Date
import javax.crypto.SecretKey

/**
 * Access Token 발급/검증. Refresh Token은 JWT가 아니라 DB에 해시로 저장되는 불투명
 * 토큰이라 이 서비스가 다루지 않는다 (docs/spec/auth/tech-decisions.md 참조).
 *
 * `permissions`를 claim에 통째로 실어, 매 요청마다 DB를 조회하지 않고도
 * [com.menscake.api.auth.permission.PermissionAspect]가 인가를 판단할 수 있게 한다.
 */
@Service
class JwtService(
    private val jwtProperties: JwtProperties,
) {
    private val key: SecretKey by lazy { Keys.hmacShaKeyFor(jwtProperties.secret.toByteArray()) }

    fun issueAccessToken(
        account: Account,
        permissions: List<PermissionSummary>,
    ): String {
        val now = Instant.now()
        return Jwts
            .builder()
            .subject(account.id.toString())
            .claim("email", account.email)
            .claim("name", account.name)
            .claim("role", account.role.name)
            .claim("permissions", permissions.map { it.toClaim() })
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plus(jwtProperties.accessTokenTtl)))
            .signWith(key)
            .compact()
    }

    /** 서명/만료 검증에 실패하면 [io.jsonwebtoken.JwtException]을 그대로 던진다 — 호출부에서 401로 변환한다. */
    fun parseAccessToken(token: String): JwtPrincipal {
        val claims =
            Jwts
                .parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .payload

        val permissions =
            (claims["permissions"] as? List<*>)
                ?.mapNotNull { (it as? Map<*, *>)?.toPermissionSummary() }
                ?: emptyList()

        return JwtPrincipal(
            accountId = claims.subject.toLong(),
            email = claims["email"] as String,
            role = Role.valueOf(claims["role"] as String),
            permissions = permissions,
        )
    }

    private fun PermissionSummary.toClaim(): Map<String, Any> =
        mapOf(
            "resource" to resource,
            "canCreate" to canCreate,
            "canRead" to canRead,
            "canUpdate" to canUpdate,
            "canDelete" to canDelete,
        )

    private fun Map<*, *>.toPermissionSummary(): PermissionSummary? {
        val resource = this["resource"] as? String ?: return null
        return PermissionSummary(
            resource = resource,
            canCreate = this["canCreate"] as? Boolean ?: false,
            canRead = this["canRead"] as? Boolean ?: false,
            canUpdate = this["canUpdate"] as? Boolean ?: false,
            canDelete = this["canDelete"] as? Boolean ?: false,
        )
    }
}
