package com.menscake.api.auth

/**
 * 계정 분류 라벨. 인가 판단에는 쓰지 않는다 — 실제 권한은 [Permission]이 전담한다
 * (docs/rule/naming-convention.md의 상태/분류 구분 참조).
 */
enum class Role {
    ADMIN,
    MANAGER,
    STAFF,
}
