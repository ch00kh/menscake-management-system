# 계정 관리 — 흐름

API 계약(엔드포인트별 요청/응답 필드, 타입, 에러 코드)은 [api.md](./api.md)를 참조한다. 이 문서는 그 계약이 어떻게 동작하는지의 흐름만 다룬다.

## 비밀번호 변경 강제 흐름

1. 관리자가 `POST /api/accounts`로 계정을 생성하거나 `PATCH /api/accounts/{id}`로 비밀번호를 재설정 → `mustChangePassword=true`
2. 해당 계정으로 로그인 성공(`POST /api/auth/login`) → 응답의 `account.mustChangePassword`가 `true`
3. 프론트 라우트 가드: `mustChangePassword===true`인 동안 `/change-password` 외 경로 접근 시 `/change-password`로 강제 리다이렉트 ([auth 도메인](../auth/flow.md)의 기존 인증 라우트 가드에 이 조건을 추가)
4. `/change-password` 화면에서 `POST /api/auth/change-password` 성공 → 스토어의 `mustChangePassword`를 `false`로 갱신 → 원래 목적지(또는 홈)로 이동

## 자기 자신 / 마지막 계정 보호

- `AccountService`가 `PATCH`(비활성화 시도)와 `DELETE` 양쪽에서 동일한 두 가지를 검사한다:
  - 요청자(Access Token의 계정)와 대상 `id`가 같은가 → 같으면 400
  - 대상을 제외하고 `isActive=true`인 계정이 0명이 되는가 → 그렇다면 409
- 이 검사는 컨트롤러가 아니라 서비스 계층에 둔다 — 이후 다른 진입점(예: 배치 작업)이 생겨도 우회할 수 없게 하기 위함.

## 계정 관리 화면 자체의 접근 제어

- `accounts` 리소스에 대한 `@RequiresPermission`으로 보호한다 ([auth 도메인](../auth/flow.md)의 AOP 메커니즘 재사용).
- 닭-달걀 문제: 권한 관리 화면이 아직 없어 누구도 스스로 `accounts` 권한을 부여할 수 없다. Flyway 시드 마이그레이션에 시드 관리자 계정의 `permission` 행(`resource="accounts"`, CRUD 전부 `true`)을 추가해 해결한다.

## 프론트엔드 연동

- 화면 구조: `ListModalCrud` 레이아웃 기반. 상단 검색바(`query`)+필터(`role`, `isActive`) → 목록 테이블 → 생성은 Dialog, 수정(이름/역할/활성상태 토글+비밀번호 재설정 입력)은 Sheet.
- 생성/수정/삭제 성공 시 TanStack Query로 목록 재조회(invalidate).
- 삭제는 확인 다이얼로그를 거친 뒤 호출 (되돌릴 수 없는 하드 삭제이므로).
- 서버가 400/409를 반환하면 폼 에러 또는 토스트로 표시 (예: "본인 계정은 비활성화할 수 없습니다", "마지막 남은 활성 계정입니다").

## 에러 처리

- 이메일 중복: 409 (`docs/rule/api-response-convention.md`의 `ProblemDetail`)
- 자기 자신 보호 위반: 400
- 마지막 계정 보호 위반: 409
- 권한 없음(`@RequiresPermission` 불통과): 403
- 비밀번호 불일치(`change-password`): 400

## 테스트

- api: JUnit5 + MockK + Testcontainers — 계정 생성(이메일 중복 포함)/수정/삭제, 본인 보호, 마지막 계정 보호, `mustChangePassword` 전이(생성/재설정/본인변경), 컨트롤러 통합 테스트
- web: Vitest — 계정 관리 페이지(목록 검색/필터, 생성 Dialog, 수정 Sheet, 삭제 확인), `/change-password` 라우트 가드 리다이렉트, 변경 폼 제출 성공/실패
