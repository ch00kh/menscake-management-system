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
 *
 * 계정 관리 API(`docs/spec/account-management/`)가 이 엔티티를 갱신해야 하는 필드
 * (`passwordHash`/`name`/`role`/`isActive`/`mustChangePassword`)는 `var`로 두고,
 * [RefreshToken.revoke]와 같은 방식으로 도메인 메서드를 통해서만 바꾼다 — 서비스가
 * 필드를 직접 대입하지 않고 이 엔티티가 자기 상태 전이를 스스로 책임진다.
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
    var passwordHash: String,
    @Column(nullable = false)
    var name: String,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var role: Role,
    @Column(name = "is_active", nullable = false)
    var isActive: Boolean = true,
    @Column(name = "must_change_password", nullable = false)
    var mustChangePassword: Boolean = false,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),
    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),
) {
    /** `PATCH /api/accounts/{id}`의 이름/역할/활성상태 변경 (보낸 필드만 갱신). */
    fun applyProfileUpdate(
        name: String? = null,
        role: Role? = null,
        isActive: Boolean? = null,
    ) {
        name?.let { this.name = it }
        role?.let { this.role = it }
        isActive?.let { this.isActive = it }
        this.updatedAt = Instant.now()
    }

    /**
     * 관리자의 비밀번호 재설정 액션 — `mustChangePassword`를 다시 `true`로 되돌린다
     * (docs/spec/account-management/schema.md 참조).
     */
    fun resetPassword(newPasswordHash: String) {
        this.passwordHash = newPasswordHash
        this.mustChangePassword = true
        this.updatedAt = Instant.now()
    }

    /** 본인이 `POST /api/auth/change-password`로 직접 변경 — `mustChangePassword`가 `false`가 된다. */
    fun changeOwnPassword(newPasswordHash: String) {
        this.passwordHash = newPasswordHash
        this.mustChangePassword = false
        this.updatedAt = Instant.now()
    }
}
