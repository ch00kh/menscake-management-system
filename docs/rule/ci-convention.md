# CI Convention

## 함정 — 트리거 자체에 경로 필터를 걸면 안 됨

워크플로우 트리거(`on: push`/`pull_request`)에 `paths:` 필터를 걸면, 해당 경로가 안 바뀐 PR에서는 워크플로우 자체가 실행되지 않는다. 이 상태에서 브랜치 보호 규칙이 그 워크플로우를 required status check로 걸어두면, GitHub는 실행되지 않은 체크를 계속 "대기 중"으로 표시해 **머지가 영원히 막힌다.**

## CI 경로 분리 (해법)

- CI 워크플로우는 push/PR마다 항상 트리거된다. 트리거 자체에는 경로 필터를 걸지 않는다.
- 워크플로우 시작 시 `dorny/paths-filter` 액션으로 변경된 경로를 감지한다.
  - `apps/web/**` 변경 → web job(lint/test/build) 실행
  - `apps/api/**` 변경 → api job(ktlintCheck/test/build) 실행
  - 루트 공용 파일(`docker-compose.yml`, `.github/workflows/**` 등) 변경 → web/api job 둘 다 실행
  - 위에 해당하지 않으면(`docs/`만 변경 등) 두 job 다 스킵한다. 워크플로우 자체는 성공으로 종료된다.
- 브랜치 보호 규칙의 required status check는 **job 단위가 아니라 워크플로우 전체**를 대상으로 건다. job이 스킵돼도 워크플로우는 완료되므로 머지가 막히지 않는다.
