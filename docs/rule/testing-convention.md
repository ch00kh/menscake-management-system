# Testing Convention

## 필수 대상

- **api**: `service`/`domain` 계층 중 상태 전이·계산·검증 로직이 있는 코드 (예: 주문 상태 전이, 재고 차감, 환불 금액 계산). 단순 위임만 하는 controller, 단순 CRUD repository는 제외한다.
- **web**: 복잡한 로직이 든 hook/util (예: 폼 검증 조합, 파생 상태 계산). 단순 렌더링 컴포넌트, 단순 API 호출 wrapper는 제외한다.

## 판단이 애매할 때

- "이게 핵심 로직인가?"가 애매하면 `docs/rule/agent-collaboration.md`의 "가정 절대 금지" 규칙을 그대로 적용한다. 넘겨짚지 않고 이슈에 질문을 남기고 결정을 기다린다.

## 강제 방식

- 커버리지 % 임계치는 강제하지 않는다. 초기 단계는 속도를 우선한다.
- PR 리뷰어가 "핵심 로직에 테스트가 빠졌다"고 판단하면 리뷰에서 반려할 수 있다.

## 도구

- web: Vitest + React Testing Library
- api: JUnit5 + MockK + Testcontainers

(`docs/rule/tech-stack.md` 참조)
