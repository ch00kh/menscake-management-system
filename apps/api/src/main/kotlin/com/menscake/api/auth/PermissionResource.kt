package com.menscake.api.auth

/**
 * 권한 부여 대상이 될 수 있는 리소스 키 화이트리스트 (docs/spec/permission-management/schema.md
 * 참조). DB 테이블이 아니라 코드 상수로 관리한다 — `key`는 `@RequiresPermission(resource = ...)`에
 * 쓰이는 문자열과 동일해야 한다.
 *
 * 실제 업무 리소스(주문/재고 등)가 생기면 그 기능을 만드는 이슈에서 이 목록에 항목을
 * 추가한다 (지금 범위 밖 — docs/spec/permission-management/overview.md 참조).
 */
enum class PermissionResource(
    val key: String,
    val label: String,
) {
    ACCOUNTS("accounts", "계정 관리"),
    PERMISSIONS("permissions", "권한 관리"),
    ;

    companion object {
        fun findByKey(key: String): PermissionResource? = entries.find { it.key == key }
    }
}
