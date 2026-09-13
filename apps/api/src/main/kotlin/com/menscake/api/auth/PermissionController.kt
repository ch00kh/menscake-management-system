package com.menscake.api.auth

import com.menscake.api.auth.dto.PermissionResourceResponse
import com.menscake.api.auth.dto.PermissionResponse
import com.menscake.api.auth.dto.PermissionUpdateRequest
import com.menscake.api.auth.jwt.JwtPrincipal
import com.menscake.api.auth.permission.Action
import com.menscake.api.auth.permission.RequiresPermission
import com.menscake.api.common.response.ApiResponse
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

/** 권한 관리 화면 API. 계약은 docs/spec/permission-management/api.md 참조. */
@RestController
class PermissionController(
    private val permissionService: PermissionService,
) {
    @RequiresPermission(resource = "permissions", action = Action.READ)
    @GetMapping("/api/permission-resources")
    fun listResources(): ApiResponse<List<PermissionResourceResponse>> = ApiResponse(permissionService.listResources())

    @RequiresPermission(resource = "permissions", action = Action.READ)
    @GetMapping("/api/accounts/{accountId}/permissions")
    fun getPermissions(
        @PathVariable accountId: Long,
    ): ApiResponse<List<PermissionResponse>> = ApiResponse(permissionService.getPermissions(accountId))

    @RequiresPermission(resource = "permissions", action = Action.UPDATE)
    @PutMapping("/api/accounts/{accountId}/permissions")
    fun updatePermissions(
        @PathVariable accountId: Long,
        @RequestBody request: List<PermissionUpdateRequest>,
        @AuthenticationPrincipal principal: JwtPrincipal,
    ): ApiResponse<List<PermissionResponse>> = ApiResponse(permissionService.updatePermissions(accountId, principal.accountId, request))
}
