package com.menscake.api.common.error

/**
 * 요청 검증 실패 시 [ProblemDetail]의 `errors` 확장 필드 항목 하나를 나타낸다.
 */
data class FieldValidationError(
    val field: String,
    val message: String,
)
