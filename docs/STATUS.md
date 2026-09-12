# 프로젝트 현황 (Status)

마지막 갱신: 2026-09-12

세션이 바뀌어도 "지금까지 뭘 했고 다음에 뭘 하면 되는지"를 빠르게 파악하기 위한 핸드오프 문서다. 작업이 크게 진전될 때마다 갱신한다 — 갱신 안 하면 금방 낡은 문서가 되니, 새 세션은 여기 내용을 GitHub Issues 상태와 대조해서 믿을지 판단한다.

## 완료된 것

### 컨벤션/스캐폴딩
- `docs/rule/*` 컨벤션 문서 전체 확정 (`docs/PROGRESS.md`는 이 단계 체크리스트라 이미 완료 — 더 갱신 안 함)
- 모노레포 초기 스캐폴딩: `apps/web`(Vite+React, 도메인 중립 ERP 레이아웃 30종), `apps/api`(Kotlin+Spring Boot 기본 배선)
- GitHub 저장소 공개 전환, 브랜치 보호(`main`/`dev`), CI(`.github/workflows/ci.yml`), 라벨, 이슈/PR 템플릿

### 로그인/인증 기능 (이슈 #8, #14, #16, #17)
- 로그인 화면 UI (`apps/web`)
- 인증 도메인 설계 스펙: `docs/spec/auth/{overview,tech-decisions,schema,api,flow}.md`
- 백엔드: `Account`/`Permission`/`RefreshToken`, JWT 발급/검증, `POST /api/auth/{login,refresh,logout}`, `@RequiresPermission` 권한 체크 메커니즘(실사용처는 아직 없음)
- 프론트: Zustand 인증 스토어, 세션 복구(`RequireAuth`), 로그인 폼 실제 연동, `authorizedFetch`(401 재시도 메커니즘, 실사용처는 아직 없음)
- 전부 `dev`에 병합, CI 통과 (2026-09-12 기준 열린 이슈/PR 0개)

### 에이전트 협업 프로세스 개선
- brainstorming 인터뷰 → 스펙 문서 → 이슈 순서를 표준 워크플로우로 정착 (`docs/rule/documentation-convention.md`의 "도메인 스펙 작성 규칙")
- 이슈 생성 시점에 병렬 실행 가능 여부를 판단하는 규칙 추가 (`docs/rule/agent-collaboration.md`)
- `/suggestion` 스킬 추가 — "제안해줘" 요청은 실행이 아니라 검토 요청임을 강제

## 아직 안 된 것

- **사람이 해야 하는 인프라 작업** — `docs/USER-TODO.md` 참조 (DNS, 사내 서버, self-hosted runner, GitHub Environments 시크릿, Projects 자동화 수동 활성화)
- 로그인 이후의 **실제 업무 기능은 아직 하나도 없음** — `apps/web/src/layouts/`의 30종은 전부 도메인 중립 데모/템플릿이지 실제 화면이 아니다
- 계정 관리 화면 / 권한 관리 화면(관리자가 직원 계정·권한을 화면에서 CRUD) — 지금은 Flyway 시드로만 존재 (`docs/spec/auth/overview.md`의 "후속 이슈" 참조)

## 로컬에서 확인해보기

자세한 건 `apps/api/README.md`, `apps/web/README.md` 참조. 요약:
1. 로컬 PostgreSQL 준비 (Docker 또는 직접 설치)
2. `apps/api`: `DB_URL`/`DB_USERNAME`/`DB_PASSWORD`/`JWT_SECRET`/`ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD` 환경변수 설정 후 `./gradlew bootRun --args='--app.cors.allowed-origin=http://localhost:5173'`
3. `apps/web`: `.env.example`을 `.env`로 복사 후 `npm run dev`
4. `http://localhost:5173/login`에서 시드된 관리자 계정으로 로그인

## 진행 상황을 확인하는 곳

- **GitHub Issues**(닫힘 = 완료): https://github.com/ch00kh/menscake-management-system/issues?q=is%3Aissue — 가장 정확한 소스
- **사람이 할 일**: `docs/USER-TODO.md`
- **미정/보류 결정**: `docs/TBD.md`
- `docs/PROGRESS.md`는 컨벤션 문서 작성 단계 체크리스트라 이미 완료됨 — 현재 기능 진행 상황을 반영하지 않는다

## 다음에 고려할 것 (아직 미정)

- 다음 실제 업무 기능이 무엇일지 (주문/재고/회계 등 — 사용자와 논의 필요)
- 계정/권한 관리 화면을 언제 만들지
