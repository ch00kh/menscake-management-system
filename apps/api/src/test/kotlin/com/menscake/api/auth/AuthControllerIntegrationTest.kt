package com.menscake.api.auth

import com.menscake.api.TestcontainersConfiguration
import com.menscake.api.auth.dto.ChangePasswordRequest
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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.ObjectMapper

/**
 * login/refresh/logout 전체 흐름을 Testcontainers PostgreSQL(+Flyway 시드 admin 계정)
 * 기준으로 검증한다. 계약은 docs/spec/auth/api.md 참조.
 */
@Import(TestcontainersConfiguration::class)
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Autowired
    private lateinit var accountRepository: AccountRepository

    @Autowired
    private lateinit var passwordEncoder: PasswordEncoder

    // application-test.yml의 spring.flyway.placeholders와 일치해야 한다.
    private val adminEmail = "admin@test.menscake.com"
    private val adminPassword = "test-admin-password-only"

    @Test
    fun `올바른 계정으로 로그인하면 200과 accessToken, refreshToken 쿠키를 받는다`() {
        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(LoginRequest(adminEmail, adminPassword))),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.data.accessToken").exists())
            .andExpect(jsonPath("$.data.account.email").value(adminEmail))
            .andExpect(jsonPath("$.data.account.role").value("ADMIN"))
            .andExpect(jsonPath("$.data.account.mustChangePassword").value(false))
            .andExpect(cookie().exists("refreshToken"))
    }

    @Test
    fun `비밀번호가 틀리면 401이다`() {
        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(LoginRequest(adminEmail, "wrong-password"))),
            ).andExpect(status().isUnauthorized)
    }

    @Test
    fun `존재하지 않는 이메일도 비밀번호 오류와 동일한 401 메시지다`() {
        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(LoginRequest("nobody@test.menscake.com", "whatever"))),
            ).andExpect(status().isUnauthorized)
    }

    @Test
    fun `로그인 후 refresh 쿠키로 재발급받고, 이전 refresh token은 재사용할 수 없다`() {
        val loginResult =
            mockMvc
                .perform(
                    post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(LoginRequest(adminEmail, adminPassword))),
                ).andReturn()
        val firstRefreshCookie = loginResult.response.getCookie("refreshToken")!!

        val refreshResult =
            mockMvc
                .perform(post("/api/auth/refresh").cookie(firstRefreshCookie))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andReturn()
        val rotatedCookie = refreshResult.response.getCookie("refreshToken")!!

        // 이미 회전(철회)된 이전 토큰은 재사용 불가
        mockMvc
            .perform(post("/api/auth/refresh").cookie(firstRefreshCookie))
            .andExpect(status().isUnauthorized)

        // 새로 회전된 토큰은 정상 동작
        mockMvc
            .perform(post("/api/auth/refresh").cookie(rotatedCookie))
            .andExpect(status().isOk)
    }

    @Test
    fun `refresh 쿠키 없이 refresh를 호출하면 401이다`() {
        mockMvc.perform(post("/api/auth/refresh")).andExpect(status().isUnauthorized)
    }

    @Test
    fun `logout 이후에는 해당 refresh token으로 재발급받을 수 없다`() {
        val loginResult =
            mockMvc
                .perform(
                    post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(LoginRequest(adminEmail, adminPassword))),
                ).andReturn()
        val refreshCookie = loginResult.response.getCookie("refreshToken")!!

        mockMvc
            .perform(post("/api/auth/logout").cookie(refreshCookie))
            .andExpect(status().isNoContent)

        mockMvc
            .perform(post("/api/auth/refresh").cookie(refreshCookie))
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun `logout은 쿠키가 없어도 204다`() {
        mockMvc.perform(post("/api/auth/logout")).andExpect(status().isNoContent)
    }

    // ---------- change-password ----------
    // 공유 시드 admin 계정을 건드리면 이 클래스의 다른 테스트(같은 Testcontainers DB를
    // 재사용)가 실행 순서에 따라 깨질 수 있어, 매번 새로 만든 전용 계정으로 검증한다.

    @Test
    fun `인증 없이 change-password를 호출하면 401이다`() {
        mockMvc
            .perform(
                post("/api/auth/change-password")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(ChangePasswordRequest("old-password-1234", "new-password-1234"))),
            ).andExpect(status().isUnauthorized)
    }

    @Test
    fun `현재 비밀번호가 틀리면 change-password는 400이다`() {
        createTestAccount("change-password-1@test.menscake.com", "old-password-1234")
        val accessToken = loginAndGetAccessToken("change-password-1@test.menscake.com", "old-password-1234")

        mockMvc
            .perform(
                post("/api/auth/change-password")
                    .header("Authorization", "Bearer $accessToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(ChangePasswordRequest("wrong-password", "new-password-1234"))),
            ).andExpect(status().isBadRequest)
    }

    @Test
    fun `change-password 성공 후에는 새 비밀번호로만 로그인할 수 있고, 다음 로그인에서 mustChangePassword가 false다`() {
        val email = "change-password-2@test.menscake.com"
        createTestAccount(email, "old-password-1234")
        val accessToken = loginAndGetAccessToken(email, "old-password-1234")

        mockMvc
            .perform(
                post("/api/auth/change-password")
                    .header("Authorization", "Bearer $accessToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(ChangePasswordRequest("old-password-1234", "new-password-1234"))),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.data").doesNotExist())

        // 이전 비밀번호로는 더 이상 로그인할 수 없다
        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(LoginRequest(email, "old-password-1234"))),
            ).andExpect(status().isUnauthorized)

        // 새 비밀번호로 로그인하면 mustChangePassword가 false다
        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(LoginRequest(email, "new-password-1234"))),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.data.account.mustChangePassword").value(false))
    }

    /** 신규 계정 생성 직후처럼 `mustChangePassword=true`인 전용 테스트 계정을 만든다. */
    private fun createTestAccount(
        email: String,
        rawPassword: String,
    ) {
        accountRepository.save(
            Account(
                email = email,
                passwordHash = passwordEncoder.encode(rawPassword)!!,
                name = "테스트계정",
                role = Role.STAFF,
                mustChangePassword = true,
            ),
        )
    }

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
