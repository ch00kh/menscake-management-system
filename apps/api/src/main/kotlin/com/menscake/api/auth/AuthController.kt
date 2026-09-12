package com.menscake.api.auth

import com.menscake.api.auth.dto.AuthResponse
import com.menscake.api.auth.dto.ChangePasswordRequest
import com.menscake.api.auth.dto.LoginRequest
import com.menscake.api.auth.jwt.JwtPrincipal
import com.menscake.api.auth.jwt.JwtProperties
import com.menscake.api.common.response.ApiResponse
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.Valid
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

private const val REFRESH_TOKEN_COOKIE = "refreshToken"

/** 로그인/토큰 갱신/로그아웃. 계약은 docs/spec/auth/api.md 참조. */
@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
    private val jwtProperties: JwtProperties,
) {
    @PostMapping("/login")
    fun login(
        @Valid @RequestBody request: LoginRequest,
    ): ResponseEntity<ApiResponse<AuthResponse>> {
        val result = authService.login(request.email, request.password)
        return ResponseEntity
            .ok()
            .header(HttpHeaders.SET_COOKIE, refreshTokenCookie(result.rawRefreshToken).toString())
            .body(ApiResponse(result.response))
    }

    @PostMapping("/refresh")
    fun refresh(request: HttpServletRequest): ResponseEntity<ApiResponse<AuthResponse>> {
        val rawRefreshToken = readRefreshTokenCookie(request) ?: throw InvalidRefreshTokenException()
        val result = authService.refresh(rawRefreshToken)
        return ResponseEntity
            .ok()
            .header(HttpHeaders.SET_COOKIE, refreshTokenCookie(result.rawRefreshToken).toString())
            .body(ApiResponse(result.response))
    }

    @PostMapping("/logout")
    fun logout(request: HttpServletRequest): ResponseEntity<Void> {
        readRefreshTokenCookie(request)?.let { authService.logout(it) }
        return ResponseEntity
            .noContent()
            .header(HttpHeaders.SET_COOKIE, expiredRefreshTokenCookie().toString())
            .build()
    }

    /**
     * 인증된 본인의 비밀번호 변경 — 다른 계정 대상 아님, 별도 권한 체크 불필요
     * (docs/spec/account-management/api.md 참조). 응답은 `data: null`로 내려간다.
     */
    @PostMapping("/change-password")
    fun changePassword(
        @AuthenticationPrincipal principal: JwtPrincipal,
        @Valid @RequestBody request: ChangePasswordRequest,
    ): ApiResponse<Unit?> {
        authService.changePassword(principal.accountId, request.currentPassword, request.newPassword)
        return ApiResponse(null)
    }

    private fun readRefreshTokenCookie(request: HttpServletRequest): String? =
        request.cookies?.firstOrNull { it.name == REFRESH_TOKEN_COOKIE }?.value

    private fun refreshTokenCookie(value: String): ResponseCookie =
        ResponseCookie
            .from(REFRESH_TOKEN_COOKIE, value)
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")
            .path("/api/auth")
            .maxAge(jwtProperties.refreshTokenTtl)
            .build()

    private fun expiredRefreshTokenCookie(): ResponseCookie =
        ResponseCookie
            .from(REFRESH_TOKEN_COOKIE, "")
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")
            .path("/api/auth")
            .maxAge(0)
            .build()
}
