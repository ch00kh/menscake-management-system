package com.menscake.api.auth

import org.springframework.data.jpa.repository.JpaRepository

interface RefreshTokenRepository : JpaRepository<RefreshToken, Long> {
    fun findByTokenHash(tokenHash: String): RefreshToken?

    /** 계정 하드 삭제 시 연쇄 삭제용 (docs/spec/account-management/schema.md 참조). */
    fun deleteByAccountId(accountId: Long)
}
