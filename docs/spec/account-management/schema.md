# 계정 관리 — 스키마

새 테이블은 만들지 않는다. [auth 도메인](../auth/schema.md)의 `account` 테이블에 컬럼 하나를 추가한다.

## `account` 테이블 변경

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `must_change_password` | boolean | NOT NULL, default `false` | **상태(state)** 필드 — `true`면 로그인 성공 후 다른 화면 진입 전에 비밀번호 변경 화면으로 강제 이동 (`docs/rule/naming-convention.md`의 상태 필드 판별 기준: 라우트 가드 로직이 이 필드를 조회해서 분기함) |

- 마이그레이션은 기존 행에 `false`를 채운다 — 이미 시드된 관리자 계정은 비밀번호를 알고 있는 상태이므로 강제 변경 대상이 아니다.
- 신규 계정 생성 API(`POST /api/accounts`)는 항상 `true`로 시작한다.
- 관리자가 기존 계정의 비밀번호를 재설정하는 API(`PATCH /api/accounts/{id}`에 `password` 포함)도 이 필드를 다시 `true`로 되돌린다.
- 본인이 `/api/auth/change-password`로 비밀번호를 변경하면 `false`로 바뀐다.

## 하드 삭제 시 연쇄 삭제

`DELETE /api/accounts/{id}`는 해당 계정의 `permission`, `refresh_token` 행도 함께 삭제한다 (FK `ON DELETE CASCADE` 또는 서비스 계층에서 명시적 삭제 — 구현 시점에 택 1, `docs/rule/tech-stack.md`의 JPA/QueryDSL 관례에 맞춰 결정).
