package com.menscake.api.auth

import com.menscake.api.TestcontainersConfiguration
import com.menscake.api.auth.dto.AccountCreateRequest
import com.menscake.api.auth.dto.AccountUpdateRequest
import com.menscake.api.auth.dto.LoginRequest
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.ObjectMapper
import kotlin.test.assertEquals

/**
 * `GET/POST/PATCH/DELETE /api/accounts` 전체 흐름을 Testcontainers PostgreSQL
 * (+ Flyway 시드 admin 계정 + `accounts` 권한) 기준으로 검증한다.
 * 계약은 docs/spec/account-management/api.md 참조.
 *
 * 본인/마지막 활성 계정 보호는 [AccountServiceTest]에서 리포지토리를 mock해 이미
 * 정밀하게 검증했다 — 여기서는 admin 계정에 대한 본인 보호(400)만 통합 레벨로
 * 재확인한다. "마지막 활성 계정" 케이스는 시드 admin이 항상 활성 상태로 남아있어
 * 통합 테스트에서 재현하려면 admin까지 인위적으로 비활성화해야 해 오히려 다른
 * 테스트를 깨뜨릴 위험이 크다 — 서비스 단위 테스트로 충분하다고 판단했다.
 */
@Import(TestcontainersConfiguration::class)
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AccountControllerIntegrationTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Autowired
    private lateinit var accountRepository: AccountRepository

    @Autowired
    private lateinit var permissionRepository: PermissionRepository

    @Autowired
    private lateinit var refreshTokenRepository: RefreshTokenRepository

    @Autowired
    private lateinit var passwordEncoder: PasswordEncoder

    // application-test.yml의 spring.flyway.placeholders와 일치해야 한다.
    private val adminEmail = "admin@test.menscake.com"
    private val adminPassword = "test-admin-password-only"

    @Test
    fun `인증 없이 계정 목록을 조회하면 401이다`() {
        mockMvc.perform(get("/api/accounts")).andExpect(status().isUnauthorized)
    }

    @Test
    fun `accounts 권한이 없는 계정은 403이다`() {
        val email = "no-permission@test.menscake.com"
        createRawAccount(email, "password-1234", Role.STAFF)
        val accessToken = loginAndGetAccessToken(email, "password-1234")

        mockMvc
            .perform(get("/api/accounts").header("Authorization", "Bearer $accessToken"))
            .andExpect(status().isForbidden)
    }

    @Test
    fun `admin 시드 계정은 accounts 권한으로 목록을 조회할 수 있다`() {
        val accessToken = loginAndGetAccessToken(adminEmail, adminPassword)

        mockMvc
            .perform(get("/api/accounts").header("Authorization", "Bearer $accessToken"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.data.content").isArray)
    }

    @Test
    fun `계정 생성 성공 시 201과 mustChangePassword=true, isActive=true를 반환한다`() {
        val accessToken = loginAndGetAccessToken(adminEmail, adminPassword)

        mockMvc
            .perform(
                post("/api/accounts")
                    .header("Authorization", "Bearer $accessToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        objectMapper.writeValueAsString(
                            AccountCreateRequest(
                                email = "created@test.menscake.com",
                                name = "새직원",
                                role = Role.STAFF,
                                password = "initial-password-1234",
                            ),
                        ),
                    ),
            ).andExpect(status().isCreated)
            .andExpect(jsonPath("$.data.email").value("created@test.menscake.com"))
            .andExpect(jsonPath("$.data.mustChangePassword").value(true))
            .andExpect(jsonPath("$.data.isActive").value(true))
    }

    @Test
    fun `이메일이 중복되면 409다`() {
        val accessToken = loginAndGetAccessToken(adminEmail, adminPassword)
        createRawAccount("dup@test.menscake.com", "password-1234", Role.STAFF)

        mockMvc
            .perform(
                post("/api/accounts")
                    .header("Authorization", "Bearer $accessToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        objectMapper.writeValueAsString(
                            AccountCreateRequest(
                                email = "dup@test.menscake.com",
                                name = "중복",
                                role = Role.STAFF,
                                password = "password-1234",
                            ),
                        ),
                    ),
            ).andExpect(status().isConflict)
    }

    @Test
    fun `필수 필드가 비어 있으면 400이다`() {
        val accessToken = loginAndGetAccessToken(adminEmail, adminPassword)

        mockMvc
            .perform(
                post("/api/accounts")
                    .header("Authorization", "Bearer $accessToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"email":"","name":"","role":"STAFF","password":""}"""),
            ).andExpect(status().isBadRequest)
    }

    @Test
    fun `계정 수정 성공 시 이름과 역할이 바뀐다`() {
        val accessToken = loginAndGetAccessToken(adminEmail, adminPassword)
        val target = createRawAccount("update-target@test.menscake.com", "password-1234", Role.STAFF)

        mockMvc
            .perform(
                patch("/api/accounts/${target.id}")
                    .header("Authorization", "Bearer $accessToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(AccountUpdateRequest(name = "바뀐이름", role = Role.MANAGER))),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.data.name").value("바뀐이름"))
            .andExpect(jsonPath("$.data.role").value("MANAGER"))
    }

    @Test
    fun `비밀번호를 재설정하면 mustChangePassword가 true로 되돌아간다`() {
        val accessToken = loginAndGetAccessToken(adminEmail, adminPassword)
        val target =
            createRawAccount("reset-target@test.menscake.com", "password-1234", Role.STAFF, mustChangePassword = false)

        mockMvc
            .perform(
                patch("/api/accounts/${target.id}")
                    .header("Authorization", "Bearer $accessToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(AccountUpdateRequest(password = "reset-password-1234"))),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.data.mustChangePassword").value(true))
    }

    @Test
    fun `존재하지 않는 계정을 수정하면 404다`() {
        val accessToken = loginAndGetAccessToken(adminEmail, adminPassword)

        mockMvc
            .perform(
                patch("/api/accounts/999999")
                    .header("Authorization", "Bearer $accessToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(AccountUpdateRequest(name = "x"))),
            ).andExpect(status().isNotFound)
    }

    @Test
    fun `본인 계정을 비활성화하려 하면 400이다`() {
        val accessToken = loginAndGetAccessToken(adminEmail, adminPassword)
        val adminId = accountRepository.findByEmail(adminEmail)!!.id

        mockMvc
            .perform(
                patch("/api/accounts/$adminId")
                    .header("Authorization", "Bearer $accessToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(AccountUpdateRequest(isActive = false))),
            ).andExpect(status().isBadRequest)
    }

    @Test
    fun `본인 계정을 삭제하려 하면 400이다`() {
        val accessToken = loginAndGetAccessToken(adminEmail, adminPassword)
        val adminId = accountRepository.findByEmail(adminEmail)!!.id

        mockMvc
            .perform(delete("/api/accounts/$adminId").header("Authorization", "Bearer $accessToken"))
            .andExpect(status().isBadRequest)
    }

    @Test
    fun `존재하지 않는 계정을 삭제하면 404다`() {
        val accessToken = loginAndGetAccessToken(adminEmail, adminPassword)

        mockMvc
            .perform(delete("/api/accounts/999999").header("Authorization", "Bearer $accessToken"))
            .andExpect(status().isNotFound)
    }

    @Test
    fun `계정 삭제 성공 시 204이고 permission, refresh_token도 함께 사라진다`() {
        val accessToken = loginAndGetAccessToken(adminEmail, adminPassword)
        val target = createRawAccount("delete-target@test.menscake.com", "password-1234", Role.STAFF)
        permissionRepository.save(
            Permission(accountId = target.id, resource = "orders", canRead = true),
        )
        // refresh_token 행을 하나 만들어둔다 (본인 로그인).
        loginAndGetAccessToken("delete-target@test.menscake.com", "password-1234")

        mockMvc
            .perform(delete("/api/accounts/${target.id}").header("Authorization", "Bearer $accessToken"))
            .andExpect(status().isNoContent)

        assertEquals(true, accountRepository.findById(target.id).isEmpty)
        assertEquals(emptyList(), permissionRepository.findByAccountId(target.id))
        assertEquals(true, refreshTokenRepository.findAll().none { it.accountId == target.id })
    }

    private fun createRawAccount(
        email: String,
        rawPassword: String,
        role: Role,
        mustChangePassword: Boolean = true,
    ): Account =
        accountRepository.save(
            Account(
                email = email,
                passwordHash = passwordEncoder.encode(rawPassword)!!,
                name = "테스트계정",
                role = role,
                mustChangePassword = mustChangePassword,
            ),
        )

    private fun loginAndGetAccessToken(
        email: String,
        password: String,
    ): String {
        val loginResult =
            mockMvc
                .perform(
                    post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(LoginRequest(email, password))),
                ).andReturn()
        val body = loginResult.response.contentAsString
        val node = objectMapper.readTree(body)
        return node.get("data").get("accessToken").asText()
    }
}
