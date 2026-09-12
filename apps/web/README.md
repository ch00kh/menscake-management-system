# ERP Layout Kit

Vite + React + TypeScript + Tailwind v4 + shadcn/ui(Base UI, `nova` 프리셋) 기반의
**도메인 중립 ERP 화면 레이아웃 30종** 모음입니다.

구매/생산/재고/회계/인사 어느 도메인이든, 만들려는 업무에 맞는 레이아웃을 골라
`src/layouts/`에서 복사해 쓰고 더미 데이터를 실제 데이터로 바꾸면 됩니다.

이 README 안의 경로는 모두 `apps/web/` 기준입니다.

## 실행

`apps/web/`에서 실행합니다.

```bash
cd apps/web
npm install
npm run dev              # http://localhost:5173
npm run dev -- --host    # 같은 네트워크의 다른 기기에서 접속
npm run build
npm run lint
npm run typecheck
npm run format
```

## 환경변수

`.env.example`을 복사해 `.env`로 만들고 값을 채웁니다 (`docs/rule/env-secrets-convention.md` 참조).

| 변수 | 설명 |
|---|---|
| `VITE_API_BASE_URL` | 백엔드 API 서버 주소 (예: `http://localhost:8080`). 비밀값 아님 |

첫 화면(`/`)이 30종 갤러리입니다. 좌측 사이드바 또는 `Ctrl/Cmd + K`로 이동합니다.

## 구조

```
src/
  app/
    AppShell.tsx         사이드바 + 헤더 + 커맨드 팔레트 (모든 레이아웃의 공통 껍데기)
    AppSidebar.tsx       레지스트리 기반 내비게이션
    Gallery.tsx          30종 카탈로그(홈)
    LayoutPage.tsx       /layouts/:slug 라우팅
    RequireAuth.tsx      셸 진입 전 세션 확인 (실패 시 /login 리다이렉트)
    TabBar.tsx / TabWorkspace.tsx / TabStoreProvider.tsx   탭 상태/워크스페이스
    tabContext.ts / tabResolve.tsx                         탭 관련 컨텍스트·리졸버
    menu.ts              사이드바 메뉴 데이터
  pages/
    LoginPage.tsx        /login 화면 (셸 진입 전, 별도 라우트)
  layouts/
    registry.ts          30종 메타데이터 (번호·이름·그룹·용도·컴포넌트)
    <LayoutName>.tsx     레이아웃 30개 (컴포넌트명과 파일명 일치, PascalCase)
  api/
    auth.ts              /api/auth/{login,refresh,logout} 클라이언트 (손으로 작성, orval 미사용)
    http.ts               authorizedFetch — 401 시 refresh 재시도 메커니즘 (아직 실사용처 없음)
  hooks/
    useAuthStore.ts       인증 상태(Zustand) — accessToken은 메모리에만, persist 없음
    use-mobile.ts         shadcn CLI가 함께 생성한 훅 (직접 수정하지 않음)
  components/
    auth/
      LoginForm.tsx       로그인 폼 (RHF + Zod, 실제 로그인 API 연동)
    erp/                 레이아웃들이 공유하는 업무용 블록 (파일당 관련 컴포넌트 묶음)
      Page.tsx           Page / FullPage / Surface 컨테이너
      PageHeader.tsx     PageHeader(브레드크럼+제목+액션), PaneHeader(패널 제목줄)
      FilterBar.tsx      FilterBar(가로 검색바), FilterFields(세로 필터 패널)
      RecordTable.tsx    RecordTable(표), TableFooterBar(건수+페이지네이션)
      Stats.tsx          StatCard(KPI), DescriptionList(라벨/값 나열)
      Charts.tsx         TrendChart / ComparisonChart / CompositionChart
    ui/                  shadcn/ui 컴포넌트 (CLI가 생성 — 직접 수정하지 않음)
    ThemeProvider.tsx    라이트/다크 테마 컨텍스트
  data/mock.ts           도메인 중립 더미 데이터
  test/setup.ts          Vitest + Testing Library 전역 설정
```

파일명은 `docs/rule/naming-convention.md`를 따릅니다 (컴포넌트 = PascalCase, hook/util = camelCase). `components/ui/**`와 `hooks/use-mobile.ts`는 shadcn CLI 산출물이라 예외입니다.

## 레이아웃 30종

| # | 그룹 | 이름 | 언제 쓰나 |
|---|------|------|-----------|
| 1 | 목록·검색 | 기본 목록 | 가장 표준적인 조회 화면 |
| 2 | 목록·검색 | 좌측 필터 패널 목록 | 조건을 자주 바꿔가며 조회할 때 |
| 3 | 목록·검색 | 상세 조회 목록 | 조건이 많지만 평소엔 2~3개만 쓸 때 |
| 4 | 목록·검색 | 상태별 탭 목록 | 상호배타적 축으로 목록을 나눌 때 |
| 5 | 목록·검색 | 그룹 목록 | 그룹별 건수·합계가 중요할 때 |
| 6 | 목록·검색 | 카드 그리드 목록 | 건별 요약 정보가 많을 때 |
| 7 | 상세·편집 | 마스터-디테일 | 목록↔상세를 번갈아 보는 검토 업무 |
| 8 | 상세·편집 | 탭 상세 | 한 건의 정보가 성격별로 나뉠 때 |
| 9 | 상세·편집 | 요약 사이드 상세 | 상태·액션이 늘 보여야 할 때 |
| 10 | 상세·편집 | 이력 타임라인 상세 | 처리 경과를 시간 순으로 추적 |
| 11 | 상세·편집 | 3분할 | 분류 → 항목 → 상세 탐색 |
| 12 | 상세·편집 | 문서 출력 뷰 | 인쇄·PDF가 목적인 전표 |
| 13 | 입력·폼 | 단일 컬럼 폼 | 항목 10개 이하 등록/수정 |
| 14 | 입력·폼 | 2단 폼 + 액션 사이드 | 항목이 많고 액션이 여러 개 |
| 15 | 입력·폼 | 앵커 섹션 폼 | 섹션 5개 이상 설정 화면 |
| 16 | 입력·폼 | 단계 입력 위저드 | 단계 간 의존이 있는 신청 업무 |
| 17 | 입력·폼 | 전표 입력 | 헤더 1건 + 명세 N행 (ERP 핵심 패턴) |
| 18 | 입력·폼 | 목록 + 모달 등록 | 단순 기준정보 CRUD |
| 19 | 분석·대시보드 | KPI 대시보드 | 모듈 첫 화면 |
| 20 | 분석·대시보드 | 운영 모니터링 | 현장 상황판 |
| 21 | 분석·대시보드 | 집계 리포트 | 구분 × 기간 매트릭스 |
| 22 | 분석·대시보드 | 조건형 분석 | 조건을 바꿔가며 보는 분석 |
| 23 | 분석·대시보드 | 위젯 보드 | 사용자 구성형 개인 홈 |
| 24 | 프로세스·워크플로 | 결재함 | 대량 승인/반려 처리 |
| 25 | 프로세스·워크플로 | 진행 현황 | 단계별 진행 위치 + 이력 |
| 26 | 프로세스·워크플로 | 칸반 보드 | 상태 전환이 잦은 업무 |
| 27 | 프로세스·워크플로 | 일정 캘린더 | 날짜가 1차 축인 업무 |
| 28 | 마스터·구조 | 트리 + 그리드 | 계층 분류 기준정보 |
| 29 | 마스터·구조 | 계층 다이어그램 | 조직·BOM·계정과목 |
| 30 | 마스터·구조 | 좌우 배정 | 권한·메뉴 배정/해제 |

## 새 화면 만들기

1. `src/layouts/`에서 가장 가까운 레이아웃 파일을 복사합니다.
2. `src/data/mock.ts` 대신 실제 데이터/타입을 연결합니다.
3. `src/layouts/registry.ts`에 항목을 추가하면 사이드바·갤러리·커맨드 팔레트에 자동 반영됩니다.

레이아웃 컨테이너는 두 가지입니다.

- `<Page>` — 위아래로 스크롤되는 일반 업무 화면 (패딩 포함)
- `<FullPage>` — 화면 높이를 채우고 내부 패널에서 스크롤 (마스터-디테일, 전표 입력, 칸반 등)

`registry.ts`의 `fullHeight` 플래그가 어느 쪽인지 표시합니다.

## 커스터마이징

- **테마/색상**: `src/index.css`의 CSS 변수. 차트 색은 `--chart-1` ~ `--chart-5`
  (현재 `nova` + neutral 베이스라 무채색입니다. 브랜드 색을 넣으면 차트가 살아납니다).
- **프리셋 교체**: `npx shadcn@latest apply <preset-code> --only theme,font`
- **컴포넌트 추가**: `npx shadcn@latest add <component>`

`src/components/ui/**`는 shadcn CLI가 관리하므로 직접 수정하지 않는 것을 전제로
ESLint 대상에서 제외해 두었습니다(`eslint.config.js`).
