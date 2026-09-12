package com.menscake.api.auth

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

/**
 * 서버가 철회 가능한(stateful) Refresh Token. 원문이 아니라 해시(`tokenHash`)로
 * 저장한다 (docs/spec/auth/tech-decisions.md 참조).
 */
@Entity
@Table(name = "refresh_token")
class RefreshToken(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    @Column(name = "account_id", nullable = false)
    val accountId: Long,
    @Column(name = "token_hash", nullable = false)
    val tokenHash: String,
    @Column(name = "expires_at", nullable = false)
    val expiresAt: Instant,
    @Column(name = "revoked_at")
    var revokedAt: Instant? = null,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),
) {
    fun isValid(now: Instant = Instant.now()): Boolean = revokedAt == null && expiresAt.isAfter(now)

    fun revoke(now: Instant = Instant.now()) {
        revokedAt = now
    }
}
