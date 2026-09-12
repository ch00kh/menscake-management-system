package com.menscake.api.auth

import org.springframework.data.jpa.repository.JpaRepository

interface PermissionRepository : JpaRepository<Permission, Long> {
    fun findByAccountId(accountId: Long): List<Permission>
}
