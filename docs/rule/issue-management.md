# Issue Management

## 이슈는 사람이 작성한다

작업 단위마다 에이전트가 이슈를 만들고 GitHub Projects 보드(`Backlog → Todo → In Progress → In Review → Done`)로 추적하던 방식은 폐지했다 — 실제로는 보드를 거의 안 봤고, 에이전트의 이슈 생성 자체가 병목으로 느껴졌다. 보드는 삭제했다.

대신 이슈는 **사람이 직접 작성**해서 에이전트에게 작업을 맡기는 창구로 쓴다. 에이전트는 이슈를 생성하지 않는다 — 메인 세션이 열린 이슈를 확인하고 서브에이전트로 처리한다 (`docs/rule/agent-collaboration.md`의 "작업 할당" 참조).

새 기능처럼 브레인스토밍이 필요한 개발은 이슈 유무와 무관하게 `docs/rule/agent-collaboration.md`의 "기능 개발 흐름"(스펙 문서 SSOT)을 따른다.

## 이슈 템플릿

`.github/ISSUE_TEMPLATE/task.yml` 사용. 필수 항목: type/scope, 배경/목적, 요구사항, 완료 조건(Acceptance Criteria).

## 라벨 체계

- **type**: git 커밋 type과 동일 — `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `ci`, `style`, `revert`
- **scope**: `web`, `api`

## 이슈 ↔ 코드 연결

- 사람이 작성한 이슈에서 시작하는 작업이면 브랜치명에 이슈 번호를 포함해도 된다: `<type>/<scope>-<issue번호>-<description>` (예: `feat/api-42-refund-flow`)
- PR 본문에 `Closes #42`를 남긴다.
