package com.menscake.api.common.config

import com.menscake.api.auth.jwt.JwtAuthenticationFilter
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import tools.jackson.databind.ObjectMapper

/**
 * 공통 Spring Security 설정.
 *
 * 쿠키 기반 인증(리프레시 토큰)을 쓰기 때문에 CORS는 credentials를 허용하되
 * `app.cors.allowed-origin`(프로파일별 설정, `docs/rule/infra-deployment.md` 참조)에
 * 지정된 구체적인 origin만 허용한다 — 와일드카드(`*`)는 credentials 허용과 함께 쓸 수 없다.
 *
 * `/api/auth` 하위 경로(로그인/갱신)만 공개하고 나머지는 [JwtAuthenticationFilter]가 채운
 * `SecurityContext` 기준으로 인증을 요구한다. 세션을 쓰지 않는 stateless 구성이다.
 */
@Configuration
class SecurityConfig(
    @Value("\${app.cors.allowed-origin}")
    private val allowedOrigin: String,
    private val jwtAuthenticationFilter: JwtAuthenticationFilter,
    private val objectMapper: ObjectMapper,
) {
    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            cors { configurationSource = corsConfigurationSource() }
            csrf { disable() }
            sessionManagement { sessionCreationPolicy = SessionCreationPolicy.STATELESS }
            exceptionHandling {
                authenticationEntryPoint = AuthenticationEntryPoint { _, response, _ -> writeUnauthorized(response) }
            }
            authorizeHttpRequests {
                authorize("/api/auth/**", permitAll)
                authorize("/health", permitAll)
                authorize(anyRequest, authenticated)
            }
            addFilterBefore<UsernamePasswordAuthenticationFilter>(jwtAuthenticationFilter)
        }
        return http.build()
    }

    /**
     * 인증 자체가 안 된 요청에 대한 401 응답. 컨트롤러 진입 전(필터 단계)에서 막히므로
     * `GlobalExceptionHandler`의 `@ExceptionHandler`를 타지 않아 여기서 직접 써준다.
     */
    private fun writeUnauthorized(response: HttpServletResponse) {
        response.status = HttpServletResponse.SC_UNAUTHORIZED
        response.contentType = "application/problem+json"
        val problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, "인증이 필요합니다")
        objectMapper.writeValue(response.writer, problemDetail)
    }

    private fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration =
            CorsConfiguration().apply {
                allowedOrigins = listOf(allowedOrigin)
                allowedMethods = listOf("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                allowedHeaders = listOf("*")
                allowCredentials = true
            }
        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**", configuration)
        }
    }
}
