# 인증/로그인 — API 계약

프론트/백엔드가 서로를 기다리지 않고 이 문서만 보고 병렬로 구현하기 위한 엄격한 계약이다. 필드 목록/타입/허용값이 실제 구현과 달라지면 이 문서를 먼저 갱신한다.

공통: 모든 엔드포인트는 `docs/rule/api-response-convention.md`를 따른다.
- 성공 응답은 실제 값을 **`data` 필드로 감싼다** — 아래 각 엔드포인트의 응답 표는 `data` 안쪽 필드 기준이다.
- 실패 응답은 `data`로 감싸지 않고 RFC 7807 `ProblemDetail`을 그대로 반환한다.
- 컨트롤러는 `ApiResponse<T>`를 명시적으로 반환한다(자동 wrapping 금지) — DTO 클래스명은 각 엔드포인트 아래 표기.

## `POST /api/auth/login`

DTO: 요청 `LoginRequest`, 응답 `ApiResponse<AuthResponse>`

**요청**

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `email` | string | Y | - |
| `password` | string | Y | - |

**응답 200**

```json
{
  "data": {
    "accessToken": "...",
    "account": { "id": 1, "name": "...", "email": "...", "role": "ADMIN" },
    "permissions": [
      { "resource": "orders", "canCreate": true, "canRead": true, "canUpdate": true, "canDelete": false }
    ]
  }
}
```

`data` 안쪽 필드:

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

DTO: 요청 없음, 응답 `ApiResponse<AuthResponse>`

**요청**: 바디 없음. Refresh Token 쿠키가 있어야 함.

**응답 200**: `POST /api/auth/login`과 완전히 동일한 바디(`data.accessToken`/`data.account`/`data.permissions`) — 같은 `AuthResponse` DTO를 재사용한다. Refresh Token도 회전되어 새 쿠키로 내려간다.

**에러**

| 상태 코드 | 조건 |
|---|---|
| 401 | 쿠키 없음 / 만료 / 이미 철회됨(로그아웃 이력) / 위조 |

## `POST /api/auth/logout`

DTO: 요청 없음, 응답 없음 (204는 바디 자체가 없어 `data` 래핑 대상이 아님)

**요청**: 바디 없음. Refresh Token 쿠키(있으면 사용, 없어도 에러 아님).

**응답**: `204 No Content`. 멱등(idempotent) — 이미 로그아웃된 상태에서 다시 호출해도 204.

부수 효과: 쿠키의 Refresh Token을 DB에서 revoke(`revoked_at` 설정) + 쿠키 삭제.

## 참고

- 필드의 상태/분류 구분 기준은 `docs/rule/naming-convention.md`의 "필드 설계 — 상태(state) vs 분류(classification)" 참조.
- `account.role`, `permissions[].resource` 등 도메인 용어의 의미는 `docs/glossary.md` 참조.
- DTO 응답 클래스를 액션별로 나누지 않고 `AuthResponse` 하나를 login/refresh가 재사용하는 이유는 `docs/rule/naming-convention.md`의 "응답 DTO는 액션별로 나누지 않는다" 원칙과 동일하다.
