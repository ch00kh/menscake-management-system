package com.menscake.api.auth.permission

import com.menscake.api.auth.jwt.JwtPrincipal
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component

/**
 * `@RequiresPermission`이 붙은 메서드 호출 전에 인증된 계정의 권한을 검사한다.
 */
@Aspect
@Component
class PermissionAspect {
    @Before(value = "@annotation(requiresPermission)", argNames = "requiresPermission")
    fun checkPermission(requiresPermission: RequiresPermission) {
        val principal =
            SecurityContextHolder.getContext().authentication?.principal as? JwtPrincipal
                ?: throw PermissionDeniedException(requiresPermission.resource, requiresPermission.action)

        val permission = principal.permissions.find { it.resource == requiresPermission.resource }
        val allowed =
            when (requiresPermission.action) {
                Action.CREATE -> permission?.canCreate
                Action.READ -> permission?.canRead
                Action.UPDATE -> permission?.canUpdate
                Action.DELETE -> permission?.canDelete
            } ?: false

        if (!allowed) {
            throw PermissionDeniedException(requiresPermission.resource, requiresPermission.action)
        }
    }
}
