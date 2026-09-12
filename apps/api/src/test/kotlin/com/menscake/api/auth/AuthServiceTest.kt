package com.menscake.api.auth

import com.menscake.api.auth.jwt.JwtProperties
import com.menscake.api.auth.jwt.JwtService
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.security.crypto.password.PasswordEncoder
import java.security.MessageDigest
import java.time.Duration
import java.time.Instant
import java.util.Base64
import java.util.Optional
import kotlin.test.assertEquals

class AuthServiceTest {
    private val accountRepository = mockk<AccountRepository>()
    private val permissionRepository = mockk<PermissionRepository>()
    private val refreshTokenRepository = mockk<RefreshTokenRepository>()
    private val passwordEncoder = mockk<PasswordEncoder>()
    private val jwtService = mockk<JwtService>()
    private val jwtProperties =
        JwtProperties(secret = "unused", accessTokenTtl = Duration.ofMinutes(15), refreshTokenTtl = Duration.ofDays(14))

    private val authService =
        AuthService(
            accountRepository,
            permissionRepository,
            refreshTokenRepository,
            passwordEncoder,
            jwtService,
            jwtProperties,
        )

    private val account =
        Account(id = 1, email = "admin@menscake.com", passwordHash = "hashed", name = "관리자", role = Role.ADMIN)

    @BeforeEach
    fun setUp() {
        every { permissionRepository.findByAccountId(any()) } returns emptyList()
        every { jwtService.issueAccessToken(any(), any()) } returns "access-token"
        every { refreshTokenRepository.save(any()) } answers { firstArg() }
    }

    @Test
    fun `로그인 성공 시 access token과 refresh token을 발급한다`() {
        every { accountRepository.findByEmail("admin@menscake.com") } returns account
        every { passwordEncoder.matches("password", "hashed") } returns true

        val result = authService.login("admin@menscake.com", "password")

        assertEquals("access-token", result.response.accessToken)
        assertNotNull(result.rawRefreshToken)
        verify { refreshTokenRepository.save(any()) }
    }

    @Test
    fun `비밀번호가 틀리면 InvalidCredentialsException`() {
        every { accountRepository.findByEmail("admin@menscake.com") } returns account
        every { passwordEncoder.matches("wrong", "hashed") } returns false

        assertThrows(InvalidCredentialsException::class.java) {
            authService.login("admin@menscake.com", "wrong")
        }
    }

    @Test
    fun `존재하지 않는 이메일이면 InvalidCredentialsException`() {
        every { accountRepository.findByEmail("nobody@menscake.com") } returns null

        assertThrows(InvalidCredentialsException::class.java) {
            authService.login("nobody@menscake.com", "password")
        }
    }

    @Test
    fun `비활성 계정이면 InvalidCredentialsException`() {
        val inactive =
            Account(
                id = 2,
                email = "inactive@menscake.com",
                passwordHash = "hashed",
                name = "정지계정",
                role = Role.STAFF,
                isActive = false,
            )
        every { accountRepository.findByEmail("inactive@menscake.com") } returns inactive

        assertThrows(InvalidCredentialsException::class.java) {
            authService.login("inactive@menscake.com", "password")
        }
    }

    @Test
    fun `refresh 성공 시 기존 토큰을 철회하고 새 토큰을 발급한다`() {
        val rawRefreshToken = "raw-refresh-token"
        val stored =
            RefreshToken(
                id = 10,
                accountId = 1,
                tokenHash = sha256(rawRefreshToken),
                expiresAt = Instant.now().plusSeconds(60),
            )
        every { refreshTokenRepository.findByTokenHash(sha256(rawRefreshToken)) } returns stored
        every { accountRepository.findById(1) } returns Optional.of(account)

        val refreshed = authService.refresh(rawRefreshToken)

        assertNotNull(refreshed.rawRefreshToken)
        assertNotNull(stored.revokedAt)
    }

    @Test
    fun `만료된 refresh token은 InvalidRefreshTokenException`() {
        val expired =
            RefreshToken(id = 11, accountId = 1, tokenHash = "hash", expiresAt = Instant.now().minusSeconds(1))
        every { refreshTokenRepository.findByTokenHash(any()) } returns expired

        assertThrows(InvalidRefreshTokenException::class.java) {
            authService.refresh("whatever")
        }
    }

    @Test
    fun `이미 철회된 refresh token은 InvalidRefreshTokenException`() {
        val revoked =
            RefreshToken(id = 12, accountId = 1, tokenHash = "hash", expiresAt = Instant.now().plusSeconds(60))
        revoked.revoke()
        every { refreshTokenRepository.findByTokenHash(any()) } returns revoked

        assertThrows(InvalidRefreshTokenException::class.java) {
            authService.refresh("whatever")
        }
    }

    @Test
    fun `logout은 존재하지 않는 토큰이어도 예외 없이 멱등하게 끝난다`() {
        every { refreshTokenRepository.findByTokenHash(any()) } returns null

        authService.logout("no-such-token")
    }

    @Test
    fun `logout은 이미 철회된 토큰을 다시 철회하지 않는다`() {
        val revokedAt = Instant.now().minusSeconds(600)
        val alreadyRevoked =
            RefreshToken(id = 13, accountId = 1, tokenHash = "hash", expiresAt = Instant.now().plusSeconds(60))
        alreadyRevoked.revoke(revokedAt)
        every { refreshTokenRepository.findByTokenHash(any()) } returns alreadyRevoked

        authService.logout("whatever")

        assertEquals(revokedAt, alreadyRevoked.revokedAt)
    }

    private fun sha256(rawToken: String): String {
        val digest = MessageDigest.getInstance("SHA-256").digest(rawToken.toByteArray())
        return Base64.getEncoder().encodeToString(digest)
    }

    // ---------- mustChangePassword ----------

    @Test
    fun `로그인 응답의 account에 mustChangePassword가 그대로 실린다`() {
        val mustChangeAccount =
            Account(
                id = 3,
                email = "new-hire@menscake.com",
                passwordHash = "hashed",
                name = "신규직원",
                role = Role.STAFF,
                mustChangePassword = true,
            )
        every { accountRepository.findByEmail("new-hire@menscake.com") } returns mustChangeAccount
        every { passwordEncoder.matches("password", "hashed") } returns true

        val result = authService.login("new-hire@menscake.com", "password")

        assertEquals(true, result.response.account.mustChangePassword)
    }

    // ---------- change-password ----------

    @Test
    fun `현재 비밀번호가 맞으면 비밀번호를 바꾸고 mustChangePassword를 false로 되돌린다`() {
        val target =
            Account(
                id = 5,
                email = "staff@menscake.com",
                passwordHash = "old-hashed",
                name = "직원",
                role = Role.STAFF,
                mustChangePassword = true,
            )
        every { accountRepository.findById(5) } returns Optional.of(target)
        every { passwordEncoder.matches("current", "old-hashed") } returns true
        every { passwordEncoder.encode("new-password") } returns "new-hashed"

        authService.changePassword(5, "current", "new-password")

        assertEquals("new-hashed", target.passwordHash)
        assertEquals(false, target.mustChangePassword)
    }

    @Test
    fun `현재 비밀번호가 틀리면 InvalidCurrentPasswordException`() {
        val target =
            Account(id = 5, email = "staff@menscake.com", passwordHash = "old-hashed", name = "직원", role = Role.STAFF)
        every { accountRepository.findById(5) } returns Optional.of(target)
        every { passwordEncoder.matches("wrong", "old-hashed") } returns false

        assertThrows(InvalidCurrentPasswordException::class.java) {
            authService.changePassword(5, "wrong", "new-password")
        }
    }
}
