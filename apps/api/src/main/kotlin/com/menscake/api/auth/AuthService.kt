package com.menscake.api.auth

import com.menscake.api.auth.dto.AccountSummary
import com.menscake.api.auth.dto.AuthResponse
import com.menscake.api.auth.dto.PermissionSummary
import com.menscake.api.auth.jwt.JwtProperties
import com.menscake.api.auth.jwt.JwtService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.Instant
import java.util.Base64

/** [AuthService.login]/[AuthService.refresh] 성공 시 컨트롤러에 돌려줄 결과. */
data class AuthResult(
    val response: AuthResponse,
    val rawRefreshToken: String,
)

@Service
class AuthService(
    private val accountRepository: AccountRepository,
    private val permissionRepository: PermissionRepository,
    private val refreshTokenRepository: RefreshTokenRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
    private val jwtProperties: JwtProperties,
) {
    @Transactional
    fun login(
        email: String,
        rawPassword: String,
    ): AuthResult {
        val account =
            accountRepository
                .findByEmail(email)
                ?.takeIf { it.isActive }
                ?.takeIf { passwordEncoder.matches(rawPassword, it.passwordHash) }
                ?: throw InvalidCredentialsException()

        return issueSession(account)
    }

    @Transactional
    fun refresh(rawRefreshToken: String): AuthResult {
        val stored =
            refreshTokenRepository
                .findByTokenHash(hash(rawRefreshToken))
                ?.takeIf { it.isValid() }
                ?: throw InvalidRefreshTokenException()

        stored.revoke()

        val account =
            accountRepository
                .findById(stored.accountId)
                .orElse(null)
                ?.takeIf { it.isActive }
                ?: throw InvalidRefreshTokenException()

        return issueSession(account)
    }

    /** 못 찾거나 이미 철회됐어도 멱등하게 성공 처리한다 (docs/spec/auth/api.md 참조). */
    @Transactional
    fun logout(rawRefreshToken: String) {
        refreshTokenRepository
            .findByTokenHash(hash(rawRefreshToken))
            ?.takeIf { it.revokedAt == null }
            ?.revoke()
    }

    /**
     * 인증된 본인의 `POST /api/auth/change-password` — 다른 계정 대상 아님, 별도
     * 권한 체크 불필요 (docs/spec/account-management/api.md 참조). 성공 시
     * `mustChangePassword`를 `false`로 되돌린다.
     */
    @Transactional
    fun changePassword(
        accountId: Long,
        currentPassword: String,
        newPassword: String,
    ) {
        val account =
            accountRepository
                .findById(accountId)
                .orElseThrow { InvalidCurrentPasswordException() }

        if (!passwordEncoder.matches(currentPassword, account.passwordHash)) {
            throw InvalidCurrentPasswordException()
        }

        // PasswordEncoder.encode()는 Spring Security 7의 JSpecify @Nullable 시그니처
        // 때문에 String?을 반환하지만, BCryptPasswordEncoder는 실질적으로 null을 반환하지 않는다.
        account.changeOwnPassword(passwordEncoder.encode(newPassword)!!)
    }

    private fun issueSession(account: Account): AuthResult {
        val permissions =
            permissionRepository.findByAccountId(account.id).map {
                PermissionSummary(
                    resource = it.resource,
                    canCreate = it.canCreate,
                    canRead = it.canRead,
                    canUpdate = it.canUpdate,
                    canDelete = it.canDelete,
                )
            }

        val accessToken = jwtService.issueAccessToken(account, permissions)
        val rawRefreshToken = generateRefreshToken()
        refreshTokenRepository.save(
            RefreshToken(
                accountId = account.id,
                tokenHash = hash(rawRefreshToken),
                expiresAt = Instant.now().plus(jwtProperties.refreshTokenTtl),
            ),
        )

        val response =
            AuthResponse(
                accessToken = accessToken,
                account =
                    AccountSummary(
                        id = account.id,
                        name = account.name,
                        email = account.email,
                        role = account.role,
                        mustChangePassword = account.mustChangePassword,
                    ),
                permissions = permissions,
            )

        return AuthResult(response, rawRefreshToken)
    }

    private fun generateRefreshToken(): String {
        val bytes = ByteArray(64)
        SecureRandom().nextBytes(bytes)
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
    }

    /**
     * Refresh Token은 이미 64바이트 랜덤이라 엔트로피가 충분하다 — 비밀번호와 달리
     * 느린 salted 해시(BCrypt)가 필요 없고, 오히려 BCrypt는 매번 다른 salt를 써서
     * 해시값으로 조회(lookup)할 수 없다. 그래서 결정적인 SHA-256을 쓴다.
     */
    private fun hash(rawToken: String): String {
        val digest = MessageDigest.getInstance("SHA-256").digest(rawToken.toByteArray())
        return Base64.getEncoder().encodeToString(digest)
    }
}
