package com.menscake.api.auth

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor

/**
 * [QuerydslPredicateExecutor]를 얹어 `GET /api/accounts`의 동적 검색/필터
 * (`query`/`role`/`isActive` 조합)를 QueryDSL로 타입-세이프하게 구성한다
 * (`docs/rule/tech-stack.md`의 QueryDSL 용도 참조).
 */
interface AccountRepository :
    JpaRepository<Account, Long>,
    QuerydslPredicateExecutor<Account> {
    fun findByEmail(email: String): Account?

    fun existsByEmail(email: String): Boolean

    /** 대상(id)을 제외하고 활성 계정이 몇 명 남는지 — 마지막 활성 계정 보호 검사에 쓰인다. */
    fun countByIsActiveTrueAndIdNot(id: Long): Long
}
