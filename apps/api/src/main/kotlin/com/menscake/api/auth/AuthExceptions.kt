package com.menscake.api.auth

/**
 * 로그인 실패(이메일 없음/비밀번호 틀림/비활성 계정)를 원인 구분 없이 통일해서
 * 던진다 — 계정 존재 여부 노출 방지 (docs/spec/auth/api.md 참조).
 */
class InvalidCredentialsException : RuntimeException("이메일 또는 비밀번호가 올바르지 않습니다")

/** Refresh Token이 없거나 만료·철회·위조된 경우 던진다. */
class InvalidRefreshTokenException : RuntimeException("유효하지 않은 세션입니다")
