# 컨벤션 — 스택 종속

[TODO.md](../TODO.md) 4단계. 스택이 정해져야 쓸 수 있는 규칙입니다
([stack.md](stack.md): Java 21 · Spring Boot 3 · PostgreSQL · JPA + QueryDSL · Gradle).

스택과 **무관한** 규칙은 [convention.md](convention.md)에 있고 그대로 유효합니다.
표기 · 케이스 · 값 표기 · 감사 컬럼 · 문서 · git.

---

## 1. 패키지 구조

**DDD와 클린 아키텍처를 가볍게.** 컨트롤러와 서비스 사이에 **유스케이스**를 둡니다.

```
com.n2soft.erp
├─ common/
│   ├─ audit/       감사 컬럼 자동 채움
│   ├─ error/       예외 → Problem Details
│   ├─ page/        페이징 규격
│   └─ security/    인증 · @RequirePermission
│
└─ salesorder/                   ← 도메인 하나. 문서 9개와 1:1
    ├─ api/         Controller + Request/Response
    ├─ usecase/     쓰기. 트랜잭션 경계
    ├─ query/       읽기 전용. QueryDSL
    ├─ domain/      엔티티 · 도메인 서비스 · Repository 인터페이스
    └─ infra/       JPA Repository 구현
```

도메인 패키지는 소문자 한 단어입니다 — `account` `product` `partner` `receiving`
`channel` `salesorder` `shipping` `stock` `disposal`.

### 1.1 의존 방향

```
api ──→ usecase ──→ domain ←── infra
 └────→ query ─────────┘
```

- **`domain`은 다른 층을 모릅니다.** Repository **인터페이스**가 `domain`에 있고
  구현이 `infra`에 있습니다. 클린 아키텍처에서 **이 의존성 역전 하나만** 지킵니다
- `api`는 `usecase`와 `query`만 부릅니다. `infra`를 직접 부르지 않습니다
- `infra`는 아무도 부르지 않습니다. 스프링이 주입할 뿐입니다

### 1.2 유스케이스가 왜 필요한가

우리 설계에서 **확정 한 번이 테이블 4~5개를 바꿉니다.**

```
출고 확정   원장(세트 전개) + 현재고 + 주문 상태 + 전표
입고 확정   원장 + 현재고 + 발주라인 + 발주 상태
재import   주문 + 라인 + 이력 + 배치 + 취소 감지
```

이걸 서비스에 넣으면 서비스가 비대해지고 **트랜잭션 경계가 어디인지 흐려집니다.**
유스케이스가 그 경계를 이름으로 만듭니다.

```
ConfirmShipmentUseCase
ConfirmReceivingUseCase
ImportSalesOrdersUseCase
PurgeReceiverInfoUseCase
```

규칙 셋.

- **유스케이스 하나 = 동사 하나.** public 메서드는 `execute` 하나
- **`@Transactional`은 유스케이스에만.** 서비스·리포지토리에 붙이지 않습니다
- 이름은 `동사 + 명사 + UseCase`

### 1.3 읽기는 유스케이스를 거치지 않습니다

목록 조회까지 유스케이스로 만들면 **껍데기 클래스만 늘어납니다.** 읽기는
`query`가 직접 받습니다.

```
쓰기   api → usecase → domain/infra     트랜잭션 있음
읽기   api → query                       읽기 전용
```

`query`는 QueryDSL로 DTO를 바로 만들어 돌려줍니다. 엔티티를 반환하지 않습니다 —
지연 로딩이 컨트롤러까지 새어 나가면 N+1이 화면에서 터집니다.

### 1.4 가볍게 간 것 — 타협을 적어둡니다

**엔티티에 JPA 애노테이션을 붙입니다.** 순수 도메인 객체와 영속 객체를 분리하는 건
정석이지만 매핑 클래스가 두 배가 됩니다. 5명이 쓰는 시스템에는 과합니다.

바꾸고 싶어지는 시점은 **도메인 로직이 JPA 때문에 뒤틀리기 시작할 때**입니다.
그때 분리합니다.

### 1.5 도메인 간 참조

- 다른 도메인의 **`domain` 공개 인터페이스**만 부릅니다. `usecase` · `infra` · `api`는
  건드리지 않습니다
- **순환 참조 금지.** 서로 필요하면 한쪽을 `common`으로 올리거나 이벤트로 끊습니다
- 조회만 필요하면 그 도메인이 `domain`에 조회 인터페이스를 노출합니다

---

## 2. API 규격

### 2.1 URL과 성공 응답

```
/api/sales-orders          kebab-case 복수형
/api/purchase-orders
/api/product-variants
```

성공은 **데이터를 그대로** 내려줍니다. 공통 래퍼가 없습니다 — OpenAPI에서 생성한
프런트 타입을 매번 벗겨내는 코드가 생기지 않게 하려는 것입니다.

### 2.2 실패는 RFC 7807

Spring Boot 3에 내장된 `application/problem+json`을 씁니다.

```json
{
  "type": "https://erp.n2soft/errors/optimistic-lock",
  "title": "다른 사람이 먼저 바꿨습니다",
  "status": 409,
  "detail": "주문 SO-2026-0841 이 이미 변경되었습니다",
  "instance": "/api/sales-orders/12345",
  "code": "OPTIMISTIC_LOCK"
}
```

`code`는 표준 밖 확장입니다. 프런트가 **문구가 아니라 코드로 분기**해야 하기
때문입니다.

| 상태 | 언제 |
|---|---|
| 400 | 형식 · 필수값 · 타입 |
| 401 | 로그인 안 됨 |
| 403 | 권한 없음 (`@RequirePermission` 불통과) |
| 404 | 대상 없음 |
| **409** | 낙관적 잠금 충돌 · 유니크 위반 |
| **422** | 업무 규칙 위반 |

**409와 422를 나눈 이유**는 프런트가 다르게 반응해야 하기 때문입니다.
409는 "다시 불러와서 재시도", 422는 "이 요청은 다시 해도 안 됨"입니다.

422의 예 — 취소된 주문을 출고하려 함, 상품 미확인 라인이 남아 있음,
`ADMIN` 활성 사용자를 0명으로 만들려 함.

### 2.3 벌크는 부분 성공을 그대로 내려줍니다

6번에서 정한 규칙([6-order.md](domain/6-order.md) 6장)의 표현입니다.

```json
{
  "results": [
    { "id": 1, "ok": true },
    { "id": 2, "ok": false, "code": "OPTIMISTIC_LOCK" }
  ]
}
```

**상태코드는 200입니다.** 전체가 실패한 게 아니기 때문입니다. 화면은 실패한 행만
다시 시도하게 합니다.

### 2.4 페이지네이션

```
GET /api/sales-orders?page=0&size=50&sort=ordered_at,desc
```

```json
{ "content": [], "page": 0, "size": 50, "totalElements": 912500, "totalPages": 18250 }
```

- offset 기반. 커서는 안 씁니다 — 실무 조회가 최근 30일이라 깊은 페이지가 없습니다
  ([sizing.md](sizing.md) 4.2)
- `size` 상한 **200**. 넘으면 400
- 대량 내보내기는 페이징이 아니라 **스트리밍**입니다

### 2.5 값 표기

| | |
|---|---|
| 시각 | ISO 8601 UTC — `2026-09-04T05:30:00Z`. 프런트가 KST 변환 |
| 날짜 | `2026-09-04` |
| 금액 · 수량 | **문자열** — `"12637350.00"` |
| 코드값 | 저장값 그대로 — `"SHIPPED"`. 표시명은 프런트 매핑 |
| 없는 값 | 필드를 생략하지 않고 `null` 명시 |

**금액을 문자열로 내리는 이유**는 [convention.md](convention.md) 3.2입니다. JSON
숫자로 내리면 JavaScript가 `number`로 받아 정밀도를 잃습니다.

**필드를 생략하지 않는 이유**는 생성된 타입이 전부 옵셔널이 되어 쓸모없어지기
때문입니다.

---

## 3. DB 물리 네이밍

### 3.1 소문자 snake_case

**용어사전이 정본입니다** ([domain/glossary.md](domain/glossary.md)). 거기 등록된
이름이 그대로 테이블·컬럼명입니다.

```
sales_order_line      테이블. 단수형
receiver_purged_at    컬럼
```

Java 필드와 TypeScript 속성은 이걸 camelCase로 바꾼 것입니다. 변환이 기계적이라
사전에 따로 적지 않습니다.

```
sales_order_no  ↔  salesOrderNo
```

### 3.2 예약어 두 개는 회피가 아니라 개명했습니다

`user`와 `order`는 Postgres 예약어라 따옴표 없이 못 씁니다. 따옴표로 감싸거나
`tb_` 접두를 붙이는 대신 **이름 자체를 바꿨습니다.**

```
사용자   user   →  account
주문     order  →  sales_order
```

**회피가 아니라 개명이므로 규칙의 예외가 아닙니다.** 사전에도 그 이름으로 등록돼
있습니다.

덤이 하나 있습니다 — `purchase_order`(발주)와 `sales_order`(주문)가 대칭이 되어
매입/판매가 이름에서 바로 읽힙니다.

### 3.3 키와 인덱스 명명

```
pk_{table}
fk_{table}__{참조테이블}
ux_{table}__{컬럼}_{컬럼}
ix_{table}__{컬럼}_{컬럼}
ck_{table}__{규칙}
```

테이블과 컬럼 사이는 밑줄 **둘**입니다. 컬럼명 자체에 밑줄이 있어서 하나로는
경계가 안 보입니다.

### 3.4 코드값은 Postgres enum 타입을 쓰지 않습니다

**`varchar` + `CHECK` 제약**으로 갑니다.

```sql
source_type varchar(20) not null
  constraint ck_stock_ledger__source_type
  check (source_type in ('RECEIVING','SHIPPING','STOCKTAKING','ADJUSTMENT','DISPOSAL'))
```

이유는 **값이 실제로 늘었기 때문**입니다. `source_type`은 설계 도중 셋에서 넷,
다섯이 됐습니다. Postgres `ALTER TYPE ... ADD VALUE`는 제약이 많고 **값을 지울 수
없습니다.** `CHECK`는 제약을 바꿔 다시 걸면 끝입니다.

JPA `@Enumerated(EnumType.STRING)`과도 그대로 맞습니다.

### 3.5 타입 매핑

| 논리 | Postgres |
|---|---|
| 시각 | `timestamptz` |
| 날짜 | `date` |
| 금액 | `numeric(18,2)` |
| 수량 | `numeric(18,3)` |
| 비율 | `numeric(5,2)` |
| 불리언 | `boolean` |
| 채널 원본 | `jsonb` |
| PK · FK | `bigint` |

### 3.6 부분 유니크 인덱스 3건

Postgres는 `WHERE` 절이 붙은 유니크 인덱스를 지원합니다.

**(1) 현재고** — `lot_id`가 NULL일 수 있습니다.

```sql
create unique index ux_stock__with_lot
  on stock (variant_id, warehouse_id, lot_id) where lot_id is not null;
create unique index ux_stock__no_lot
  on stock (variant_id, warehouse_id) where lot_id is null;
```

NULL은 서로 다른 값으로 취급되므로 하나로는 막지 못합니다. 둘로 나눕니다.

**(2) 실사라인** — 같은 이유로 같은 모양입니다.

```sql
create unique index ux_stocktaking_line__with_lot
  on stocktaking_line (stocktaking_id, variant_id, lot_id) where lot_id is not null;
create unique index ux_stocktaking_line__no_lot
  on stocktaking_line (stocktaking_id, variant_id) where lot_id is null;
```

**(3) 출고-주문** — 여기서 문제가 하나 나왔습니다.

"취소되지 않은 출고에 한해 주문은 하나"인데, **`status`는 `shipment`에 있고
유니크는 `shipment_sales_order`에 걸어야 합니다.** 부분 인덱스는 다른 테이블을
참조할 수 없습니다.

그래서 **`shipment_sales_order`에 `canceled boolean` 컬럼을 둡니다.** 출고를
취소할 때 같이 세웁니다.

```sql
create unique index ux_shipment_sales_order__active
  on shipment_sales_order (sales_order_id) where canceled = false;
```

의도적인 중복입니다. 애플리케이션 검사만으로는 **두 사람이 동시에 누르면 뚫리기**
때문에, DB가 막게 하려면 이 컬럼이 필요합니다.

---

## 4. 마이그레이션 — Flyway

### 4.1 파일명

```
V{yyyyMMddHHmm}__{snake_case_설명}.sql

V202609041530__create_account_and_role.sql
V202609041612__add_use_lot_to_product.sql
```

**타임스탬프 버전**을 쓰는 이유는 두 사람이 같은 날 만들어도 번호가 겹치지 않기
때문입니다. 순번(`V1`, `V2`)은 반드시 충돌합니다.

`R__` (repeatable)은 뷰와 함수에만 씁니다.

### 4.2 롤백은 없습니다

Flyway Community에는 undo가 없습니다. **앞으로만 갑니다.**

파괴적 변경은 **두 릴리스에 나눠** 합니다.

```
릴리스 1   새 컬럼 추가 + 양쪽에 쓰기 + 기존 데이터 백필
릴리스 2   옛 컬럼 DROP
```

한 번에 하면 롤백할 방법이 없습니다. 두 단계로 나누면 릴리스 1에서 문제가 나도
애플리케이션만 되돌리면 됩니다.

### 4.3 적용된 파일은 수정 금지

Flyway가 체크섬을 봅니다. 이미 운영에 적용된 파일을 고치면 **다음 배포가 멈춥니다.**
잘못됐으면 **새 마이그레이션으로 고칩니다.**

### 4.4 실행 계정과 시드

- **`migrator` 계정으로만** 실행합니다 ([operations.md](operations.md) 3.1)
- 시드도 마이그레이션입니다 — `ADMIN` 역할 · 초기 관리자 계정 · 기본창고 ·
  메뉴 트리 초기값
- **테스트도 같은 마이그레이션을 태웁니다.** 별도 스키마 스크립트를 만들지
  않습니다 — 그러면 마이그레이션 자체가 검증되지 않습니다

---

## 5. 프런트 타입 생성

```
백엔드 빌드   springdoc → build/openapi.json
프런트        npm run gen:api → src/api/schema.d.ts
```

- **생성물을 커밋합니다.** 백엔드를 띄우지 않고도 프런트를 빌드할 수 있어야 합니다
- CI에서 다시 생성해 **diff가 있으면 실패**시킵니다. 안 하면 금방 어긋납니다
- 손으로 고치지 않습니다. 고쳐야 하면 컨트롤러 시그니처를 고칩니다

---

## 6. 테스트

### 6.1 두 층

| | 대상 | DB |
|---|---|---|
| 단위 | 도메인 로직 · 계산 | 없음 |
| 통합 | 유스케이스 | **Testcontainers Postgres** |

**인메모리 DB(H2)를 쓰지 않습니다.** 부분 유니크 인덱스 · `jsonb` · `timestamptz` ·
`CHECK` 제약이 전부 Postgres 고유 동작입니다. H2에서 통과한 테스트는 아무것도
증명하지 못합니다.

컨테이너 재사용을 켭니다 (`testcontainers.reuse.enable=true`). 안 켜면 실행마다
컨테이너가 새로 뜹니다.

### 6.2 반드시 있어야 하는 회귀 테스트

**여기가 틀리면 조용히 틀립니다.** 화면에는 아무 일도 없어 보입니다.

| # | 무엇 | 근거 |
|---|---|---|
| 1 | 취소 감지는 `canceled_at IS NULL`일 때만 발화 — 재import 2회에 값이 안 바뀜 | [6-order.md](domain/6-order.md) 5.1 |
| 2 | 재import가 `status` · `assignee_id` · `memo`를 보존 | 6-order 4.1 |
| 3 | `receiver_purged_at`이 있으면 수령인을 덮어쓰지 않음 | 6-order 4.2 |
| 4 | 벌크 20건 중 3건 stale → 17건 반영 + 3건 실패 목록 | 6-order 6장 |
| 5 | 실사 중 출고가 있어도 기준 시각 차이 계산이 맞음 | [8-stock.md](domain/8-stock.md) 2.1 |
| 6 | 세트 출고가 구성품으로 전개돼 차감됨 | [7-shipping.md](domain/7-shipping.md) 3.1 |
| 7 | 부분 유니크 3건이 실제로 막음 | 3.6 |
| 8 | 발주 상태가 `ORDERED → PARTIAL → COMPLETED`로 자동 전이 | [4-receiving.md](domain/4-receiving.md) 3.3 |
| 9 | `ADMIN` 활성 사용자를 0명으로 만들 수 없음 | [1-user.md](domain/1-user.md) 2.2 |

프런트는 vitest입니다. 현재 0건입니다.

---

## 7. 린트 · 포맷

| | |
|---|---|
| Java | **Spotless + google-java-format (AOSP)** — 4칸 들여쓰기 |
| 줄 길이 | 120 |
| import | 정렬 + 미사용 제거 |
| 프런트 | 기존 ESLint + Prettier 유지 |

AOSP 변형을 쓰는 이유는 기본 google-java-format의 2칸이 국내 관례와 멀고, 한글
주석이 섞이면 들여쓰기가 눈에 안 들어오기 때문입니다.

**검사는 빌드에서 합니다** — `gradle spotlessCheck`, `npm run lint`.
pre-commit 훅은 두지 않습니다. 우회가 쉽고, **진실은 CI에 있어야** 합니다.

---

## 8. 다음

[TODO.md](../TODO.md) 5단계 **착수**. `backend/` 스캐폴딩과 수직 슬라이스 하나입니다.
