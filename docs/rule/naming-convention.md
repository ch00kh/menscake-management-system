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

## 근거

- **web 일반 파일은 camelCase:** Vite는 파일 기반 라우팅이 없어 폴더명=URL 제약이 없다. 파일명을 export하는 심볼 이름과 그대로 맞춰(`useOrderList` → `useOrderList.ts`) IDE 자동완성·자동 import·리팩토링 시 이름이 항상 일치하게 한다. (kebab-case는 주로 Angular CLI, Next.js app router처럼 파일명이 곧 경로가 되는 프레임워크에서 강제되는 관례이며 이 스택엔 해당 없음)
- **DB는 snake_case:** Hibernate(Spring Boot 기본 물리 네이밍 전략)가 Kotlin의 camelCase 필드를 자동으로 snake_case 컬럼명으로 변환해준다. 별도 매핑 어노테이션 없이 관례를 따르면 된다.
- **응답 DTO는 액션별로 나누지 않고 `<Resource>Response` 하나를 재사용한다:** 생성/조회/수정 결과가 반환하는 리소스 모양은 어차피 같기 때문에 `OrderCreateResponse`처럼 따로 안 만든다. 목록 조회도 별도 `OrderListResponse`를 만들지 않고 `docs/rule/api-response-convention.md`의 `Page<OrderResponse>`를 그대로 쓴다.
- **DTO 이름은 orval이 그대로 TS 타입명으로 생성한다:** `OrderCreateRequest`, `OrderResponse` 같은 이름이 web 쪽에서도 동일하게 보이므로 별도 매핑이 필요 없다.
