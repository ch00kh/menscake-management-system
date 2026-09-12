package com.menscake.api.auth

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

/**
 * 로그인 가능한 계정. `User`/`user`가 아니라 `Account`/`account`인 이유는 PostgreSQL
 * 예약어 회피다 (docs/rule/naming-convention.md 참조).
 */
@Entity
@Table(name = "account")
class Account(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    @Column(nullable = false, unique = true)
    val email: String,
    @Column(name = "password_hash", nullable = false)
    val passwordHash: String,
    @Column(nullable = false)
    val name: String,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: Role,
    @Column(name = "is_active", nullable = false)
    val isActive: Boolean = true,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),
    @Column(name = "updated_at", nullable = false)
    val updatedAt: Instant = Instant.now(),
)
