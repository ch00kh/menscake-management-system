package com.menscake.api.auth.permission

/**
 * 컨트롤러 메서드에 붙여 [resource]에 대한 [action] 권한을 요구한다. 실제 검사는
 * [PermissionAspect]가 수행한다. 아직 이 어노테이션을 붙일 실제 업무 API는 없다 —
 * 인증 도메인의 일부로 메커니즘만 먼저 만들어 둔다 (docs/spec/auth/flow.md 참조).
 */
@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class RequiresPermission(
    val resource: String,
    val action: Action,
)
