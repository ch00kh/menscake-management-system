package com.menscake.api.common.error

import com.menscake.api.auth.InvalidCredentialsException
import com.menscake.api.auth.InvalidRefreshTokenException
import com.menscake.api.auth.permission.PermissionDeniedException
import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

/**
 * 에러 응답을 RFC 7807 [ProblemDetail]로 통일해서 내려주는 공통 예외 처리기.
 *
 * `data`로 감싸지 않는다 — web은 2xx면 `data`를, 4xx/5xx면 `ProblemDetail`을 그대로
 * 파싱해 성공/실패를 구분한다 (`docs/rule/api-response-convention.md` 참조).
 */
@RestControllerAdvice
class GlobalExceptionHandler {
    /**
     * `@Valid` 검증 실패를 필드별 에러 목록(`errors`)을 담은 [ProblemDetail]로 변환한다.
     */
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleMethodArgumentNotValid(ex: MethodArgumentNotValidException): ProblemDetail {
        val problemDetail =
            ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "요청 값이 유효하지 않습니다",
            )
        val errors =
            ex.bindingResult.fieldErrors.map { fieldError ->
                FieldValidationError(
                    field = fieldError.field,
                    message = fieldError.defaultMessage ?: "유효하지 않은 값입니다",
                )
            }
        problemDetail.setProperty("errors", errors)
        return problemDetail
    }

    /** 로그인 실패/Refresh Token 무효 — 컨트롤러 안에서 던져지는 인증 실패 (docs/spec/auth/api.md 참조). */
    @ExceptionHandler(InvalidCredentialsException::class, InvalidRefreshTokenException::class)
    fun handleUnauthorized(ex: RuntimeException): ProblemDetail =
        ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, ex.message ?: "인증에 실패했습니다")

    /** `@RequiresPermission` 불통과. */
    @ExceptionHandler(PermissionDeniedException::class)
    fun handlePermissionDenied(ex: PermissionDeniedException): ProblemDetail =
        ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, ex.message ?: "권한이 없습니다")
}
