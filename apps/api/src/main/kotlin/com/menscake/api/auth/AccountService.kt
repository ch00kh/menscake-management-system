package com.menscake.api.auth

import com.menscake.api.auth.dto.AccountCreateRequest
import com.menscake.api.auth.dto.AccountResponse
import com.menscake.api.auth.dto.AccountSearchRequest
import com.menscake.api.auth.dto.AccountUpdateRequest
import com.querydsl.core.BooleanBuilder
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * 계정 CRUD 비즈니스 로직 (docs/spec/account-management/ 참조). 본인 계정 보호 /
 * 마지막 활성 계정 보호는 여기(서비스 계층)에서만 검사한다 — 컨트롤러가 아니라
 * 여기 두는 이유는 이후 다른 진입점(배치 등)이 생겨도 우회할 수 없게 하기 위함
 * (docs/spec/account-management/flow.md 참조).
 */
@Service
class AccountService(
    private val accountRepository: AccountRepository,
    private val permissionRepository: PermissionRepository,
    private val refreshTokenRepository: RefreshTokenRepository,
    private val passwordEncoder: PasswordEncoder,
) {
    fun search(
        request: AccountSearchRequest,
        pageable: Pageable,
    ): Page<AccountResponse> {
        val account = QAccount.account
        val predicate = BooleanBuilder()

        request.query
            ?.takeIf { it.isNotBlank() }
            ?.let { predicate.and(account.name.containsIgnoreCase(it).or(account.email.containsIgnoreCase(it))) }
        request.role?.let { predicate.and(account.role.eq(it)) }
        request.isActive?.let { predicate.and(account.isActive.eq(it)) }

        return accountRepository.findAll(predicate, pageable).map { it.toResponse() }
    }

    @Transactional
    fun create(request: AccountCreateRequest): AccountResponse {
        if (accountRepository.existsByEmail(request.email)) {
            throw DuplicateEmailException(request.email)
        }

        val account =
            accountRepository.save(
                Account(
                    email = request.email,
                    // PasswordEncoder.encode()는 Spring Security 7의 JSpecify @Nullable 시그니처
                    // 때문에 String?을 반환하지만, BCryptPasswordEncoder는 실질적으로 null을
                    // 반환하지 않는다.
                    passwordHash = passwordEncoder.encode(request.password)!!,
                    name = request.name,
                    role = request.role,
                    isActive = true,
                    mustChangePassword = true,
                ),
            )

        return account.toResponse()
    }

    @Transactional
    fun update(
        id: Long,
        requesterId: Long,
        request: AccountUpdateRequest,
    ): AccountResponse {
        val account = accountRepository.findById(id).orElseThrow { AccountNotFoundException(id) }

        if (request.isActive == false) {
            guardSelfProtection(requesterId, id) { SelfAccountProtectionException("본인 계정은 비활성화할 수 없습니다") }
            guardLastActiveAccount(id)
        }

        account.applyProfileUpdate(name = request.name, role = request.role, isActive = request.isActive)
        request.password?.let { account.resetPassword(passwordEncoder.encode(it)!!) }

        return account.toResponse()
    }

    @Transactional
    fun delete(
        id: Long,
        requesterId: Long,
    ) {
        val account = accountRepository.findById(id).orElseThrow { AccountNotFoundException(id) }

        guardSelfProtection(requesterId, id) { SelfAccountProtectionException("본인 계정은 삭제할 수 없습니다") }
        guardLastActiveAccount(id)

        permissionRepository.deleteByAccountId(id)
        refreshTokenRepository.deleteByAccountId(id)
        accountRepository.delete(account)
    }

    private fun guardSelfProtection(
        requesterId: Long,
        targetId: Long,
        exception: () -> RuntimeException,
    ) {
        if (requesterId == targetId) throw exception()
    }

    /** 대상을 제외하고 활성 계정이 0명이 되면 마지막 활성 계정 보호 위반 (docs/spec/account-management/flow.md 참조). */
    private fun guardLastActiveAccount(targetId: Long) {
        if (accountRepository.countByIsActiveTrueAndIdNot(targetId) == 0L) {
            throw LastActiveAccountException()
        }
    }

    private fun Account.toResponse() =
        AccountResponse(
            id = id,
            email = email,
            name = name,
            role = role,
            isActive = isActive,
            mustChangePassword = mustChangePassword,
            createdAt = createdAt,
        )
}
