package com.menscake.api.auth

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

/**
 * 계정별 리소스(업무 메뉴)에 대한 CRUD 허용 여부. `resource`는 아직 실제 업무 메뉴가
 * 없어 FK가 아닌 자유 문자열 키다 (docs/spec/auth/schema.md 참조).
 *
 * `accountId`는 연관관계 매핑(`@ManyToOne`) 없이 FK 컬럼 값만 들고 있는다 — 지금은
 * "계정 하나의 권한 목록 조회" 이상의 객체 그래프 탐색이 필요 없다.
 */
@Entity
@Table(name = "permission")
class Permission(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    @Column(name = "account_id", nullable = false)
    val accountId: Long,
    @Column(nullable = false)
    val resource: String,
    @Column(name = "can_create", nullable = false)
    val canCreate: Boolean = false,
    @Column(name = "can_read", nullable = false)
    val canRead: Boolean = false,
    @Column(name = "can_update", nullable = false)
    val canUpdate: Boolean = false,
    @Column(name = "can_delete", nullable = false)
    val canDelete: Boolean = false,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),
    @Column(name = "updated_at", nullable = false)
    val updatedAt: Instant = Instant.now(),
)
