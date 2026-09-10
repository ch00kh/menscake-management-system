# TBD (미정 항목 모음)

컨벤션 문서 전체에 걸쳐 "지금은 정하지 않는다"고 명시적으로 미룬 항목들을 한곳에 모은 목록이다. 각 항목은 트리거 조건이 되면 그때 다시 논의하고, 해당 컨벤션 문서를 갱신한다.

| 항목 | 왜 미정인가 | 다시 논의할 시점(트리거) | 관련 문서 |
|---|---|---|---|
| PWA 플러그인 구체 라이브러리/버전 | 후보(`vite-plugin-pwa` 등)는 있지만 아직 확정 안 함. 실제 작업하면서 정하기로 함 | 스캐폴딩/작업 중 자연스럽게 | `docs/rule/tech-stack.md` |
| orval 버전 pin + 생성 스크립트 이름 | 스캐폴딩 전에는 버전 핀이 의미 없음 | 모노레포 스캐폴딩 시작 시 | `docs/rule/repo-structure.md`, `docs/rule/tech-stack.md` |
| ESLint/ktlint 세부 규칙셋(특정 config 프리셋 채택 여부) | 실제 코드가 없어 규칙 강도를 가늠하기 이름 | 모노레포 스캐폴딩 시작 시 | `docs/rule/code-style-convention.md` |
| web 내부 폴더 구조 (pages/components/hooks 등 세부 레이아웃) | `apps/` 최상위 구조만 정했고, `apps/web` 내부는 아직 안 정함. 실제 작업하면서 정하기로 함 | 스캐폴딩/작업 중 자연스럽게 | `docs/rule/repo-structure.md` |
| 시크릿 공유 도구 (1Password/Bitwarden 등) | 현재 규모에서는 별도 도구 없이 직접 전달 중 | 팀원이 늘어날 때 | `docs/rule/env-secrets-convention.md` |
| 로그 수집 스택 (Grafana Loki 등) | 현재는 `docker logs`로 충분한 규모 | 서비스가 늘거나 로그 검색이 자주 필요해질 때 | `docs/rule/logging-timezone-convention.md` |
| `docs/` 하위 폴더 확장 (`docs/rule/` 외 다른 폴더) | 지금은 컨벤션 문서뿐이라 `rule/` 하나로 충분 | ADR, 아키텍처 문서 등 다른 종류의 문서가 필요해질 때 | `docs/rule/documentation-convention.md` |
| 오프라인 지원 (PWA) | 인증된 API 호출은 오프라인에서 원천적으로 불가능 — 별도 로컬 캐싱/큐잉 전략 필요 | 오프라인 사용 요구사항이 실제로 나올 때 | `docs/rule/tech-stack.md` |
