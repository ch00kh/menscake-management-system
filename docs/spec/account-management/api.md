# 계정 관리 — API 계약

프론트/백엔드가 서로를 기다리지 않고 이 문서만 보고 병렬로 구현하기 위한 엄격한 계약이다. 필드 목록/타입/허용값이 실제 구현과 달라지면 이 문서를 먼저 갱신한다.

공통: 모든 엔드포인트는 `docs/rule/api-response-convention.md`를 따른다 (성공은 `data` wrapper, 실패는 RFC 7807 `ProblemDetail`). 모든 엔드포인트는 `@RequiresPermission(resource = "accounts", action = ...)`로 보호된다 — 메커니즘은 [auth 도메인 flow.md](../auth/flow.md) 참조.

## `GET /api/accounts`

DTO: 요청 `AccountSearchRequest`(쿼리 파라미터), 응답 `ApiResponse<Page<AccountResponse>>`

`@RequiresPermission(resource = "accounts", action = READ)`

**요청 (쿼리 파라미터)**

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `query` | string | N | 이름 또는 이메일 부분 일치 검색 |
| `role` | string | N | `ADMIN` \| `MANAGER` \| `STAFF` 중 하나로 필터 |
| `isActive` | boolean | N | 활성 상태로 필터 |
| `page`, `size`, `sort` | - | N | `docs/rule/api-response-convention.md`의 페이지네이션 규칙 |

**응답 200** — `data`는 `Page<AccountResponse>` (`content` 안 각 항목은 아래 `AccountResponse` 필드)

## `POST /api/accounts`

DTO: 요청 `AccountCreateRequest`, 응답 `ApiResponse<AccountResponse>`

`@RequiresPermission(resource = "accounts", action = CREATE)`

**요청**

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `email` | string | Y | 로그인 ID, 중복 불가 |
| `name` | string | Y | - |
| `role` | string | Y | **분류** — `ADMIN` \| `MANAGER` \| `STAFF` |
| `password` | string | Y | 관리자가 직접 입력한 초기 비밀번호 |

생성된 계정은 `mustChangePassword=true`, `isActive=true`로 시작한다 (요청 필드로 받지 않음).

**응답 201** — `data`는 `AccountResponse`

**에러**

| 상태 코드 | 조건 |
|---|---|
| 400 | 필수 필드 누락/형식 오류 |
| 409 | `email` 중복 |

## `PATCH /api/accounts/{id}`

DTO: 요청 `AccountUpdateRequest`, 응답 `ApiResponse<AccountResponse>`

`@RequiresPermission(resource = "accounts", action = UPDATE)`

**요청** (모든 필드 선택 — 보낸 필드만 갱신)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `name` | string | N | - |
| `role` | string | N | **분류** — `ADMIN` \| `MANAGER` \| `STAFF` |
| `isActive` | boolean | N | **상태** — `false`로 바꾸면 로그인 차단 |
| `password` | string | N | 값이 오면 관리자의 "비밀번호 재설정" 액션으로 처리 — `mustChangePassword`를 `true`로 되돌림 |

**응답 200** — `data`는 `AccountResponse`

**에러**

| 상태 코드 | 조건 |
|---|---|
| 400 | 로그인한 본인 계정에 `isActive=false` 요청 |
| 404 | 존재하지 않는 `id` |
| 409 | `isActive=false` 요청 대상이 시스템에 남은 마지막 활성(`isActive=true`) 계정인 경우 |

## `DELETE /api/accounts/{id}`

DTO 없음, 응답 `204 No Content`

`@RequiresPermission(resource = "accounts", action = DELETE)`

연쇄 삭제 규칙은 [schema.md](./schema.md) 참조.

**에러**

| 상태 코드 | 조건 |
|---|---|
| 400 | 로그인한 본인 계정을 삭제 요청 |
| 404 | 존재하지 않는 `id` |
| 409 | 삭제 대상이 시스템에 남은 마지막 계정인 경우 |

## `POST /api/auth/change-password`

DTO: 요청 `ChangePasswordRequest`, 응답 `ApiResponse<Unit>` (본문 없이 `data: null`)

인증된 본인만 호출 (다른 계정 대상 아님 — 별도 권한 체크 불필요). auth 도메인에 속하지만 계정 관리 흐름과 직접 연결되어 여기 기록한다.

**요청**

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `currentPassword` | string | Y | - |
| `newPassword` | string | Y | - |

성공 시 `mustChangePassword`를 `false`로 바꾼다.

**응답 200**

**에러**

| 상태 코드 | 조건 |
|---|---|
| 400 | `currentPassword`가 실제 비밀번호와 불일치 |

## `AccountResponse`

| 필드 | 타입 | 성격 | 허용값 | 설명 |
|---|---|---|---|---|
| `id` | number | - | - | - |
| `email` | string | - | - | - |
| `name` | string | - | - | - |
| `role` | string | **분류** | `ADMIN` \| `MANAGER` \| `STAFF` | 인가 판단에 안 쓰임 |
| `isActive` | boolean | **상태** | `true` \| `false` | - |
| `mustChangePassword` | boolean | **상태** | `true` \| `false` | 다음 로그인 시 비밀번호 변경 강제 여부 |
| `createdAt` | string(ISO 8601) | - | - | - |
