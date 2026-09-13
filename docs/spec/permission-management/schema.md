# 권한 관리 — 스키마

## DB 변경 없음

이 기능은 [auth 도메인](../auth/schema.md)에 이미 있는 `permission` 테이블(계정별 리소스별 CRUD 4개 불리언, `UNIQUE(account_id, resource)`)을 그대로 쓴다. 새 테이블/컬럼을 추가하지 않는다.

## 리소스 화이트리스트 (코드 상수)

`permission.resource`는 auth 스펙 시점엔 "아직 실제 메뉴가 없어 자유 문자열"이었지만, 이 화면에서는 관리자가 임의 문자열을 입력하지 않고 **미리 정의된 목록 중에서 고른다.** 이 목록은 DB 테이블이 아니라 백엔드 코드에 정의하는 화이트리스트다 (예: `enum class PermissionResource(val key: String, val label: String)`).

| `key` | `label` | 비고 |
|---|---|---|
| `accounts` | 계정 관리 | 이미 `@RequiresPermission(resource = "accounts", ...)`로 쓰이는 값과 동일해야 함 |
| `permissions` | 권한 관리 | 이 화면 자신을 보호하는 리소스 키 |

- 실제 업무 리소스(주문/재고 등)가 생기면 그 기능을 만드는 이슈에서 이 목록에 항목을 추가한다.
- `GET /api/permission-resources`(→ [api.md](./api.md))가 이 목록을 그대로 응답한다.
- `PUT /api/accounts/{id}/permissions` 요청의 `resource` 필드는 이 목록의 `key` 중 하나여야 하며, 아니면 400 (→ [api.md](./api.md)).

## 시드 데이터 갱신 필요

관리자(admin) 계정이 이 화면 자체를 열고 저장할 수 있어야 하므로, Flyway 시드 데이터에 admin 계정의 `permission` 행으로 `resource = "permissions"`, `can_create/read/update/delete = true`가 추가로 필요하다 (구현 단계에서 처리).
