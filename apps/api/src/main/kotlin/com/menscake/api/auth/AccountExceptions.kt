package com.menscake.api.auth

/** `GET/PATCH/DELETE /api/accounts/{id}`에서 존재하지 않는 id를 조회/수정/삭제하려는 경우. */
class AccountNotFoundException(
    id: Long,
) : RuntimeException("계정을 찾을 수 없습니다: $id")

/** `POST /api/accounts`에서 이미 존재하는 `email`로 계정을 생성하려는 경우. */
class DuplicateEmailException(
    email: String,
) : RuntimeException("이미 사용 중인 이메일입니다: $email")

/**
 * 본인 계정 보호 — 로그인한 본인 계정을 비활성화(`PATCH`)하거나 삭제(`DELETE`)하려는
 * 경우 던진다 (docs/spec/account-management/flow.md 참조).
 */
class SelfAccountProtectionException(
    message: String,
) : RuntimeException(message)

/**
 * 마지막 활성 계정 보호 — 대상을 제외하고 활성(`isActive=true`) 계정이 0명이 되는
 * 비활성화/삭제 요청일 때 던진다 (docs/spec/account-management/flow.md 참조).
 */
class LastActiveAccountException : RuntimeException("마지막 남은 활성 계정입니다")
