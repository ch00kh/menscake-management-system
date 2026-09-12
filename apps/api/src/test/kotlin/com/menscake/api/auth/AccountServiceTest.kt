package com.menscake.api.auth

import com.menscake.api.auth.dto.AccountCreateRequest
import com.menscake.api.auth.dto.AccountUpdateRequest
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.security.crypto.password.PasswordEncoder
import java.util.Optional
import kotlin.test.assertEquals
import kotlin.test.assertFalse

class AccountServiceTest {
    private val accountRepository = mockk<AccountRepository>()
    private val permissionRepository = mockk<PermissionRepository>(relaxUnitFun = true)
    private val refreshTokenRepository = mockk<RefreshTokenRepository>(relaxUnitFun = true)
    private val passwordEncoder = mockk<PasswordEncoder>()

    private val accountService =
        AccountService(accountRepository, permissionRepository, refreshTokenRepository, passwordEncoder)

    private fun account(
        id: Long = 1,
        email: String = "staff@menscake.com",
        role: Role = Role.STAFF,
        isActive: Boolean = true,
        mustChangePassword: Boolean = false,
    ) = Account(
        id = id,
        email = email,
        passwordHash = "hashed",
        name = "직원",
        role = role,
        isActive = isActive,
        mustChangePassword = mustChangePassword,
    )

    // ---------- create ----------

    @Test
    fun `계정 생성 성공 시 mustChangePassword=true, isActive=true로 시작한다`() {
        every { accountRepository.existsByEmail("new@menscake.com") } returns false
        every { passwordEncoder.encode("initial-password") } returns "encoded"
        every { accountRepository.save(any()) } answers { firstArg() }

        val response =
            accountService.create(
                AccountCreateRequest(
                    email = "new@menscake.com",
                    name = "신규직원",
                    role = Role.STAFF,
                    password = "initial-password",
                ),
            )

        assertTrue(response.mustChangePassword)
        assertTrue(response.isActive)
        assertEquals("new@menscake.com", response.email)
    }

    @Test
    fun `이메일이 중복되면 DuplicateEmailException`() {
        every { accountRepository.existsByEmail("dup@menscake.com") } returns true

        assertThrows(DuplicateEmailException::class.java) {
            accountService.create(
                AccountCreateRequest(email = "dup@menscake.com", name = "중복", role = Role.STAFF, password = "pw"),
            )
        }
    }

    // ---------- update: 본인/마지막 활성 계정 보호 ----------

    @Test
    fun `본인 계정을 비활성화하려 하면 SelfAccountProtectionException`() {
        val self = account(id = 1)
        every { accountRepository.findById(1) } returns Optional.of(self)

        assertThrows(SelfAccountProtectionException::class.java) {
            accountService.update(id = 1, requesterId = 1, request = AccountUpdateRequest(isActive = false))
        }
    }

    @Test
    fun `마지막 남은 활성 계정을 비활성화하려 하면 LastActiveAccountException`() {
        val target = account(id = 2)
        every { accountRepository.findById(2) } returns Optional.of(target)
        every { accountRepository.countByIsActiveTrueAndIdNot(2) } returns 0L

        assertThrows(LastActiveAccountException::class.java) {
            accountService.update(id = 2, requesterId = 1, request = AccountUpdateRequest(isActive = false))
        }
    }

    @Test
    fun `다른 활성 계정이 남아있으면 비활성화가 성공한다`() {
        val target = account(id = 2)
        every { accountRepository.findById(2) } returns Optional.of(target)
        every { accountRepository.countByIsActiveTrueAndIdNot(2) } returns 1L

        val response = accountService.update(id = 2, requesterId = 1, request = AccountUpdateRequest(isActive = false))

        assertFalse(response.isActive)
    }

    @Test
    fun `비밀번호를 재설정하면 mustChangePassword가 true로 되돌아간다`() {
        val target = account(id = 2, mustChangePassword = false)
        every { accountRepository.findById(2) } returns Optional.of(target)
        every { passwordEncoder.encode("new-password") } returns "new-encoded"

        val response =
            accountService.update(id = 2, requesterId = 1, request = AccountUpdateRequest(password = "new-password"))

        assertTrue(response.mustChangePassword)
    }

    @Test
    fun `이름과 역할 변경은 본인 계정 보호 검사를 거치지 않는다`() {
        val self = account(id = 1)
        every { accountRepository.findById(1) } returns Optional.of(self)

        val response = accountService.update(id = 1, requesterId = 1, request = AccountUpdateRequest(name = "새이름"))

        assertEquals("새이름", response.name)
    }

    @Test
    fun `존재하지 않는 id를 수정하려 하면 AccountNotFoundException`() {
        every { accountRepository.findById(999) } returns Optional.empty()

        assertThrows(AccountNotFoundException::class.java) {
            accountService.update(id = 999, requesterId = 1, request = AccountUpdateRequest(name = "x"))
        }
    }

    // ---------- delete: 본인/마지막 계정 보호 + 연쇄 삭제 ----------

    @Test
    fun `본인 계정을 삭제하려 하면 SelfAccountProtectionException`() {
        val self = account(id = 1)
        every { accountRepository.findById(1) } returns Optional.of(self)

        assertThrows(SelfAccountProtectionException::class.java) {
            accountService.delete(id = 1, requesterId = 1)
        }
    }

    @Test
    fun `마지막 남은 활성 계정을 삭제하려 하면 LastActiveAccountException`() {
        val target = account(id = 2)
        every { accountRepository.findById(2) } returns Optional.of(target)
        every { accountRepository.countByIsActiveTrueAndIdNot(2) } returns 0L

        assertThrows(LastActiveAccountException::class.java) {
            accountService.delete(id = 2, requesterId = 1)
        }
    }

    @Test
    fun `삭제 성공 시 permission, refresh_token을 연쇄 삭제한다`() {
        val target = account(id = 2)
        every { accountRepository.findById(2) } returns Optional.of(target)
        every { accountRepository.countByIsActiveTrueAndIdNot(2) } returns 1L
        every { accountRepository.delete(target) } returns Unit

        accountService.delete(id = 2, requesterId = 1)

        verify { permissionRepository.deleteByAccountId(2) }
        verify { refreshTokenRepository.deleteByAccountId(2) }
        verify { accountRepository.delete(target) }
    }

    @Test
    fun `존재하지 않는 id를 삭제하려 하면 AccountNotFoundException`() {
        every { accountRepository.findById(999) } returns Optional.empty()

        assertThrows(AccountNotFoundException::class.java) {
            accountService.delete(id = 999, requesterId = 1)
        }
    }
}
