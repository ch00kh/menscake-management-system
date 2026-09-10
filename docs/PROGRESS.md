# Convention Progress

**요약:** 최초 9개 항목 + 검토에서 발견된 갭 8개, 전부 완료. 🎉

**확정된 기술스택 조각:** web = Vite + React (TS), api = Kotlin + Spring Boot (아래 항목들 논의에 참고)

## 체크리스트 (최초 9개)

| 상태 | 항목 | 설명 | 문서 |
|---|---|---|---|
| ✅ | Git 컨벤션 | 브랜치 전략, 커밋 메시지, PR 규칙 (브랜치명에 이슈번호 포함) | `docs/rule/git-convention.md` |
| ✅ | 저장소/모노레포 구조 | `apps/web`(Vite+React), `apps/api`(Kotlin+Spring), OpenAPI 타입 동기화 | `docs/rule/repo-structure.md` |
| ✅ | 네이밍 규칙 | web/api 파일·변수·DB·API 경로 케이스 컨벤션 | `docs/rule/naming-convention.md` |
| ✅ | 에이전트 협업 규칙 | GitHub Issue=SSOT, 가정 절대 금지, 작업 전/후 체크리스트 | `docs/rule/agent-collaboration.md` |
| ✅ | 문서화 규칙 | 주석 정책(public=KDoc/JSDoc, 내부=WHY만), README, 문서 언어 | `docs/rule/documentation-convention.md` |
| ✅ | 환경설정/시크릿 관리 | `.env` 원칙, Vite VITE_ 접두사 주의, GitHub Secrets/Environments | `docs/rule/env-secrets-convention.md` |
| ✅ | 이슈/작업 관리 | GitHub Projects 보드(자동 워크플로우), 라벨, 이슈 템플릿 | `docs/rule/issue-management.md` |
| ✅ | 코드 스타일/린트 정책 | ESLint+Prettier(web), ktlint(api), 커밋 시 auto-fix | `docs/rule/code-style-convention.md` |
| ✅ | 기술스택 정의 | web(Vite+React+shadcn/ui 등), api(Kotlin+Spring+JPA+QueryDSL 등), PWA 인증전략 | `docs/rule/tech-stack.md` |

## 체크리스트 (전체 검토에서 발견된 갭)

| 상태 | 항목 | 설명 | 문서 |
|---|---|---|---|
| ✅ | 죽은 scope 이름 정정 | git-convention의 `order-service` → `web`/`api` | `docs/rule/git-convention.md` |
| ✅ | 인증 토큰 저장 구멍 | Zustand `persist` 미들웨어 금지 명시 | `docs/rule/tech-stack.md` |
| ✅ | 배포 인프라 | 사내 서버+Docker, self-hosted runner, 도메인/TLS, CORS 설정 | `docs/rule/infra-deployment.md` |
| ✅ | API 응답 포맷 표준 | 성공=DTO/Page 직렬화, 에러=RFC 7807 ProblemDetail, 상태코드 원칙 | `docs/rule/api-response-convention.md` |
| ✅ | 생성 코드 예외 처리 | `apps/web/src/api/generated/`를 lint/주석 규칙에서 제외 | `docs/rule/code-style-convention.md`, `docs/rule/documentation-convention.md` |
| ✅ | 테스트 작성 의무 | 핵심 로직만 필수, 애매하면 가정 금지 규칙 적용, 커버리지 강제 없음 | `docs/rule/testing-convention.md` |
| ✅ | 로깅/모니터링 + 날짜·타임존 | KST 고정, JSON 로그+docker logs, 로그 레벨/민감정보 마스킹 | `docs/rule/logging-timezone-convention.md` |
| ✅ | CI 경로 분리 | 워크플로우는 항상 트리거, paths-filter로 job만 분기, required check는 워크플로우 단위 | `docs/rule/ci-convention.md` |

## 체크리스트 (2차 전체 검토에서 발견된 갭)

| 상태 | 항목 | 설명 | 문서 |
|---|---|---|---|
| ✅ | API 클라이언트 생성 도구 누락 | tech-stack.md에 orval 추가 (repo-structure.md에만 예시로 있었음) | `docs/rule/tech-stack.md`, `docs/rule/repo-structure.md` |
| ✅ | 라우팅 라이브러리 미정 | React Router 확정, TanStack Query와 역할 분리(loader/action 미사용) 명시 | `docs/rule/tech-stack.md` |
| ✅ | 낡은 문구 정리 | "기술스택 확정 단계에서" → "실제 스캐폴딩 단계에서" (tech-stack.md 완료 후 문구가 안 맞았음) | `docs/rule/repo-structure.md`, `docs/rule/code-style-convention.md` |

## 진행 방식

하나씩 순서대로 얘기해서 결정 → 해당 문서에 반영 → 이 표의 상태를 ⬜ → ✅ 로 갱신.

## 다음 순서 추천

체크리스트 전부 완료 (1차 9개 + 1차 검토 갭 8개 + 2차 검토 갭 3개). 다음은 실제 모노레포 스캐폴딩(빈 프로젝트 생성, `apps/web`·`apps/api` 초기 세팅, husky/commitlint/ktlint/Flyway/self-hosted runner 등 도구 설치)으로 넘어갈 차례입니다.

**TBD 중 추가로 결정한 것:**
- DTO 네이밍(`<Resource><Action>Request`/`<Resource>Response`) 확정 → `docs/rule/naming-convention.md`
- API 성공 응답을 `{ "data": ... }`로 감싸는 wrapper 방식으로 변경, `ApiResponse<T>`를 컨트롤러가 명시적으로 반환해야 하는 이유(springdoc/orval 정합성)까지 명시 → `docs/rule/api-response-convention.md`

**미정 항목:** 지금 당장 결정할 필요는 없지만 나중에 다시 다뤄야 할 항목들은 `docs/TBD.md`에 모아뒀다 (PWA 라이브러리/web 내부 폴더 구조는 "작업하면서 정한다"로 합의).

**사용자가 해야 할 일:** `docs/USER-TODO.md` 참조.
