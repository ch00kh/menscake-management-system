package com.menscake.api.auth.dto

import com.menscake.api.auth.Role

/**
 * `GET /api/accounts` 쿼리 파라미터 — 페이지네이션(`page`/`size`/`sort`)은
 * `docs/rule/api-response-convention.md`의 공통 규칙을 따르는 `Pageable`로 별도
 * 처리하고, 이 DTO는 검색/필터 조건만 담는다 (docs/spec/account-management/api.md 참조).
 */
data class AccountSearchRequest(
    val query: String? = null,
    val role: Role? = null,
    val isActive: Boolean? = null,
)
