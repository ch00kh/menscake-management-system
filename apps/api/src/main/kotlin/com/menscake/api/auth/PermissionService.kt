package com.menscake.api.auth

import com.menscake.api.auth.dto.PermissionResourceResponse
import com.menscake.api.auth.dto.PermissionResponse
import com.menscake.api.auth.dto.PermissionUpdateRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * 권한 관리 화면 비즈니스 로직 (docs/spec/permission-management/ 참조). 자기잠금 방지는
 * 계정 관리의 본인 보호 검사([AccountService.guardSelfProtection])와 같은 이유로
 * 서비스 계층에서만 검사한다 — 컨트롤러가 아니라 여기 둬야 다른 진입점이 생겨도
 * 우회할 수 없다.
 */
@Service
class PermissionService(
    private val accountRepository: AccountRepository,
    private val permissionRepository: PermissionRepository,
) {
    fun listResources(): List<PermissionResourceResponse> =
        PermissionResource.entries.map { PermissionResourceResponse(key = it.key, label = it.label) }

    fun getPermissions(accountId: Long): List<PermissionResponse> {
        accountRepository.findById(accountId).orElseThrow { AccountNotFoundException(accountId) }
        return permissionRepository.findByAccountId(accountId).map { it.toResponse() }
    }

    /**
     * 화이트리스트 전체 키에 대한 CRUD 상태를 `(accountId, resource)` 기준으로 upsert한다.
     * 검증(화이트리스트 키/자기잠금)을 먼저 모두 통과시킨 뒤에만 저장을 시작한다 — 원자성
     * 보장을 위해 부분 저장을 허용하지 않는다 (docs/spec/permission-management/flow.md 참조).
     */
    @Transactional
    fun updatePermissions(
        accountId: Long,
        requesterId: Long,
        requests: List<PermissionUpdateRequest>,
    ): List<PermissionResponse> {
        requests.forEach { request ->
            if (PermissionResource.findByKey(request.resource) == null) {
                throw UnknownPermissionResourceException(request.resource)
            }
        }

        accountRepository.findById(accountId).orElseThrow { AccountNotFoundException(accountId) }

        guardSelfLockout(accountId, requesterId, requests)

        val existingByResource = permissionRepository.findByAccountId(accountId).associateBy { it.resource }
        requests.forEach { request ->
            val existing = existingByResource[request.resource]
            if (existing != null) {
                existing.applyPermissionUpdate(
                    canCreate = request.canCreate,
                    canRead = request.canRead,
                    canUpdate = request.canUpdate,
                    canDelete = request.canDelete,
                )
            } else {
                permissionRepository.save(
                    Permission(
                        accountId = accountId,
                        resource = request.resource,
                        canCreate = request.canCreate,
                        canRead = request.canRead,
                        canUpdate = request.canUpdate,
                        canDelete = request.canDelete,
                    ),
                )
            }
        }

        return permissionRepository.findByAccountId(accountId).map { it.toResponse() }
    }

    /**
     * 자기잠금 방지: 로그인 본인 계정을 대상으로 하는 요청에서 `permissions` 리소스의
     * `canRead`/`canUpdate` 중 하나라도 `false`가 되면 요청 전체를 거부한다
     * (docs/spec/permission-management/flow.md "자기잠금 판정" 참조).
     */
    private fun guardSelfLockout(
        accountId: Long,
        requesterId: Long,
        requests: List<PermissionUpdateRequest>,
    ) {
        if (accountId != requesterId) return

        val permissionsRequest = requests.find { it.resource == PermissionResource.PERMISSIONS.key } ?: return
        if (!permissionsRequest.canRead || !permissionsRequest.canUpdate) {
            throw SelfAccountProtectionException("본인 계정의 권한 관리 조회/수정 권한은 스스로 제거할 수 없습니다")
        }
    }

    private fun Permission.toResponse() =
        PermissionResponse(
            resource = resource,
            canCreate = canCreate,
            canRead = canRead,
            canUpdate = canUpdate,
            canDelete = canDelete,
        )
}
