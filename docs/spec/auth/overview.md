# 인증/로그인 — 개요

## 배경

`apps/web`에 로그인 화면(#8, 병합 완료)은 만들어졌지만 실제 인증 로직이 없다. `docs/rule/tech-stack.md`에 정의된 인증 전략(JWT, Access Token은 클라이언트 메모리, Refresh Token은 httpOnly 쿠키)에 맞춰 실제 인증/인가 도메인을 설계한다.

## 범위

**포함:**
- `Account`, `Permission`(계정별 리소스별 CRUD), `RefreshToken`(철회 가능) 도메인 — 스키마는 [schema.md](./schema.md)
- 로그인 / 토큰 갱신 / 로그아웃 API, JWT 발급·검증 — 흐름은 [flow.md](./flow.md)
- 향후 실제 업무 화면이 사용할 권한 체크 메커니즘(어노테이션 + AOP) — 지금은 메커니즘만, 실사용처 없음
- 프론트: 로그인 폼 실제 제출 연동, 인증 상태 저장(Zustand), 앱 부팅 시 세션 복구, 라우트 가드

**제외 (별도 이슈로 분리):**
- 계정 관리 화면(관리자가 직원 계정 생성) — 지금은 Flyway 시드 데이터로 대체
- 권한 관리 화면(관리자가 계정별 메뉴 CRUD 지정) — 지금은 Flyway 시드 데이터로 대체
- 계정 잠금 / 브루트포스 방어 (YAGNI, 필요해지면 재논의)

## 문서 구성

| 파일 | 내용 |
|---|---|
| [overview.md](./overview.md) | 배경, 범위 (이 문서) |
| [tech-decisions.md](./tech-decisions.md) | 기술 선택과 근거 |
| [schema.md](./schema.md) | ERD, 테이블/컬럼 정의 |
| [flow.md](./flow.md) | 인증 흐름, API 계약, 권한 체크 메커니즘, 프론트 연동, 에러 처리, 테스트 |

## 후속 이슈 (이번 범위 밖)

- 계정 관리 화면 (관리자가 직원 계정 CRUD)
- 권한 관리 화면 (관리자가 계정별 메뉴 CRUD 권한 지정)
- 실제 업무 메뉴가 생길 때 `@RequiresPermission` 실사용 적용
