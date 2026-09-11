package com.menscake.api.common.response

/**
 * 모든 성공 응답을 감싸는 공통 wrapper.
 *
 * 컨트롤러가 이 타입을 명시적으로 반환해야 한다 (예: `ApiResponse<OrderResponse>`).
 * `ResponseBodyAdvice` 등으로 자동 wrapping하지 않는다 — springdoc-openapi가 컨트롤러
 * 반환 타입만 보고 OpenAPI 스펙을 생성하기 때문에, 자동 wrapping은 실제 응답과 스펙에
 * 기록되는 타입을 어긋나게 만들어 orval이 생성하는 TS 타입도 잘못되게 만든다
 * (`docs/rule/api-response-convention.md` 참조).
 */
data class ApiResponse<T>(
    val data: T,
)
