# CLAUDE.md

멘즈케이크 사내 관리 시스템. 모노레포: `apps/web`(Vite + React + TypeScript), `apps/api`(Kotlin + Spring Boot).

## 시작하기 전에

- 이 프로젝트의 모든 컨벤션은 `docs/rule/`이 SSOT다. 코드에서 문서와 다른 방식을 발견해도 임의로 새 패턴을 만들지 않는다 — 먼저 문서를 확인하고, 없는 규칙이 필요하면 문서 추가부터 제안한다.
- 어떤 문서를 봐야 할지 모르겠으면 `docs/README.md`(상황별 라우팅 지도)부터 연다.
- 작업을 시작하기 전에 반드시 `docs/rule/agent-collaboration.md`를 읽는다 — 작업 할당 방식, 모호함 처리 원칙, 작업 전/후 체크리스트가 있다.

## 핵심 원칙

- **가정 금지**: 요구사항이 모호하면 추측으로 진행하지 않는다. 해당 GitHub Issue에 질문을 남기고 응답이 올 때까지 대기한다 (`docs/rule/agent-collaboration.md`).
- 자신에게 assign된 Issue만 작업한다.
- PR을 올리기 전에 로컬 lint/test를 통과시키고, 스스로 diff를 리뷰한다.

## 아직 정해지지 않은 것

- 스캐폴딩/작업 중 자연스럽게 정하기로 미뤄둔 항목은 `docs/TBD.md`에 있다.
- 사람이 직접 해야 하는 일(도메인 DNS, 서버 준비, GitHub 설정 등)은 `docs/USER-TODO.md`에 있다.
