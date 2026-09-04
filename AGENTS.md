# AGENTS.md

이 저장소에서 작업하는 에이전트를 위한 안내입니다. **먼저 읽고 시작하세요.**

프로젝트가 무엇인지는 [README.md](README.md)에 있습니다.

---

## 1. 먼저 지킬 것 세 가지

### 1.1 커밋·푸시는 사람이 승인합니다

```
승인 없이 하지 않음   커밋 · 푸시 · 병합 · 리베이스 · 태그 · PR 생성/병합 · 브랜치 생성/삭제
                     reset --hard · checkout -- · stash drop
승인 없이 해도 됨     파일 수정 · status · diff · log · fetch · 커밋 메시지 초안
```

작업 트리는 자유롭게 고치되 **커밋하지 않고 멈춰서 보고**합니다.
"커밋해줘" 같은 명시적 지시가 승인이고, **한 번 승인이 다음 번으로 이어지지 않습니다.**

전체 규칙: [docs/convention/git.md](docs/convention/git.md) 4장.

### 1.2 이름은 사전에서 가져옵니다

업무용어(한글) ↔ 식별자(영문)는 [docs/domain/glossary.md](docs/domain/glossary.md)에
**1:1로 등록**돼 있습니다. 번역하지 말고 조회하세요.

**사전에 없는 용어는 코드에 쓰기 전에 사전에 먼저 추가합니다.**

표기 정본은 `snake_case` 이고 Java/TypeScript 는 그 camelCase 변환형입니다
(`sales_order_no` ↔ `salesOrderNo`).

### 1.3 화면은 레이아웃 번호로 지시합니다

```
"상품 관리 만들어줘. 레이아웃 1번으로."
```

`frontend/src/layouts/registry.ts` 의 30종이 **부품이자 공용 어휘**입니다.
번호는 불변이고 재사용·재배치하지 않습니다. 목록은 `/gallery`.

---

## 2. 어떤 문서를 언제 보나


| 상황                  | 문서                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| 왜 이렇게 정했는지 알고 싶다    | [docs/adr/](docs/adr/)                                                                                  |
| 무엇을 만드는지 알고 싶다      | [docs/domain/scope.md](docs/domain/scope.md)                                                            |
| 특정 도메인의 모델·화면이 필요하다 | [docs/domain/](docs/domain/)                                                                            |
| 이름을 붙여야 한다          | [docs/domain/glossary.md](docs/domain/glossary.md) · [docs/convention/core.md](docs/convention/core.md) |
| 코드를 쓴다              | [docs/convention/stack.md](docs/convention/stack.md)                                                    |
| 브랜치를 따거나 커밋한다       | [docs/convention/git.md](docs/convention/git.md)                                                        |
| 기술 선택의 이유가 궁금하다     | [docs/stack.md](docs/stack.md)                                                                          |
| 규모·성능 판단이 필요하다      | [docs/sizing.md](docs/sizing.md)                                                                        |
| 서버·백업·개인정보를 다룬다     | [docs/operations.md](docs/operations.md)                                                                |
| 다음에 뭘 하는지           | [TODO.md](TODO.md)                                                                                      |


### 2.1 결정 기록 (ADR)

TODO 단계와 1:1 입니다. **결정과 기각한 대안**만 모여 있습니다.


| #                                     | 다루는 것                        |
| ------------------------------------- | ---------------------------- |
| [ADR-001](docs/adr/ADR-001-기반.md)     | 표기 · 값 · 식별자 · git · 테마      |
| [ADR-002](docs/adr/ADR-002-도메인.md)    | 9개 도메인의 모델과 규칙 19건           |
| [ADR-003](docs/adr/ADR-003-기술스택.md)   | 규모 · 백엔드 · DB · 인증 · 배포 · 운영 |
| [ADR-004](docs/adr/ADR-004-스택-컨벤션.md) | 패키지 · API · 물리 네이밍 · 테스트     |


**결정을 뒤집기 전에 해당 ADR의 "검토한 대안"을 읽으세요.** 이미 기각한 안을 다시
제안하지 않기 위한 것입니다.

### 2.2 도메인 9개

아래에서 위로 쌓습니다. 앞 도메인이 있어야 뒤가 성립합니다.

```
1 사용자·권한 → 2 상품 → 3 거래처 → 4 입고
              → 5 판매채널 → 6 주문 → 7 출고·송장 → 8 재고 → 9 기부·폐기
```

[1](docs/domain/1-user.md) · [2](docs/domain/2-product.md) ·
[3](docs/domain/3-partner.md) · [4](docs/domain/4-receiving.md) ·
[5](docs/domain/5-channel.md) · [6](docs/domain/6-order.md) ·
[7](docs/domain/7-shipping.md) · [8](docs/domain/8-stock.md) ·
[9](docs/domain/9-disposal.md)

**6번 주문이 원래 목적**이고 나머지는 그걸 세우기 위한 토대입니다.

---

## 3. 스택

```
frontend   Vite · React 19 · TypeScript · Tailwind v4 · shadcn/ui (base-nova, Base UI)
backend    Java 21 · Spring Boot 3 · PostgreSQL · JPA + QueryDSL · Flyway · Gradle
배포        사내 서버 2대 (dev / main) · nginx + spring-boot + postgres
```

패키지는 **도메인별**이고 컨트롤러와 서비스 사이에 **유스케이스**가 있습니다.

```
api ──→ usecase ──→ domain ←── infra
 └────→ query ─────────┘
```

`@Transactional` 은 유스케이스에만 붙입니다. 자세한 건
[docs/convention/stack.md](docs/convention/stack.md) 1장.

---

## 4. 자주 틀리는 지점

설계에서 의도적으로 정한 것들입니다. **바꾸기 전에 근거를 확인하세요.**


|         | 규칙                                                        | 근거                                        |
| ------- | --------------------------------------------------------- | ----------------------------------------- |
| 재고      | 원장(`stock_ledger`)이 진실, `stock` 은 캐시. 사람이 캐시를 손으로 고치지 않는다 | [ADR-002](docs/adr/ADR-002-도메인.md) 2.7    |
| 전표      | 확정된 전표는 수정하지 않는다. 취소는 **반대 부호 행**                         | 2.8                                       |
| 취소      | 주문 상태가 아니라 별도 축(`canceled_at`)                            | 2.14                                      |
| 재import | 운영 소유 컬럼(`status` `assignee_id` `memo`)은 덮어쓰지 않는다         | 2.15                                      |
| 개인정보    | 파기된 수령인을 재import 가 되살리지 않는다. 이력·로그에도 안 남긴다                | 2.13                                      |
| 현장      | 발주 초과·재고 부족을 **막지 않는다.** 경고만 한다                           | 2.22                                      |
| 인증      | 세션 쿠키. JWT 아님 — 퇴사자가 즉시 막혀야 한다                            | [ADR-003](docs/adr/ADR-003-기술스택.md) 3.4   |
| 테스트     | 통합 테스트는 Testcontainers. **H2 금지**                         | [ADR-004](docs/adr/ADR-004-스택-컨벤션.md) 4.7 |
| API     | 공통 래퍼 없음. 실패는 RFC 7807                                    | 4.4                                       |
| 코드값     | Postgres enum 이 아니라 `varchar` + `CHECK`                   | 4.5                                       |


**필수 회귀 테스트 9건**이 [docs/convention/stack.md](docs/convention/stack.md) 6.2에
있습니다. 전부 "틀려도 화면에는 아무 일도 없어 보이는" 것들입니다.

---

## 5. 명령

```bash
cd frontend
npm run dev          # 개발 서버
npm run typecheck    # 타입 검사
npm run lint         # ESLint
npm run build        # 타입 검사 + 빌드
```

백엔드는 아직 없습니다 ([TODO.md](TODO.md) 5단계).

---

## 6. 문서를 고칠 때

- 결정을 바꿨으면 **해당 ADR 항목에 `대체됨`을 달고** 새 결정을 아래에 붙입니다.
지우지 않습니다
- 규칙을 바꿀 때는 **이유를 같이 적습니다.** 무엇을 정했는지만 남으면 6개월 뒤에
뒤집어도 되는지 알 수 없습니다
- 새 용어를 만들었으면 [glossary.md](docs/domain/glossary.md)에 등록합니다

