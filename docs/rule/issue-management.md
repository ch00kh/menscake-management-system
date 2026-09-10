# Issue Management

## 보드 구조 (GitHub Projects)

컬럼: `Backlog → Todo → In Progress → In Review → Done`

- Todo → In Progress: assign되거나 브랜치 생성 시 자동
- In Progress → In Review: PR이 열리면 자동
- In Review → Done: PR이 머지(=이슈 close)되면 자동
- GitHub Projects 내장 워크플로우 기능으로 설정한다.

## 라벨 체계

- **type**: git 커밋 type과 동일 — `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `ci`, `style`, `revert` 
- **scope**: `web`, `api`
- **blocked**: 에이전트가 요구사항이 모호해서 이슈에 질문을 남기고 대기 중일 때 붙인다. ([[agent-collaboration]]의 "가정 절대 금지" 규칙과 연결)

## 이슈 템플릿 필수 항목

- 배경/목적
- 요구사항
- 완료 조건 (Acceptance Criteria)
- 관련 이슈 (있다면)

## 이슈 ↔ 코드 연결

- 브랜치명에 이슈 번호를 포함한다: `<type>/<scope>-<issue번호>-<description>` (예: `feat/api-42-refund-flow`)
- PR 본문에 `Closes #42`를 남긴다. (`docs/rule/agent-collaboration.md`에 이미 명시된 규칙)

