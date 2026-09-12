package com.menscake.api.auth.jwt

import io.jsonwebtoken.JwtException
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

/**
 * `Authorization: Bearer <token>` 헤더의 Access Token을 검증해 `SecurityContext`에
 * 인증 정보를 채운다. 토큰이 없거나 유효하지 않으면 그냥 다음 필터로 넘긴다 — 이후
 * `SecurityConfig`의 `authorizeHttpRequests`가 미인증 요청을 401로 막는다.
 */
@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val header = request.getHeader("Authorization")
        if (header != null && header.startsWith("Bearer ")) {
            val token = header.removePrefix("Bearer ")
            try {
                val principal = jwtService.parseAccessToken(token)
                SecurityContextHolder.getContext().authentication =
                    UsernamePasswordAuthenticationToken(principal, null, emptyList())
            } catch (ex: JwtException) {
                SecurityContextHolder.clearContext()
            } catch (ex: IllegalArgumentException) {
                SecurityContextHolder.clearContext()
            }
        }
        filterChain.doFilter(request, response)
    }
}
