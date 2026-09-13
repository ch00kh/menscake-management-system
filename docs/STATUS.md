# 프로젝트 현황 (Status)

마지막 갱신: 2026-09-13

세션이 바뀌어도 "지금까지 뭘 했고 다음에 뭘 하면 되는지"를 빠르게 파악하기 위한 핸드오프 문서다. 작업이 크게 진전될 때마다 갱신한다 — 갱신 안 하면 금방 낡은 문서가 되니, 새 세션은 여기 내용을 실제 `dev` 브랜치 상태 및 열린 이슈와 대조해서 믿을지 판단한다.

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

### 백엔드 인프라/버그 수정
- `apps/api`에 `.env` 지원 추가 (`spring.config.import: "optional:file:.env[.properties]"` — 확장자 힌트 없으면 Spring이 조용히 무시하는 함정이 있어 한 번 고침)
- 인증 안 된 요청의 401 응답에서 한글이 `?`로 깨지던 버그 수정 (`response.writer`의 Servlet 기본 ISO-8859-1 → `response.outputStream`에 직접 써서 UTF-8 보장)
- CORS `app.cors.allowed-origin`을 쉼표로 구분해 여러 origin 동시 허용 가능하도록 변경 (로컬 LAN IP 접속 대응)

### 로컬 네트워크 노출 (임시/개발용)
- `apps/web`을 `npm run dev -- --host`로 띄우면 LAN IP(`http://211.201.203.28:5173`)로도 접속 가능
- 방화벽 인바운드 규칙(5173/8080)은 관리자 권한이 필요해 **사용자가 직접 열어야 함** — 아직 안 열림, `docs/USER-TODO.md` 참조

### 에이전트 협업 프로세스 변경 (2026-09-13)
- **이슈는 사람이 직접 작성한다** (`.github/ISSUE_TEMPLATE/task.yml`). 에이전트(메인 세션)는 이슈를 생성하지 않고, 열린 이슈를 확인해 서브에이전트로 처리한다.
  - 처음엔 "이슈 전면 폐지"까지 갔다가, 사람이 비동기로 작업을 맡길 창구가 필요해 이 형태로 다시 정리함.
- **새 기능 개발은 2단계 파이프라인**: (1) 브레인스토밍 인터뷰 → `docs/spec/<도메인>/` 스펙 문서를 `dev`에 먼저 PR/머지 → (2) 그 뒤 프론트/백엔드 서브에이전트가 구현 + PR, 메인 세션이 검토 후 머지. 서브에이전트는 자기 PR을 직접 머지하지 않는다.
- **GitHub Projects 보드는 삭제** (미사용 확인 후) — 다시 안 씀.
- **PR 머지**: 로컬 lint/test + 셀프 diff 리뷰만 끝나면 승인 대기 없이 바로 머지. 단, **런타임 동작이 있는 변경(화면/API 응답 등)은 사람이 직접 실행해서 확인 후 머지** — 자동 테스트가 통과해도 실제로 깨진 사례(위 401 인코딩 버그, `.env` 버그)가 있었기 때문.
- 브랜치명 이슈 번호는 선택 사항으로 되돌림 (`<type>/<scope>-<issue번호>-<설명>` 또는 번호 없이).
- brainstorming 인터뷰 → 스펙 문서 순서는 유지 (`docs/rule/documentation-convention.md`의 "도메인 스펙 작성 규칙")
- `/suggestion` 스킬 유지 — "제안해줘"/"어떻게 생각해" 요청은 실행이 아니라 검토 요청임을 강제

### 개발 도구
- `.claude/hooks/port-guard.ps1` — Bash PreToolUse 훅. 프론트엔드 dev 서버가 5173이 아닌 포트로, 백엔드가 8080이 아닌 포트로 오버라이드되면 차단 (이 프로젝트에만 적용, `.claude/settings.json`).

## 아직 안 된 것

- **방화벽 인바운드 규칙(5173/8080)** — 사람이 관리자 권한으로 직접 열어야 함 (`docs/USER-TODO.md`)
- **사람이 해야 하는 나머지 인프라 작업** — `docs/USER-TODO.md` 참조 (DNS, 사내 서버, self-hosted runner, GitHub Environments 시크릿)
- **권한 관리 화면** (관리자가 계정별 메뉴 CRUD 권한 지정) — 계정 관리 화면의 후속 이슈로 분리해뒀던 항목, 아직 미착수. 지금은 새 계정에 권한을 주려면 DB를 직접 만져야 함
- 로그인/계정 관리 이후의 **실제 업무 기능은 아직 하나도 없음** — `apps/web/src/layouts/`의 30종은 전부 도메인 중립 데모/템플릿이지 실제 화면이 아니다

## 로컬에서 확인해보기

자세한 건 `apps/api/README.md`, `apps/web/README.md` 참조. 요약:
1. 로컬 PostgreSQL 준비 (Docker 또는 직접 설치)
2. `apps/api`: `.env.example`을 `.env`로 복사해 값 채운 뒤 `./gradlew bootRun --args='--app.cors.allowed-origin=http://localhost:5173'` (LAN IP도 같이 허용하려면 쉼표로 이어서: `--app.cors.allowed-origin=http://localhost:5173,http://<LAN IP>:5173`)
3. `apps/web`: `.env.example`을 `.env`로 복사 후 `npm run dev` (외부 접속 필요하면 `npm run dev -- --host`)
4. `http://localhost:5173/login`에서 시드된 관리자 계정으로 로그인 → 사이드바 "환경설정 → 계정 관리"

## 진행 상황을 확인하는 곳

- **`dev` 브랜치 커밋 로그**가 가장 정확한 소스
- **열린 GitHub Issues** — 사람이 에이전트에게 맡긴 작업 큐 (`gh issue list`)
- **사람이 할 일**: `docs/USER-TODO.md`
- **미정/보류 결정**: `docs/TBD.md`
- `docs/PROGRESS.md`는 컨벤션 문서 작성 단계 체크리스트라 이미 완료됨 — 현재 기능 진행 상황을 반영하지 않는다

## 다음에 고려할 것 (아직 미정)

- 다음 실제 업무 기능이 무엇일지 (주문/재고/회계 등 — 사용자와 논의 필요)
- 권한 관리 화면을 언제 만들지
