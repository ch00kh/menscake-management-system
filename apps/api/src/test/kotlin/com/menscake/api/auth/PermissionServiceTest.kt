package com.menscake.api.auth

import com.menscake.api.auth.dto.PermissionUpdateRequest
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.util.Optional
import kotlin.test.assertTrue

class PermissionServiceTest {
    private val accountRepository = mockk<AccountRepository>()
    private val permissionRepository = mockk<PermissionRepository>()

    private val permissionService = PermissionService(accountRepository, permissionRepository)

    private fun account(id: Long = 1) =
        Account(
            id = id,
            email = "user$id@menscake.com",
            passwordHash = "hashed",
            name = "사용자",
            role = Role.STAFF,
        )

    private fun requests(
        permissionsCanRead: Boolean = true,
        permissionsCanUpdate: Boolean = true,
    ) = listOf(
        PermissionUpdateRequest(resource = "accounts", canCreate = false, canRead = true, canUpdate = false, canDelete = false),
        PermissionUpdateRequest(
            resource = "permissions",
            canCreate = false,
            canRead = permissionsCanRead,
            canUpdate = permissionsCanUpdate,
            canDelete = false,
        ),
    )

    // ---------- 자기잠금 판정 ----------

    @Test
    fun `본인 계정의 permissions 리소스 canRead를 false로 내리면 SelfAccountProtectionException, 아무 것도 저장되지 않는다`() {
        every { accountRepository.findById(1) } returns Optional.of(account(1))

        assertThrows(SelfAccountProtectionException::class.java) {
            permissionService.updatePermissions(accountId = 1, requesterId = 1, requests = requests(permissionsCanRead = false))
        }

        verify(exactly = 0) { permissionRepository.save(any()) }
    }

    @Test
    fun `본인 계정의 permissions 리소스 canUpdate를 false로 내리면 SelfAccountProtectionException, 아무 것도 저장되지 않는다`() {
        every { accountRepository.findById(1) } returns Optional.of(account(1))

        assertThrows(SelfAccountProtectionException::class.java) {
            permissionService.updatePermissions(accountId = 1, requesterId = 1, requests = requests(permissionsCanUpdate = false))
        }

        verify(exactly = 0) { permissionRepository.save(any()) }
    }

    @Test
    fun `본인 계정이라도 permissions 리소스의 canRead canUpdate가 모두 유지되면 통과한다`() {
        every { accountRepository.findById(1) } returns Optional.of(account(1))
        every { permissionRepository.findByAccountId(1) } returns emptyList()
        every { permissionRepository.save(any()) } answers { firstArg() }

        permissionService.updatePermissions(accountId = 1, requesterId = 1, requests = requests())

        verify(exactly = 2) { permissionRepository.save(any()) }
    }

    @Test
    fun `본인이 아닌 다른 계정 대상이면 permissions 값이 어떻든 통과한다`() {
        every { accountRepository.findById(2) } returns Optional.of(account(2))
        every { permissionRepository.findByAccountId(2) } returns emptyList()
        every { permissionRepository.save(any()) } answers { firstArg() }

        permissionService.updatePermissions(
            accountId = 2,
            requesterId = 1,
            requests = requests(permissionsCanRead = false, permissionsCanUpdate = false),
        )

        verify(exactly = 2) { permissionRepository.save(any()) }
    }

    // ---------- upsert ----------

    @Test
    fun `기존 행이 있는 리소스는 갱신하고 없는 리소스는 생성한다`() {
        val existing = Permission(id = 10, accountId = 2, resource = "accounts", canRead = false)
        every { accountRepository.findById(2) } returns Optional.of(account(2))
        every { permissionRepository.findByAccountId(2) } returns listOf(existing)
        every { permissionRepository.save(any()) } answers { firstArg() }

        permissionService.updatePermissions(
            accountId = 2,
            requesterId = 1,
            requests =
                listOf(
                    PermissionUpdateRequest(resource = "accounts", canCreate = false, canRead = true, canUpdate = false, canDelete = false),
                    PermissionUpdateRequest(
                        resource = "permissions",
                        canCreate = false,
                        canRead = true,
                        canUpdate = true,
                        canDelete = false,
                    ),
                ),
        )

        assertTrue(existing.canRead)
        verify(exactly = 1) { permissionRepository.save(match { it.resource == "permissions" }) }
        verify(exactly = 0) { permissionRepository.save(match { it.resource == "accounts" }) }
    }

    // ---------- 화이트리스트 검증(원자성) ----------

    @Test
    fun `화이트리스트에 없는 resource 키가 있으면 UnknownPermissionResourceException, 아무 것도 저장되지 않는다`() {
        assertThrows(UnknownPermissionResourceException::class.java) {
            permissionService.updatePermissions(
                accountId = 2,
                requesterId = 1,
                requests =
                    listOf(
                        PermissionUpdateRequest(
                            resource = "orders",
                            canCreate = false,
                            canRead = true,
                            canUpdate = false,
                            canDelete = false,
                        ),
                    ),
            )
        }

        verify(exactly = 0) { accountRepository.findById(any()) }
        verify(exactly = 0) { permissionRepository.save(any()) }
    }
}
