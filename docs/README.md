# Docs 지도

`docs/rule/`이 이 프로젝트 컨벤션의 SSOT다. 코드나 PR에서 문서와 다른 방식을 발견해도 임의로 새 패턴을 만들지 않는다 — 먼저 여기서 찾고, 없으면 문서 추가를 제안한다.

## 상황별 라우팅

| 하려는 것 | 볼 문서 |
|---|---|
| 브랜치 만들기 / 커밋 메시지 / PR 올리기 | [git-convention](rule/git-convention.md) |
| 이슈에 할당됐는데 요구사항이 애매함 | [agent-collaboration](rule/agent-collaboration.md) |
| GitHub Issue 라벨/템플릿/보드 상태 | [issue-management](rule/issue-management.md) |
| 새 폴더/파일 어디에 둘지 | [repo-structure](rule/repo-structure.md) |
| 파일명/변수명/DB컬럼명/API경로 네이밍, 필드가 상태인지 분류인지 헷갈릴 때 | [naming-convention](rule/naming-convention.md) |
| API 응답 JSON 모양, 에러 포맷, 상태코드 | [api-response-convention](rule/api-response-convention.md) |
| 어떤 라이브러리 쓰는지 (web/api) | [tech-stack](rule/tech-stack.md) |
| lint/포맷터 설정, pre-commit 동작 | [code-style-convention](rule/code-style-convention.md) |
| 테스트를 꼭 써야 하는지 | [testing-convention](rule/testing-convention.md) |
| 코드 주석 규칙, README 작성 | [documentation-convention](rule/documentation-convention.md) |
| `.env`/시크릿 다루는 법 | [env-secrets-convention](rule/env-secrets-convention.md) |
| 로그 레벨, 타임존(KST) | [logging-timezone-convention](rule/logging-timezone-convention.md) |
| 서버/도메인/CORS/배포 구조 | [infra-deployment](rule/infra-deployment.md) |
| CI 워크플로우가 왜 이렇게 짜여 있는지 | [ci-convention](rule/ci-convention.md) |
| 새 도메인 설계 시작하기 전에 용어 확인 | [glossary](glossary.md) |
| 도메인 설계 스펙(ERD/API 계약 등) | `spec/<도메인>/` (예: [spec/auth](spec/auth/overview.md)) |
| 도메인 스펙/API 계약을 어떻게 써야 하는지 | [documentation-convention의 "도메인 스펙 작성 규칙"](rule/documentation-convention.md) |

## 전체 문서 목록

### `rule/` — 컨벤션 SSOT

| 문서 | 요약 |
|---|---|
| [git-convention.md](rule/git-convention.md) | 브랜치 전략, 커밋 메시지, PR 규칙 |
| [repo-structure.md](rule/repo-structure.md) | `apps/web`·`apps/api` 구조, OpenAPI 타입 동기화 |
| [naming-convention.md](rule/naming-convention.md) | web/api 파일·변수·DB·API 경로 케이스 컨벤션 |
| [agent-collaboration.md](rule/agent-collaboration.md) | GitHub Issue = SSOT, 가정 절대 금지, 작업 전/후 체크리스트 |
| [documentation-convention.md](rule/documentation-convention.md) | 주석 정책, README, 문서 언어, docs 폴더 구조 |
| [env-secrets-convention.md](rule/env-secrets-convention.md) | `.env` 원칙, Vite `VITE_` 접두사 주의, GitHub Secrets/Environments |
| [issue-management.md](rule/issue-management.md) | GitHub Projects 보드, 라벨, 이슈 템플릿 |
| [code-style-convention.md](rule/code-style-convention.md) | ESLint+Prettier(web), ktlint(api), 커밋 시 auto-fix |
| [tech-stack.md](rule/tech-stack.md) | web/api 라이브러리 목록, 라우팅/데이터 페칭 역할 분리, 인증 전략 |
| [infra-deployment.md](rule/infra-deployment.md) | 사내 서버+Docker, self-hosted runner, 도메인/TLS, CORS |
| [api-response-convention.md](rule/api-response-convention.md) | 성공 응답(`data` wrapper)/에러 응답(RFC 7807)/상태코드 원칙 |
| [testing-convention.md](rule/testing-convention.md) | 테스트 필수 대상, 커버리지 강제 없음 |
| [logging-timezone-convention.md](rule/logging-timezone-convention.md) | KST 고정, JSON 로그, 로그 레벨, 민감정보 마스킹 |
| [ci-convention.md](rule/ci-convention.md) | 워크플로우는 항상 트리거, paths-filter로 job만 분기 |

### 그 외

| 문서 | 용도 |
|---|---|
| [PROGRESS.md](PROGRESS.md) | 컨벤션 논의 진행 체크리스트 (히스토리 기록용) |
| [TBD.md](TBD.md) | 지금은 안 정하고 트리거 조건까지 미뤄둔 항목 |
| [USER-TODO.md](USER-TODO.md) | 에이전트가 아니라 사람이 직접 해야 하는 일 |
| [glossary.md](glossary.md) | 도메인별 용어 ↔ 실제 코드/DB 이름 사전 |
| `spec/<도메인>/` | 도메인 설계 스펙 (brainstorming 스킬 architectural 경로 산출물) |

`rule/` 외 새 하위 폴더가 필요해지면 그때 추가하고 이 지도도 같이 갱신한다 (YAGNI, `documentation-convention.md` 참조).
