package com.menscake.api.auth.permission

/** 권한 체크의 동작 단위 (docs/glossary.md 참조). */
enum class Action {
    CREATE,
    READ,
    UPDATE,
    DELETE,
}
