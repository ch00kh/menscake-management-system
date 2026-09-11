# Naming Convention

| 대상 | 스택 | 규칙 | 예시 |
|---|---|---|---|
| 컴포넌트 파일 | web | PascalCase.tsx (컴포넌트명과 일치) | `OrderList.tsx` |
| 일반 파일 (hook/util/상수) | web | camelCase | `useOrderList.ts`, `formatCurrency.ts` |
| 변수/함수 | web | camelCase | `orderCount`, `fetchOrders()` |
| 컴포넌트/타입/인터페이스 | web | PascalCase | `OrderList`, `OrderStatus` |
| 상수 | web | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 클래스/파일 | api | PascalCase.kt (클래스명과 일치) | `OrderService.kt` |
| 함수/변수 | api | camelCase | `orderId`, `findOrderById()` |
| 패키지 | api | 소문자, 점 구분, 언더스코어 없음 | `com.menscake.api.order` |
| 상수 | api | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| DB 테이블/컬럼 | api | snake_case (Kotlin camelCase 필드는 Hibernate가 자동 변환) | `production_request`, `created_at` |
| REST API 경로 | api | kebab-case, 복수형 명사 | `/orders`, `/production-requests` |
| DTO — 생성/수정 요청 | api | `<Resource><Action>Request` | `OrderCreateRequest`, `OrderUpdateRequest` |
| DTO — 검색/필터 조건 | api | `<Resource>SearchRequest` | `OrderSearchRequest` |
| DTO — 응답 | api | `<Resource>Response` | `OrderResponse` |
| 응답 wrapper | api | `ApiResponse<T>` (제네릭, 모든 성공 응답 공통) | `ApiResponse<OrderResponse>` |
| 폴더 | 공통 | kebab-case | `order-management/` |

## 예외 — 생성/외부관리 코드

- `docs/rule/repo-structure.md`의 "생성/외부관리 코드" 목록에 있는 경로(orval 자동생성, shadcn/ui CLI 산출물 등)는 이 문서의 파일 네이밍 규칙 대상이 아니다. 도구/CLI가 만든 원래 이름을 그대로 둔다 — 임의로 리네이밍하면 재생성/재실행 시 충돌하거나 불필요한 diff가 생긴다.

## 예외 — 관련 프리미티브 묶음 파일

- 서로 밀접하게 관련된 작은 컴포넌트 여러 개를 한 파일에 묶어두는 경우, "컴포넌트 파일명 = 컴포넌트명 일치" 규칙을 파일 안 **대표 컴포넌트**(보통 가장 먼저 export되거나 이름을 대표하는 것) 기준으로만 적용한다. 같은 파일의 나머지 컴포넌트는 파일명과 이름이 달라도 된다.
- 예: `apps/web/src/components/erp/PageHeader.tsx`는 `PageHeader`와 `PaneHeader`를 함께 export하고, `FilterBar.tsx`는 `FilterBar`와 `FilterFields`를, `RecordTable.tsx`는 `RecordTable`과 `TableFooterBar`를, `Page.tsx`는 `Page`/`FullPage`/`Surface`를, `Stats.tsx`는 `StatCard`/`DescriptionList`를, `Charts.tsx`는 `TrendChart`/`ComparisonChart`/`CompositionChart`를 함께 export한다.
- 이 예외는 "관련 UI 프리미티브 묶음"에만 쓴다. 서로 관련 없는 컴포넌트를 편의상 한 파일에 몰아넣는 것까지 정당화하지 않는다 — 그런 경우는 파일을 분리한다.

## 필드 설계 — 상태(state) vs 분류(classification)

엔티티에 필드를 추가할 때, 그 필드가 로직에 쓰이는지 아닌지에 따라 둘 중 하나로 명확히 구분한다.

- **상태(state):** 값에 따라 화면/기능/접근 제어가 달라지는 필드 — 조건부 렌더링, 워크플로우 전환, 인가 판단에서 실제로 조회·분기된다. 이름은 `is_<형용사>`(불리언) 또는 `status`(전이가 여러 단계인 enum)로 짓는다. 예: `Account.is_active`(꺼지면 로그인 자체가 막힘), `RefreshToken.revoked_at`(있으면 무효).
- **분류(classification):** 화면에 라벨로 보여지기만 할 뿐, 그 자체로는 아무 로직도 바꾸지 않는 필드. 이름은 `type`/`category`/`role` 등으로 짓는다. 예: `Account.role`(ADMIN/MANAGER/STAFF) — 인가 로직 어디에서도 참조되지 않고, 실제 권한은 별도 권한 테이블이 전담한다.
- **판별 기준은 "실제로 코드가 이 필드를 조회해서 분기하는가"다.** 인가/조건부 렌더링/워크플로우 코드가 그 필드를 참조하는 순간 그건 상태다. 반대로 "나중에 로직에 쓰일 수도 있으니 미리 상태로 설계해두자"처럼 앞서서 승격하지 않는다(YAGNI) — 실제로 로직이 참조하게 되는 시점에 상태로 전환하고 이름도 그에 맞게 바꾼다.
- **저장은 문자열, 애플리케이션은 enum:** 상태/분류 필드는 DB에는 문자열(varchar)로 저장하고, api(Kotlin)에서는 `enum class` + `@Enumerated(EnumType.STRING)`으로, web(TypeScript)에서는 문자열 리터럴 유니온 타입으로 관리한다. 정수 ordinal 저장은 쓰지 않는다 — enum 값 순서가 바뀌거나 중간에 값이 추가되면 기존 데이터의 의미가 깨지기 때문이다. 문자열 저장은 DB를 직접 봐도 값을 바로 읽을 수 있다는 장점도 있다.

## 근거

- **web 일반 파일은 camelCase:** Vite는 파일 기반 라우팅이 없어 폴더명=URL 제약이 없다. 파일명을 export하는 심볼 이름과 그대로 맞춰(`useOrderList` → `useOrderList.ts`) IDE 자동완성·자동 import·리팩토링 시 이름이 항상 일치하게 한다. (kebab-case는 주로 Angular CLI, Next.js app router처럼 파일명이 곧 경로가 되는 프레임워크에서 강제되는 관례이며 이 스택엔 해당 없음)
- **DB는 snake_case:** Hibernate(Spring Boot 기본 물리 네이밍 전략)가 Kotlin의 camelCase 필드를 자동으로 snake_case 컬럼명으로 변환해준다. 별도 매핑 어노테이션 없이 관례를 따르면 된다.
- **테이블/엔티티명은 PostgreSQL 예약어를 피한다:** 예) 사용자 계정 엔티티는 `User`/`user`가 아니라 `Account`/`account`로 쓴다 (`USER`는 `SELECT USER`처럼 세션 사용자를 가리키는 예약어). 도메인별로 실제 채택한 이름은 `docs/glossary.md`에 기록한다.
- **응답 DTO는 액션별로 나누지 않고 `<Resource>Response` 하나를 재사용한다:** 생성/조회/수정 결과가 반환하는 리소스 모양은 어차피 같기 때문에 `OrderCreateResponse`처럼 따로 안 만든다. 목록 조회도 별도 `OrderListResponse`를 만들지 않고 `docs/rule/api-response-convention.md`의 `Page<OrderResponse>`를 그대로 쓴다.
- **DTO 이름은 orval이 그대로 TS 타입명으로 생성한다:** `OrderCreateRequest`, `OrderResponse` 같은 이름이 web 쪽에서도 동일하게 보이므로 별도 매핑이 필요 없다.
