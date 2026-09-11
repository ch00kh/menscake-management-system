# 인증/로그인 — API 계약

프론트/백엔드가 서로를 기다리지 않고 이 문서만 보고 병렬로 구현하기 위한 엄격한 계약이다. 필드 목록/타입/허용값이 실제 구현과 달라지면 이 문서를 먼저 갱신한다.

공통: 모든 엔드포인트는 `docs/rule/api-response-convention.md`를 따른다 — 성공 응답은 아래 바디를 그대로, 실패 응답은 RFC 7807 `ProblemDetail`.

## `POST /api/auth/login`

**요청**

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `email` | string | Y | - |
| `password` | string | Y | - |

**응답 200**

| 필드 | 타입 | 성격 | 허용값 | 설명 |
|---|---|---|---|---|
| `accessToken` | string | - | - | JWT, TTL 15분 |
| `account.id` | number | - | - | - |
| `account.name` | string | - | - | - |
| `account.email` | string | - | - | - |
| `account.role` | string | **분류** | `ADMIN` \| `MANAGER` \| `STAFF` | 인가 판단에 안 쓰임 — 화면 표시/필터용 (`docs/glossary.md` 참조) |
| `permissions[].resource` | string | - | 자유 문자열 키 | 아직 실제 업무 메뉴 없음 (`schema.md` 참조) |
| `permissions[].canCreate` | boolean | **상태** | `true` \| `false` | `@RequiresPermission(action=CREATE)` 판단에 쓰임 |
| `permissions[].canRead` | boolean | **상태** | `true` \| `false` | `@RequiresPermission(action=READ)` 판단에 쓰임 |
| `permissions[].canUpdate` | boolean | **상태** | `true` \| `false` | `@RequiresPermission(action=UPDATE)` 판단에 쓰임 |
| `permissions[].canDelete` | boolean | **상태** | `true` \| `false` | `@RequiresPermission(action=DELETE)` 판단에 쓰임 |

**에러**

| 상태 코드 | 조건 |
|---|---|
| 401 | 이메일이 없거나 비밀번호가 틀림 (원인 구분 없이 동일 메시지 — 계정 존재 여부 노출 방지) |
| 401 | `Account.is_active`가 `false`인 계정 |

부수 효과: 성공 시 Refresh Token을 httpOnly + Secure 쿠키로 내려준다 (쿠키명/TTL은 [tech-decisions.md](./tech-decisions.md) 참조).

## `POST /api/auth/refresh`

**요청**: 바디 없음. Refresh Token 쿠키가 있어야 함.

**응답 200**: `POST /api/auth/login`과 완전히 동일한 바디 (`accessToken`, `account`, `permissions`). Refresh Token도 회전되어 새 쿠키로 내려간다.

**에러**

| 상태 코드 | 조건 |
|---|---|
| 401 | 쿠키 없음 / 만료 / 이미 철회됨(로그아웃 이력) / 위조 |

## `POST /api/auth/logout`

**요청**: 바디 없음. Refresh Token 쿠키(있으면 사용, 없어도 에러 아님).

**응답**: `204 No Content`. 멱등(idempotent) — 이미 로그아웃된 상태에서 다시 호출해도 204.

부수 효과: 쿠키의 Refresh Token을 DB에서 revoke(`revoked_at` 설정) + 쿠키 삭제.

## 참고

- 필드의 상태/분류 구분 기준은 `docs/rule/naming-convention.md`의 "필드 설계 — 상태(state) vs 분류(classification)" 참조.
- `account.role`, `permissions[].resource` 등 도메인 용어의 의미는 `docs/glossary.md` 참조.
