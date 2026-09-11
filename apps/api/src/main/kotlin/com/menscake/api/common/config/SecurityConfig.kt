package com.menscake.api.common.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

/**
 * 공통 Spring Security 설정.
 *
 * 쿠키 기반 인증(리프레시 토큰)을 쓸 예정이라 CORS는 credentials를 허용하되
 * `app.cors.allowed-origin`(프로파일별 설정, `docs/rule/infra-deployment.md` 참조)에
 * 지정된 구체적인 origin만 허용한다 — 와일드카드(`*`)는 credentials 허용과 함께 쓸 수 없다.
 *
 * 아직 로그인/JWT 발급 엔드포인트가 없으므로 현재는 모든 요청을 허용한다.
 * JWT 필터는 실제 인증 기능이 추가될 때 이 필터체인에 끼워 넣는다.
 */
@Configuration
class SecurityConfig(
    @Value("\${app.cors.allowed-origin}")
    private val allowedOrigin: String,
) {
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            cors { configurationSource = corsConfigurationSource() }
            csrf { disable() }
            authorizeHttpRequests {
                authorize(anyRequest, permitAll)
            }
        }
        return http.build()
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
