# 권한 관리 — API 계약

프론트/백엔드가 서로를 기다리지 않고 이 문서만 보고 병렬로 구현하기 위한 엄격한 계약이다. 필드 목록/타입/허용값이 실제 구현과 달라지면 이 문서를 먼저 갱신한다.

공통: 모든 엔드포인트는 `docs/rule/api-response-convention.md`를 따른다 (성공은 `data` wrapper, 실패는 RFC 7807 `ProblemDetail`). 계정 목록은 이 스펙에서 새로 만들지 않고 기존 [`GET /api/accounts`](../account-management/api.md#get-api-accounts)를 그대로 재사용한다 (`accounts` 리소스 권한 필요).

## `GET /api/permission-resources`

DTO: 요청 없음, 응답 `ApiResponse<List<PermissionResourceResponse>>`

`@RequiresPermission(resource = "permissions", action = READ)`

리소스 화이트리스트([schema.md](./schema.md))를 그대로 반환한다. 정렬/페이지네이션 없음 (항목이 적어 전체 반환).

**응답 200**

`PermissionResourceResponse`

| 필드 | 타입 | 설명 |
|---|---|---|
| `key` | string | 화이트리스트 키 (예: `accounts`) |
| `label` | string | 화면 표시용 한글 라벨 (예: `계정 관리`) |

## `GET /api/accounts/{accountId}/permissions`

DTO: 요청 없음, 응답 `ApiResponse<List<PermissionResponse>>`

`@RequiresPermission(resource = "permissions", action = READ)`

해당 계정에 **저장된 `permission` 행만** 반환한다 (sparse — 화이트리스트에 있어도 행이 없는 리소스는 응답에 포함되지 않는다). 화이트리스트와의 병합, 프리필 계산은 프론트 책임이다 (→ [flow.md](./flow.md)).

**응답 200** — `data`는 `List<PermissionResponse>`

**에러**

| 상태 코드 | 조건 |
|---|---|
| 404 | 존재하지 않는 `accountId` |

## `PUT /api/accounts/{accountId}/permissions`

DTO: 요청 `List<PermissionUpdateRequest>` (JSON 배열, wrapper 없음), 응답 `ApiResponse<List<PermissionResponse>>`

`@RequiresPermission(resource = "permissions", action = UPDATE)`

화이트리스트의 리소스 각각에 대한 CRUD 상태를 **통째로** 보낸다. 프론트는 항상 화이트리스트 전체 키에 대해 한 항목씩 채워서 보낸다 (매트릭스 UI가 항상 전체 행을 보여주므로). 백엔드는 각 항목을 `(accountId, resource)` 기준으로 upsert한다 — 기존 행이 있으면 갱신, 없으면 생성. 요청에 없는 기존 리소스 행을 삭제하지는 않는다 (화이트리스트 전체가 항상 요청에 포함되므로 실질적으로 발생하지 않음).

**요청** (배열의 각 항목)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `resource` | string | Y | 화이트리스트의 `key` 중 하나 |
| `canCreate` | boolean | Y | - |
| `canRead` | boolean | Y | - |
| `canUpdate` | boolean | Y | - |
| `canDelete` | boolean | Y | - |

**응답 200** — `data`는 upsert 후 해당 계정의 `List<PermissionResponse>` 전체 (화이트리스트 전체 키 포함)

**에러**

| 상태 코드 | 조건 |
|---|---|
| 400 | 요청 배열에 화이트리스트에 없는 `resource` 키가 하나라도 있음 |
| 404 | 존재하지 않는 `accountId` |
| 400 | **자기잠금 방지**: `accountId`가 로그인 본인 계정이고, 요청 결과 `resource = "permissions"` 항목의 `canRead` 또는 `canUpdate`가 `false`가 되는 경우 — 판정 로직은 [flow.md](./flow.md) 참조 |

## `PermissionResponse`

| 필드 | 타입 | 설명 |
|---|---|---|
| `resource` | string | 화이트리스트의 `key` |
| `canCreate` | boolean | - |
| `canRead` | boolean | - |
| `canUpdate` | boolean | - |
| `canDelete` | boolean | - |
