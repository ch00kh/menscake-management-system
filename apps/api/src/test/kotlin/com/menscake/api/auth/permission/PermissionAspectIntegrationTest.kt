package com.menscake.api.auth.permission

import com.menscake.api.TestcontainersConfiguration
import com.menscake.api.auth.Role
import com.menscake.api.auth.dto.PermissionSummary
import com.menscake.api.auth.jwt.JwtPrincipal
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

/**
 * `@RequiresPermission` + [PermissionAspect]가 실제로 AOP 프록시를 통해 동작하는지
 * 확인한다. 아직 이 어노테이션을 쓰는 실제 업무 API가 없어, 테스트 전용 컨트롤러를
 * 컨텍스트에 추가해 검증한다.
 */
@Import(TestcontainersConfiguration::class, PermissionAspectIntegrationTest.TestControllerConfig::class)
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PermissionAspectIntegrationTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @AfterEach
    fun tearDown() {
        SecurityContextHolder.clearContext()
    }

    @Test
    fun `필요한 권한이 있으면 통과한다`() {
        authenticateWith(
            PermissionSummary(resource = "orders", canCreate = false, canRead = true, canUpdate = false, canDelete = false),
        )

        mockMvc.perform(get("/test/permission-check/orders")).andExpect(status().isOk)
    }

    @Test
    fun `해당 액션 권한이 false면 403이다`() {
        authenticateWith(
            PermissionSummary(resource = "orders", canCreate = false, canRead = false, canUpdate = false, canDelete = false),
        )

        mockMvc.perform(get("/test/permission-check/orders")).andExpect(status().isForbidden)
    }

    @Test
    fun `다른 리소스에 대한 권한만 있으면 403이다`() {
        authenticateWith(
            PermissionSummary(resource = "inventory", canCreate = true, canRead = true, canUpdate = true, canDelete = true),
        )

        mockMvc.perform(get("/test/permission-check/orders")).andExpect(status().isForbidden)
    }

    @Test
    fun `인증 자체가 안 되어 있으면 401이다`() {
        mockMvc.perform(get("/test/permission-check/orders")).andExpect(status().isUnauthorized)
    }

    private fun authenticateWith(vararg permissions: PermissionSummary) {
        val principal =
            JwtPrincipal(accountId = 1, email = "admin@menscake.com", role = Role.ADMIN, permissions = permissions.toList())
        SecurityContextHolder.getContext().authentication =
            UsernamePasswordAuthenticationToken(principal, null, emptyList())
    }

    @TestConfiguration
    class TestControllerConfig {
        @Bean
        fun permissionCheckTestController(): PermissionCheckTestController = PermissionCheckTestController()
    }

    @RestController
    class PermissionCheckTestController {
        @RequiresPermission(resource = "orders", action = Action.READ)
        @GetMapping("/test/permission-check/orders")
        fun check(): String = "ok"
    }
}
