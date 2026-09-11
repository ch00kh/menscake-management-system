# TBD (미정 항목 모음)

컨벤션 문서 전체에 걸쳐 "지금은 정하지 않는다"고 명시적으로 미룬 항목들을 한곳에 모은 목록이다. 각 항목은 트리거 조건이 되면 그때 다시 논의하고, 해당 컨벤션 문서를 갱신한다.

| 항목 | 왜 미정인가 | 다시 논의할 시점(트리거) | 관련 문서 |
|---|---|---|---|
| PWA 플러그인 구체 라이브러리/버전 | 후보(`vite-plugin-pwa` 등)는 있지만 아직 확정 안 함. 실제 작업하면서 정하기로 함 | 스캐폴딩/작업 중 자연스럽게 | `docs/rule/tech-stack.md` |
| orval 버전 pin + 생성 스크립트 이름 | 스캐폴딩 전에는 버전 핀이 의미 없음 | 모노레포 스캐폴딩 시작 시 | `docs/rule/repo-structure.md`, `docs/rule/tech-stack.md` |
| ESLint/ktlint 세부 규칙셋(특정 config 프리셋 채택 여부) | 실제 코드가 없어 규칙 강도를 가늠하기 이름 | 모노레포 스캐폴딩 시작 시 | `docs/rule/code-style-convention.md` |
| 시크릿 공유 도구 (1Password/Bitwarden 등) | 현재 규모에서는 별도 도구 없이 직접 전달 중 | 팀원이 늘어날 때 | `docs/rule/env-secrets-convention.md` |
| 로그 수집 스택 (Grafana Loki 등) | 현재는 `docker logs`로 충분한 규모 | 서비스가 늘거나 로그 검색이 자주 필요해질 때 | `docs/rule/logging-timezone-convention.md` |
| 오프라인 지원 (PWA) | 기본값은 "오프라인 미지원"으로 확정(`docs/rule/tech-stack.md` 인증 전략 참조) — 인증된 API 호출이 오프라인에서 원천적으로 불가능해서, 지금은 오프라인 캐싱 자체를 만들지 않기로 함. 실제 지원하려면 로컬 캐싱/큐잉 전략을 별도 설계해야 함 | 오프라인 사용 요구사항이 실제로 나올 때 — 이 기본 정책 자체를 재검토 | `docs/rule/tech-stack.md` |
| Todo → In Progress 자동화 (이슈 assign/브랜치 생성 시) | GitHub Projects 내장 workflow에 이 트리거 자체가 없다 (`Item added`/`Item closed`/`Pull request merged`/`Pull request linked to issue`만 있음). 지금은 이 전환만 수동으로 옮긴다 | CI 워크플로우(GitHub Actions)를 실제로 만들 때, Projects API를 호출하는 커스텀 자동화 스크립트 추가를 함께 검토 | `docs/rule/issue-management.md` |
| `main`/`dev` 브랜치 보호의 `enforce_admins` 예외 (관리자는 승인/CI 없이 머지 가능) | 관리자가 1명뿐이라 "본인 PR 자기 승인 금지"라는 GitHub 제약 때문에 켜두면 아무도 머지 못 함 | 관리자 외 협업자(팀원)가 생길 때 — `enforce_admins`를 다시 켜서 관리자 PR도 남이 승인하게 되돌림 | `docs/rule/git-convention.md` |
