# TODO

결정 기록은 [docs/adr/](docs/adr/) 에 단계별로 있습니다 (ADR-001~004).

백엔드 착수 전에 정할 것들. **위에서부터 순서대로** — 아래 단계는 위 단계가 정해져야 쓸 수
있습니다.

컨벤션이 1단계와 4단계로 나뉜 이유: 표기·문서·git 규칙은 스택과 무관하고 오히려 도메인 문서를
쓰려면 먼저 있어야 합니다(용어사전을 채우려면 이름 붙이는 규칙이 이미 있어야 함). 반면 레이어
구조·API 규격·DB 물리 네이밍은 프레임워크와 DB가 정해져야 쓸 수 있습니다. 스택 없이 쓰면
나중에 다시 씁니다.

## 1. 컨벤션 — 스택과 무관한 것. 지금 바로

> 확정됐습니다. 규칙 전체는 [docs/convention/core.md](docs/convention/core.md).

- [x] **표기 규칙**: 업무용어(한글) ↔ 코드 식별자(영문) 변환 규칙, 축약어 허용 여부와 사전
- [x] 식별자 케이스 규칙 (엔티티 · 필드 · 상수 · 파일명)
- [x] 공통 값 표기: 날짜/시각 형식과 타임존, 금액·수량 자릿수, 코드값(enum) 표기 방식
- [x] PK 방식 (자동증가 / UUID) 과 공통 감사 컬럼 이름
- [x] 문서 규칙: 위치(`docs/`), 파일명, 다이어그램 도구
      → `docs/` 아래. 단일 문서는 바로, 늘어날 주제는 하위 폴더. 다이어그램은 Mermaid
- [x] git 규칙: 브랜치 전략, 커밋 메시지, PR 단위
- [ ] **GitHub `main` 브랜치 보호 켜기** — 직접 푸시 금지 + PR 필수.
      규칙은 정했지만([docs/convention/git.md](docs/convention/git.md) 3.1)
      설정을 켜야 실제로 강제됩니다
- [x] 원격 저장소 생성 → `master` 를 `main` 으로 → `dev` 분기.
      `origin` = `ch00kh/menscake-management-system`. `main` · `dev` 둘 다 원격에 있고
      로컬이 각각 추적합니다 ([docs/convention/git.md](docs/convention/git.md) 1.1)
- [x] 이전 설계 초안 검토 후 살릴 부분 결정 — 살릴 것을 현행 문서로 옮기고
      초안 원문은 지웠습니다. 판정표는 [docs/domain/scope.md](docs/domain/scope.md) 5장

## 2. 도메인 — 1단계 규칙을 적용해서 작성

> 범위와 순서는 [docs/domain/scope.md](docs/domain/scope.md) 에서 확정했습니다.
> 만들 것은 **쇼핑몰 운영팀의 주문 취합 시스템**이고, 도메인을 아래에서 위로 쌓습니다.

- [x] 만들 것 확정 — 쇼핑몰 주문 취합. 레이아웃 30종은 부품이자 지시 어휘
- [x] 도메인 순서 확정 — 사용자 → 상품 → 거래처 → 입고 → 판매채널 → 주문 → 출고 → 재고 → 기부·폐기
- [x] **1 사용자 · 권한** — [docs/domain/1-user.md](docs/domain/1-user.md).
      역할 기반 · 권한 한 줄 = (역할, 메뉴, 행위) · 역할 다중 배정 · 메뉴는 DB 마스터 ·
      로그인은 아이디. 용어사전 개시: [docs/domain/glossary.md](docs/domain/glossary.md)
- [x] **2 상품** — [docs/domain/2-product.md](docs/domain/2-product.md).
      3층(상품 → 옵션명·값 → 옵션조합) · 세트 구성품 · 카테고리 + 태그 ·
      코드는 비우면 자동. 재고/입고/주문이 참조하는 단위는 `product_variant`
- [x] **3 거래처** — [docs/domain/3-partner.md](docs/domain/3-partner.md).
      매입/매출 구분 지금 넣음 · 담당자 별도 테이블 · **담당자는 물리 삭제**
      (거래처 미사용 후 3년, 설정값). 컨벤션 4.3이 미뤄둔 개인정보 지정의 첫 대상
- [x] **4 입고** — [docs/domain/4-receiving.md](docs/domain/4-receiving.md).
      재고원장(append only) + 현재고 캐시 · 발주와 입고 둘 다 · 창고 테이블은 두되
      기본창고 하나 · 로트는 상품별 스위치. **재고 경계 닫힘** (8번은 조회·실사·조정)
- [x] **5 판매채널** — [docs/domain/5-channel.md](docs/domain/5-channel.md).
      판매처 한 줄 = 창구 하나 · 엑셀 열 매핑은 DB(화면 편집) · 채널 상품 매핑 +
      「상품 미확인」 소급 연결
- [x] **6 주문** — [docs/domain/6-order.md](docs/domain/6-order.md). **원래 목적.**
      상태 5개 + 취소는 별도 축 · 주문 단위 출고(라인은 `match_key` 로 보존) ·
      재import 컬럼 소유권 · 취소 감지 2규칙 · 낙관적 잠금 ·
      수령인 5종은 출고완료 후 5년 뒤 컬럼만 NULL
- [x] **7 출고 · 송장** — [docs/domain/7-shipping.md](docs/domain/7-shipping.md).
      출고 전표(합포장) · 재고 부족은 경고 후 허용 + 「재고 확인 필요」 ·
      송장은 엑셀 왕복(택배사 양식도 DB) · 세트는 여기서 구성품으로 전개
- [x] **8 재고** — [docs/domain/8-stock.md](docs/domain/8-stock.md).
      실사는 기준 시각 비교(출고를 멈추지 않음) · 조정은 사유 필수 · 안전재고로
      「발주 필요」. `source_type` 이 4개로 확장(실사/조정 분리)
- [x] **9 기부 · 폐기** — [docs/domain/9-disposal.md](docs/domain/9-disposal.md).
      기부와 폐기를 한 전표에 · 기부처는 거래처에 `DONATION` 구분값 ·
      장부가는 로트 매입가에서 자동(그 시점 값 고정) · 연말 기부 명세는 21번 리포트.
      판매채널에 넣는 안은 검토 후 기각(9-disposal.md 1장)

각 도메인은 같은 순서로 진행합니다: 용어사전 추가 → 개념 모델 → 화면(레이아웃 번호) → 구현.

- [x] **데이터 규모와 동시 사용자 수 추정** — [docs/sizing.md](docs/sizing.md).
      일 100~500건 · SKU 500~3,000 · 판매처 1~3 · 동시 1~2명.
      5년 870만 행 / 4.5 GB → **단일 DB로 충분.** 샤딩·캐시·검색엔진·잡큐 불필요

> **2단계 완료.** 도메인 9개 + 규모 추정이 모두 끝났습니다.


## 3. 기술 스택 — 2단계 요구에서 도출

> 확정됐습니다. 선택과 근거 전체는 [docs/stack.md](docs/stack.md).

- [x] 백엔드 — **Java 21 + Spring Boot 3**
- [x] DB — **PostgreSQL** / 마이그레이션 **Flyway**
- [x] 영속성 — **JPA(Hibernate) + QueryDSL**
- [x] 인증 — **세션 쿠키 + Spring Session JDBC.** JWT 아님
      (퇴사자 `active = false` 가 즉시 반영돼야 함 — stack.md 2.2)
- [x] 인가 — `@RequirePermission(menu, action)` 커스텀 애노테이션.
      권한 모델은 1번에서 확정됨(역할 기반)
- [x] API — **REST + springdoc-openapi** → `openapi-typescript` 로 프런트 타입 생성
- [x] 엑셀 — **Apache POI** (서버 파싱). SheetJS 배포 채널 우려도 같이 해소
- [x] 배치 — **Spring `@Scheduled`**. Spring Batch·ShedLock 불필요(서버 1대, 하루 3건).
      개인정보 파기 2건 + 안전재고 집계
- [x] 테스트 — **JUnit 5 + Testcontainers(Postgres)** / 프런트 vitest.
      확정 트랜잭션·재import 소유권·취소 감지는 진짜 DB 없이 검증 불가
- [x] 로컬 개발 환경 — docker compose 로 **Postgres만**. 앱은 IDE에서
- [x] 배포 — **사내 서버 2대** (개발 · 운영). nginx + spring-boot + postgres
- [ ] **사용자별 테마 저장** — `account` 테이블에 컬럼 두 개
      (`theme_palette` `'sugg' | 'chija' | 'baengnyeoncho'`, `theme_mode` `'light' | 'dark' | 'system'`).
      한 컬럼에 합치지 말 것. 근거와 동기화 방식은 [docs/design/theme.md](docs/design/theme.md) 6.2

### 3.1 사내 서버라서 팀이 책임지는 것

> 규칙이 정해졌습니다. 전체는 [docs/operations.md](docs/operations.md).
> **실행은 5단계**입니다.

- [x] 백업 — 하루 1회 · 암호화 후 **사내 NAS** · 일7/주4/월6 세대.
      하루치를 잃으면 주문은 재import로 돌아오지만 **운영 상태는 못 살립니다**
- [x] **복구 리허설** — 분기 1회, 개발 서버에 복원.
      복원 직후 **익명화 스크립트 필수** (개발 서버에 운영 개인정보가 들어감)
- [x] 접근 통제 — DB 계정 3분리(`app`/`migrator`/`ops_*`) · SSH 키 전용 ·
      5432 는 앱 서버에서만
- [x] 보안 패치 — 월 1회 정기 + 긴급 CVE 즉시. 개발 서버 먼저 → 1주 관찰 → 운영
- [x] 개인정보 접속기록 — **`access_log` 테이블 신규.** 화면·API 단위,
      조회된 값은 안 남김, 2년 보관, `app` 계정에 DELETE 권한 없음
- [ ] 모니터링·장애 알림 — 5단계에서 배포 파이프라인과 같이

**5단계에서 만들 것**

- [ ] 백업 스크립트 + **익명화 스크립트** (같이 관리할 것)
- [ ] `access_log` 테이블과 기록 인터셉터
- [ ] 만료 접속기록 삭제 크론 (`purger` 계정)
- [ ] 월 1회 사외 사본 절차 (NAS는 건물 사고에 같이 당함 — operations.md 1.3)

## 4. 컨벤션 — 스택에 종속된 것

> 확정됐습니다. 규칙 전체는 [docs/convention/stack.md](docs/convention/stack.md).

- [x] 패키지 구조 — **도메인별 + 유스케이스 계층.** `api → usecase → domain ← infra`,
      읽기는 `api → query`. `@Transactional` 은 유스케이스에만
- [x] API 규격 — **순수 REST + RFC 7807.** 공통 래퍼 없음 · 409(재시도 가능)와
      422(업무규칙) 분리 · 벌크는 200 + 부분성공 배열 · 금액은 문자열
- [x] DB 물리 네이밍 — **소문자 snake_case 단수형.** 용어사전이 정본이고
      Java/TS 는 camelCase 변환형
- [x] **예약어 2건은 개명으로 해결** — `user` → `account`, `order` → `sales_order`.
      회피가 아니라 이름 자체를 바꿨으므로 규칙의 예외가 아닙니다.
      덤으로 `purchase_order`(발주)와 대칭이 됐습니다
- [x] **코드값은 Postgres enum 대신 `varchar` + `CHECK`** — `source_type` 이 설계
      도중 3→4→5 로 늘었습니다. `ALTER TYPE` 은 값을 지울 수 없습니다
- [x] **부분 유니크 인덱스 3건** — SQL 은 convention/stack.md 3.6
      - `stock` — `lot_id` NULL 여부로 인덱스 둘
      - `stocktaking_line` — 같은 모양
      - `shipment_sales_order` — **`canceled` 컬럼을 새로 둡니다.** 취소 여부가
        다른 테이블에 있어 부분 인덱스가 참조할 수 없기 때문
        ([7-shipping.md](docs/domain/7-shipping.md) 2.3)
- [x] 마이그레이션 — **Flyway `V{yyyyMMddHHmm}__{설명}.sql`.** 롤백 없음,
      파괴적 변경은 2릴리스로 나눔, 적용된 파일 수정 금지
- [x] 프런트 타입 생성 — springdoc → `openapi.json` → `openapi-typescript`.
      **생성물을 커밋**하고 CI 에서 diff 나면 실패
- [x] 테스트 구조 — 단위(DB 없음) + 통합(Testcontainers Postgres). H2 금지.
      **필수 회귀 9건 목록**은 convention/stack.md 6.2
- [x] 린트 · 포맷 — Spotless + google-java-format(AOSP, 4칸) / 프런트는 기존 유지.
      pre-commit 훅 없이 빌드에서 검사

## 5. 착수

- [ ] `backend/` 스캐폴딩
- [ ] 수직 슬라이스 1개 — 화면 → API → DB 왕복 하나를 끝까지
- [ ] 테마 저장을 DB와 연결 — 로그인 후 `localStorage` 캐시와 동기화, DB가 진실 공급원

## 백엔드와 무관 — 언제든 가능

- [x] **송편 테마를 `index.css` 에 반영** — 팔레트 3종(A 쑥 기본 · B 치자 · E 백년초) +
      솔잎 다크 지반. 토큰 값은 [docs/design/theme.md](docs/design/theme.md) 3장
- [x] `theme-provider.tsx` 에 팔레트 축 추가 (`localStorage: "theme-palette"`)
- [x] `index.html` 에 첫 페인트 깜빡임 방지 인라인 스크립트 (같은 문서 6.1)
- [x] 헤더에 팔레트 선택 UI
