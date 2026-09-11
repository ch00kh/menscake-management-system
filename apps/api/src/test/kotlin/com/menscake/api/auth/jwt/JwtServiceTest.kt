package com.menscake.api.auth.jwt

import com.menscake.api.auth.Account
import com.menscake.api.auth.Role
import com.menscake.api.auth.dto.PermissionSummary
import io.jsonwebtoken.JwtException
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.time.Duration

class JwtServiceTest {
    private val jwtProperties =
        JwtProperties(
            secret = "test-only-hmac-secret-key-must-be-at-least-32-bytes-long",
            accessTokenTtl = Duration.ofMinutes(15),
            refreshTokenTtl = Duration.ofDays(14),
        )
    private val jwtService = JwtService(jwtProperties)

    private val account =
        Account(id = 42, email = "admin@menscake.com", passwordHash = "hashed", name = "관리자", role = Role.ADMIN)
    private val permissions =
        listOf(
            PermissionSummary(
                resource = "orders",
                canCreate = true,
                canRead = true,
                canUpdate = false,
                canDelete = false,
            ),
        )

    @Test
    fun `발급한 토큰을 다시 파싱하면 원래 정보가 그대로 나온다`() {
        val token = jwtService.issueAccessToken(account, permissions)

        val principal = jwtService.parseAccessToken(token)

        assertEquals(42L, principal.accountId)
        assertEquals("admin@menscake.com", principal.email)
        assertEquals(Role.ADMIN, principal.role)
        assertEquals(permissions, principal.permissions)
    }

    @Test
    fun `서명이 다른 시크릿으로 발급된 토큰은 검증에 실패한다`() {
        val otherService =
            JwtService(jwtProperties.copy(secret = "another-hmac-secret-key-must-be-at-least-32-bytes"))
        val token = otherService.issueAccessToken(account, permissions)

        assertThrows(JwtException::class.java) {
            jwtService.parseAccessToken(token)
        }
    }

    @Test
    fun `만료된 토큰은 검증에 실패한다`() {
        val expiredProperties = jwtProperties.copy(accessTokenTtl = Duration.ofSeconds(-1))
        val expiredService = JwtService(expiredProperties)
        val token = expiredService.issueAccessToken(account, permissions)

        assertThrows(JwtException::class.java) {
            jwtService.parseAccessToken(token)
        }
    }
}
