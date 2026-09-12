# Tech Stack

## web

| 카테고리 | 라이브러리 | 용도 |
|---|---|---|
| 프레임워크 | Vite + React + TypeScript | - |
| 라우팅 | React Router | 화면 전환/URL 라우팅 (declarative 모드만 사용, 아래 참고) |
| PWA | (Vite PWA 플러그인 등, 도구는 스캐폴딩 단계에서 pin) | 설치형 웹앱 — 설치 가능성(manifest)만 제공, 오프라인 캐싱은 의도적으로 미지원 (아래 "인증 전략"의 오프라인 정책 참조) |
| 폼 | React Hook Form | 폼 상태/검증 관리 |
| 서버 상태 | TanStack Query | API 데이터 fetching/캐싱 |
| API 클라이언트 생성 | orval | OpenAPI 스펙 기반 TS 타입 + TanStack Query 훅 자동생성 (`repo-structure.md`의 API 타입 동기화 참조) |
| 스키마 검증 | Zod + @hookform/resolvers | 폼/API 응답 검증. `@hookform/resolvers/zod`의 `zodResolver`로 RHF와 연결 |
| 클라이언트 상태 | Zustand | 전역 클라이언트 상태 (인증 토큰 등) |
| UI 컴포넌트 | shadcn/ui(Base UI 프리셋) + Tailwind CSS | 기존에 구축해둔 ERP 레이아웃 재사용. shadcn/ui 기본값인 Radix 대신 **Base UI**를 프리미티브로 쓴다 |
| 차트 | recharts | shadcn/ui 프리셋에 포함된 차트 라이브러리. KPI/대시보드/리포트 레이아웃에서 사용 |
| 데이터 그리드 | react-data-grid | 재고/주문 등 스프레드시트형 인라인 편집 화면 |
| 테스트 | Vitest + React Testing Library | Vite 네이티브 테스트 러너 |

## api

| 카테고리 | 라이브러리 | 용도 |
|---|---|---|
| 프레임워크 | Kotlin + Spring Boot | - |
| 웹 | Spring Web | REST API |
| 인증/인가 | Spring Security | JWT 기반 (아래 "인증 전략" 참조) |
| JWT 발급/검증 | jjwt (io.jsonwebtoken) | HMAC 서명 기반 Access/Refresh Token. OAuth2 Resource Server(Nimbus JOSE)는 외부 OAuth2 제공자 연동 전제라 이 정도 단순 인증에는 과함 (`docs/spec/auth/tech-decisions.md` 참조) |
| 권한 체크 | Spring AOP (`spring-boot-starter-aop`) | `@RequiresPermission` 커스텀 어노테이션 기반 인가 (`docs/spec/auth/flow.md` 참조) |
| ORM | Spring Data JPA | - |
| 쿼리 빌더 | QueryDSL | 복잡한 동적 쿼리를 타입-세이프하게 |
| API 문서 | springdoc-openapi | OpenAPI 스펙 자동생성 (`repo-structure.md` 참조) |
| DB | PostgreSQL | - |
| 마이그레이션 | Flyway | DB 스키마 버전 관리 |
| 로깅 | logstash-logback-encoder | 구조화된 JSON 로그를 stdout으로 출력 (`docs/rule/logging-timezone-convention.md` 참조) |
| 테스트 | JUnit5 + MockK + Testcontainers | Testcontainers로 실제 PostgreSQL 컨테이너 기반 통합테스트 (H2는 Flyway의 Postgres 전용 SQL과 방언 불일치 위험) |

## 라우팅과 데이터 페칭의 역할 분리

- **React Router의 loader/action(데이터 로딩 API)은 사용하지 않는다.** React Router는 화면 전환/URL 구조 관리만 담당한다.
- 모든 데이터 페칭·캐싱은 TanStack Query(+orval 생성 훅)가 담당한다. 두 라이브러리 모두 자체 캐싱 계층을 갖고 있어서, 같이 쓰면 캐시가 두 군데로 갈라지고 캐시 무효화 타이밍이 꼬일 수 있다.

## 인증 전략

- JWT 기반: **Access Token은 메모리(Zustand)에만 보관**, **Refresh Token은 httpOnly + Secure 쿠키**에 저장. XSS로 토큰이 탈취되는 경로를 최소화한다.
- **인증 토큰을 담는 Zustand store에는 `persist` 미들웨어를 사용하지 않는다.** `persist`를 붙이면 Access Token이 localStorage로 새어나가 "메모리에만 보관" 설계가 그대로 깨진다. 앱 재시작 시 토큰 복구는 refresh 쿠키 기반 재발급으로만 처리한다.
- web과 api는 같은 상위 도메인으로 배포한다 (예: `app.menscake.com` / `api.menscake.com`). `SameSite=Lax`로 쿠키를 주고받기 위함이며, PWA(설치형 앱) 환경에서 크로스 오리진 쿠키 문제를 피한다.
- **오프라인 미지원은 의도적 설계다.** PWA 서비스워커는 설치 가능성(manifest)만 제공하고, 앱 셸/asset의 오프라인 캐싱(precache, 네비게이션 캐싱)은 넣지 않는다 — 네트워크가 없으면 앱 자체가 로드되지 않고 브라우저 기본 오프라인 화면이 뜬다. 인증된 API 호출이 오프라인에서 불가능하다는 근본적 한계 때문에, 어차피 못 쓰는 오프라인 "셸만 뜨고 아무것도 안 되는" 상태를 만들지 않기 위함이다.
- 오프라인 지원이 실제로 필요해지면(`docs/TBD.md` 참조) 이 정책 자체를 재검토하고, 그때 로컬 캐싱/큐잉 전략을 별도로 설계한다.
- (참고) iOS Safari에 홈 화면으로 설치된 PWA는 7일 이상 미사용 시 쿠키가 삭제될 수 있는 알려진 제약이 있다. 매일 사용하는 사내 도구 특성상 실무 영향은 낮다고 보고 진행한다.

## 갱신 규칙

- 새 라이브러리를 추가할 때는 의존성 파일(`package.json`/`build.gradle.kts`)만 고치지 않고, 이 문서에 먼저 추가(라이브러리명/용도)한 뒤 PR에 포함시킨다.
- 문서 갱신 없이 의존성만 추가된 PR은 리뷰에서 반려한다.
