# Issue Management

## 변경 이력

작업 단위마다 GitHub Issue를 만들고 GitHub Projects 보드(`Backlog → Todo → In Progress → In Review → Done`)로 추적하던 방식은 폐지했다 — 실제로는 보드를 거의 안 봤고, 이슈 생성 자체가 병목으로 느껴졌다. 지금은 `docs/rule/agent-collaboration.md`의 "작업 할당 (SSOT)"대로 스펙 문서(`docs/spec/<도메인>/`) + 사람의 직접 테스트로 대체한다. 보드는 삭제했다.

## 라벨 체계 (PR에 선택적으로 사용)

이슈를 안 만들어도 라벨 자체는 PR에 붙여 스코프/성격을 빠르게 훑어볼 때 여전히 쓸 수 있다. 필수는 아니다.

- **type**: git 커밋 type과 동일 — `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `ci`, `style`, `revert`
- **scope**: `web`, `api`
