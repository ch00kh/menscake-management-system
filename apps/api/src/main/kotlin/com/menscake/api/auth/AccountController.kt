package com.menscake.api.auth

import com.menscake.api.auth.dto.AccountCreateRequest
import com.menscake.api.auth.dto.AccountResponse
import com.menscake.api.auth.dto.AccountSearchRequest
import com.menscake.api.auth.dto.AccountUpdateRequest
import com.menscake.api.auth.jwt.JwtPrincipal
import com.menscake.api.auth.permission.Action
import com.menscake.api.auth.permission.RequiresPermission
import com.menscake.api.common.response.ApiResponse
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/** 계정 관리 CRUD. 계약은 docs/spec/account-management/api.md 참조. */
@RestController
@RequestMapping("/api/accounts")
class AccountController(
    private val accountService: AccountService,
) {
    @RequiresPermission(resource = "accounts", action = Action.READ)
    @GetMapping
    fun search(
        @RequestParam(required = false) query: String?,
        @RequestParam(required = false) role: Role?,
        @RequestParam(required = false) isActive: Boolean?,
        @PageableDefault(size = 20) pageable: Pageable,
    ): ApiResponse<Page<AccountResponse>> {
        val request = AccountSearchRequest(query = query, role = role, isActive = isActive)
        return ApiResponse(accountService.search(request, pageable))
    }

    @RequiresPermission(resource = "accounts", action = Action.CREATE)
    @PostMapping
    fun create(
        @Valid @RequestBody request: AccountCreateRequest,
    ): ResponseEntity<ApiResponse<AccountResponse>> =
        ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse(accountService.create(request)))

    @RequiresPermission(resource = "accounts", action = Action.UPDATE)
    @PatchMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody request: AccountUpdateRequest,
        @AuthenticationPrincipal principal: JwtPrincipal,
    ): ApiResponse<AccountResponse> = ApiResponse(accountService.update(id, principal.accountId, request))

    @RequiresPermission(resource = "accounts", action = Action.DELETE)
    @DeleteMapping("/{id}")
    fun delete(
        @PathVariable id: Long,
        @AuthenticationPrincipal principal: JwtPrincipal,
    ): ResponseEntity<Void> {
        accountService.delete(id, principal.accountId)
        return ResponseEntity.noContent().build()
    }
}
