# 프로젝트 현황 (Status)

마지막 갱신: 2026-09-13

세션이 바뀌어도 "지금까지 뭘 했고 다음에 뭘 하면 되는지"를 빠르게 파악하기 위한 핸드오프 문서다. 작업이 크게 진전될 때마다 갱신한다 — 갱신 안 하면 금방 낡은 문서가 되니, 새 세션은 여기 내용을 실제 `dev` 브랜치 상태와 대조해서 믿을지 판단한다 (더 이상 GitHub Issues로 진행 상황을 트래킹하지 않는다 — 아래 "에이전트 협업 프로세스 변경" 참조).

## 완료된 것

### 컨벤션/스캐폴딩
- `docs/rule/*` 컨벤션 문서 전체 확정 (`docs/PROGRESS.md`는 이 단계 체크리스트라 이미 완료 — 더 갱신 안 함)
- 모노레포 초기 스캐폴딩: `apps/web`(Vite+React, 도메인 중립 ERP 레이아웃 30종), `apps/api`(Kotlin+Spring Boot 기본 배선)
- GitHub 저장소 공개 전환, 브랜치 보호(`main`/`dev`), CI(`.github/workflows/ci.yml`), 라벨

### 로그인/인증 기능
- 로그인 화면 UI (`apps/web`)
- 인증 도메인 설계 스펙: `docs/spec/auth/{overview,tech-decisions,schema,api,flow}.md`
- 백엔드: `Account`/`Permission`/`RefreshToken`, JWT 발급/검증, `POST /api/auth/{login,refresh,logout}`, `@RequiresPermission` 권한 체크 메커니즘
- 프론트: Zustand 인증 스토어, 세션 복구(`RequireAuth`), 로그인 폼 실제 연동, `authorizedFetch`(401 재시도)

### 계정 관리 기능
- 설계 스펙: `docs/spec/account-management/{overview,schema,api,flow}.md`
- 백엔드: `GET/POST/PATCH/DELETE /api/accounts`, `POST /api/auth/change-password`, 본인/마지막 활성 계정 보호(서비스 계층), `must_change_password` 강제 변경 플래그, `accounts` 리소스 권한 체크
- 프론트: 계정 관리 화면(`ListModalCrud` 기반, 검색/필터/생성/수정/삭제), `/change-password` 화면, `mustChangePassword` 라우트 가드, 사이드바("환경설정 → 계정 관리")에 통합
- 실사용 데이터: 시드 admin 계정만 `accounts` 리소스 권한을 갖고 있음 — **권한 관리 화면이 아직 없어서, 새로 만든 계정은 role을 뭘 줘도 아무 화면에도 접근 못 한다** (권한은 100% `permission` 테이블 기준, role은 라벨일 뿐). 필요하면 DB에 직접 `permission` 행을 넣어야 함.
- 진행 중 발견해서 같이 고친 버그 2건: (1) 인증 안 된 요청의 401 응답이 charset 미지정으로 한글이 `?`로 깨지던 문제, (2) `apps/api`의 `.env` 로딩 설정이 확장자 힌트 누락으로 실제로는 전혀 동작 안 하던 문제

### 에이전트 협업 프로세스 변경 (2026-09-13)
- **작업 단위별 GitHub Issue 생성 + GitHub Projects 보드 트래킹을 폐지했다.** 병목만 되고 실효가 없다는 판단. 이제 `docs/spec/<도메인>/` 스펙 문서가 "무엇을 만들지"의 SSOT이고, 런타임 동작이 있는 변경은 머지 전에 사람이 직접 실행해서 확인한다 (`docs/rule/agent-collaboration.md` 참조). Projects 보드는 삭제, 이슈 템플릿도 제거, 브랜치명에서 이슈 번호도 뺐다 (`<type>/<scope>-<short-description>`).
- PR은 계속 쓰되, lint/test + 셀프 diff 리뷰만 끝나면(런타임 동작이 없는 문서/설정 변경 한정) 승인 대기 없이 바로 머지한다.
- brainstorming 인터뷰 → 스펙 문서 → 구현 순서는 표준 워크플로우로 유지 (`docs/rule/documentation-convention.md`의 "도메인 스펙 작성 규칙")
- `/suggestion` 스킬 유지 — "제안해줘"/"어떻게 생각해" 요청은 실행이 아니라 검토 요청임을 강제

## 아직 안 된 것

- **사람이 해야 하는 인프라 작업** — `docs/USER-TODO.md` 참조 (DNS, 사내 서버, self-hosted runner, GitHub Environments 시크릿)
- **권한 관리 화면** (관리자가 계정별 메뉴 CRUD 권한 지정) — 계정 관리 화면의 후속 이슈로 분리해뒀던 항목, 아직 미착수. 지금은 새 계정에 권한을 주려면 DB를 직접 만져야 함
- 로그인/계정 관리 이후의 **실제 업무 기능은 아직 하나도 없음** — `apps/web/src/layouts/`의 30종은 전부 도메인 중립 데모/템플릿이지 실제 화면이 아니다

## 로컬에서 확인해보기

자세한 건 `apps/api/README.md`, `apps/web/README.md` 참조. 요약:
1. 로컬 PostgreSQL 준비 (Docker 또는 직접 설치)
2. `apps/api`: `.env.example`을 `.env`로 복사해 값 채운 뒤 `./gradlew bootRun --args='--app.cors.allowed-origin=http://localhost:5173'`
3. `apps/web`: `.env.example`을 `.env`로 복사 후 `npm run dev`
4. `http://localhost:5173/login`에서 시드된 관리자 계정으로 로그인 → 사이드바 "환경설정 → 계정 관리"

## 진행 상황을 확인하는 곳

- **`dev` 브랜치 커밋 로그**가 가장 정확한 소스 (GitHub Issues/Projects는 더 이상 안 씀)
- **사람이 할 일**: `docs/USER-TODO.md`
- **미정/보류 결정**: `docs/TBD.md`
- `docs/PROGRESS.md`는 컨벤션 문서 작성 단계 체크리스트라 이미 완료됨 — 현재 기능 진행 상황을 반영하지 않는다

## 다음에 고려할 것 (아직 미정)

- 다음 실제 업무 기능이 무엇일지 (주문/재고/회계 등 — 사용자와 논의 필요)
- 권한 관리 화면을 언제 만들지
