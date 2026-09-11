package com.menscake.api.auth

import com.fasterxml.jackson.databind.ObjectMapper
import com.menscake.api.TestcontainersConfiguration
import com.menscake.api.auth.dto.LoginRequest
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

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
}
