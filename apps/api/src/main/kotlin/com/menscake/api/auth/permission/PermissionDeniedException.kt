package com.menscake.api.auth.permission

class PermissionDeniedException(
    resource: String,
    action: Action,
) : RuntimeException("'$resource' 리소스에 대한 $action 권한이 없습니다")
