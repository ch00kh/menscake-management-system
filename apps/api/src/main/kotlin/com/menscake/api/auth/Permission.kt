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
 * 없어 FK가 아닌 자유 문자열 키다 (docs/spec/auth/schema.md 참조). 권한 관리 화면
 * (`docs/spec/permission-management/`)에서는 [PermissionResource] 화이트리스트의
 * `key` 중 하나여야 한다.
 *
 * `accountId`는 연관관계 매핑(`@ManyToOne`) 없이 FK 컬럼 값만 들고 있는다 — 지금은
 * "계정 하나의 권한 목록 조회" 이상의 객체 그래프 탐색이 필요 없다.
 *
 * CRUD 플래그는 `var`로 두고 [applyPermissionUpdate]를 통해서만 바꾼다 —
 * [Account.applyProfileUpdate]와 같은 방식으로 엔티티가 자기 상태 전이를 스스로
 * 책임진다 (`docs/rule/naming-convention.md` 참조).
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
    var canCreate: Boolean = false,
    @Column(name = "can_read", nullable = false)
    var canRead: Boolean = false,
    @Column(name = "can_update", nullable = false)
    var canUpdate: Boolean = false,
    @Column(name = "can_delete", nullable = false)
    var canDelete: Boolean = false,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),
    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),
) {
    /**
     * 권한 관리 화면의 매트릭스 저장(`PUT /api/accounts/{id}/permissions`) — CRUD 4개
     * 플래그를 통째로 갱신한다 (docs/spec/permission-management/api.md 참조).
     */
    fun applyPermissionUpdate(
        canCreate: Boolean,
        canRead: Boolean,
        canUpdate: Boolean,
        canDelete: Boolean,
    ) {
        this.canCreate = canCreate
        this.canRead = canRead
        this.canUpdate = canUpdate
        this.canDelete = canDelete
        this.updatedAt = Instant.now()
    }
}
