# 인증/로그인 — 흐름 & API

## 인증 흐름 & API

| 엔드포인트 | 설명 |
|---|---|
| `POST /api/auth/login` | `{ email, password }` → Access Token(응답 바디) + Refresh Token(httpOnly Secure 쿠키) |
| `POST /api/auth/refresh` | Refresh Token 쿠키만으로 호출 → Access Token 재발급 + Refresh Token 회전(기존 revoke, 신규 발급) |
| `POST /api/auth/logout` | Refresh Token 쿠키 → 해당 행 DB에서 revoke + 쿠키 삭제 |

응답 바디 공통 형태(login, refresh):
```json
{
  "accessToken": "...",
  "account": { "id": 1, "name": "...", "email": "...", "role": "ADMIN" },
  "permissions": [
    { "resource": "orders", "canCreate": true, "canRead": true, "canUpdate": true, "canDelete": false }
  ]
}
```

- Access Token: HMAC-JWT, TTL 15분. `permissions`를 claim에 포함 — 매 요청 DB 조회 없이 인가 판단.
- Refresh Token: TTL 14일, 회전(rotate) 방식. DB에는 원문이 아니라 해시로 저장 (스키마는 [schema.md](./schema.md)).
- `SecurityConfig.kt`의 `permitAll()`을 제거하고, `/api/auth/login`, `/api/auth/refresh`만 공개, 나머지는 JWT 필터 인증 요구.
- 로그인 실패(이메일 없음/비밀번호 틀림)는 원인 구분 없이 동일한 401 메시지 — 계정 존재 여부 노출 방지.

## 권한 체크 메커니즘

```kotlin
@RequiresPermission(resource = "orders", action = Action.READ)
@GetMapping("/orders")
fun list(...)
```

Spring AOP `@Aspect`가 인증된 계정의 Access Token claim 속 `permissions`에서 해당 `resource`+`action` 보유 여부를 검사, 없으면 403. 지금 이 어노테이션을 실제로 붙일 업무 API는 없지만, 인증 도메인의 일부로 메커니즘만 먼저 만들어 둔다 — 이후 주문/재고 등 실제 API가 생기면 바로 붙인다. (기술 선택 근거는 [tech-decisions.md](./tech-decisions.md))

## 프론트엔드 연동

- Zustand 인증 스토어(`persist` 미들웨어 금지): `{ accessToken, account, permissions }`
- 앱 부팅 시 `/api/auth/refresh`를 조용히 호출해 세션 복구 시도 → 실패하면 `/login`
- `LoginForm` 제출 → `/api/auth/login` fetch → 성공 시 스토어 채우고 원래 목적지로, 실패 시 폼에 에러 메시지
- 라우트 가드: 미인증 상태로 `/login` 외 경로 접근 시 `/login`으로 리다이렉트 (`App.tsx`)
- 401 응답 시 refresh 1회 재시도 후 재실패하면 로그아웃 처리 + `/login` 이동

## 에러 처리

- 인증 실패: 401 (`docs/rule/api-response-convention.md`의 `ProblemDetail`)
- 권한 없음(`@RequiresPermission` 불통과): 403
- refresh 실패(만료/철회/위조): 401 → 프론트가 로그인 화면으로

## 테스트

- api: JUnit5 + MockK + Testcontainers — 로그인 성공/실패, refresh 회전/철회, logout, `@RequiresPermission` AOP 통과/차단 케이스
- web: Vitest — LoginForm 제출 성공/실패, 라우트 가드 리다이렉트, refresh 재시도 흐름
