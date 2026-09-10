package com.menscake.api.common

import com.menscake.api.common.response.ApiResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

/**
 * `ApiResponse` wrapper + springdoc + Security/CORS 배선이 end-to-end로 동작하는지
 * 확인하기 위한 최소 데모 엔드포인트.
 */
@RestController
class HealthController {
    /**
     * 서버 상태를 확인한다.
     */
    @GetMapping("/health")
    fun health(): ApiResponse<Map<String, String>> = ApiResponse(data = mapOf("status" to "OK"))
}
