# Documentation Convention

## 코드 주석

- public 함수/클래스/컨트롤러/서비스 공개 메서드는 KDoc(api)/JSDoc(web)을 필수로 작성한다.
  - 첫 줄: 무엇을 하는지 한 줄 요약(타이틀)
  - 필요 시 파라미터/리턴 설명 추가
- 그 외 내부 코드는 주석을 원칙적으로 쓰지 않는다. 로직이 비자명할 때만 "왜 이렇게 했는지"(WHY) 한 줄만 남긴다.
- **예외:** `docs/rule/repo-structure.md`의 "생성/외부관리 코드" 목록에 있는 경로는 이 주석 규칙 대상이 아니다. 생성 도구/CLI의 산출물이며 수동 수정 금지 대상이므로 문서 주석을 별도로 요구하지 않는다.

## README

- 루트 `README.md`: 프로젝트 한 줄 소개, 로컬 실행 방법, 폴더 구조 요약, `docs/rule/` 링크
- `apps/web/README.md`, `apps/api/README.md`: 실행 방법, 필요 환경변수 목록, 주요 명령어

## docs 폴더 구조

```
docs/
  README.md        # 문서 지도 (상황별로 어떤 문서를 봐야 하는지 라우팅)
  glossary.md      # 도메인별 용어 사전 — 새 스펙 쓰기 전에 먼저 확인
  rule/            # 컨벤션 SSOT (git/repo-structure/naming/agent-collaboration/documentation 등)
  spec/<도메인>/    # 도메인별 설계 문서 (brainstorming 스킬의 architectural 경로 산출물).
                   # 예: spec/auth/{overview,tech-decisions,schema,flow}.md — 주제별로 파일을 나눈다
  PROGRESS.md      # 컨벤션 논의 진행 체크리스트
  TBD.md           # 지금은 안 정하고 미룬 항목 모음 (트리거 조건 포함)
  USER-TODO.md     # 에이전트가 아니라 사람이 직접 해야 하는 일 목록
```

`rule/`·`spec/` 외 다른 하위 폴더는 필요해지면 그때 추가한다 (YAGNI).

## 문서 언어

- 모든 문서(README, `docs/rule/` 등)는 한글로 작성한다.
