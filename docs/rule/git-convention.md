# Git Convention

## 1. 브랜치 전략

- 상시 브랜치 2개: `main`(운영), `dev`(개발). 둘 다 보호 브랜치, 직접 push 금지, PR로만 반영.
- 모든 작업(기능/버그/핫픽스 포함)은 `dev`에서 분기 → PR로 `dev`에 머지. 핫픽스도 예외 없이 `dev` 경유.
- `dev` → `main` 승격도 PR로 진행. `release/*` 브랜치는 두지 않음.
- 동시 작업 2~3개를 감안해 브랜치 수명은 며칠 이내로 짧게 유지.
- 배포: `dev` 반영 → 개발 서버, `main` 반영 → 운영 서버 (GitHub Actions)

**네이밍:** `<type>/<scope>-<issue번호>-<short-description>` (kebab-case, `dev`에서 분기, 이슈 번호는 `docs/rule/issue-management.md` 참조)
```
feat/api-42-refund-flow
fix/web-17-cart-total-rounding
```

## 2. 커밋 메시지

Conventional Commits: `<type>(<scope>): <subject>` — `type`/`scope`는 영어, `subject`는 한글(간결한 명사형 종결, 마침표 없음).

| type | 용도 | | type | 용도 |
|---|---|---|---|---|
| `feat` | 새 기능 | | `docs` | 문서만 변경 |
| `fix` | 버그 수정 | | `chore` | 빌드/설정/의존성 |
| `refactor` | 구조 개선 | | `ci` | CI/CD 변경 |
| `perf` | 성능 개선 | | `style` | 포맷팅 |
| `test` | 테스트 | | `revert` | 커밋 되돌리기 |

- `scope`: 패키지/앱 디렉터리명과 1:1 (`web`, `api`). 여러 패키지 걸치면 생략 가능.
- 커밋 하나 = 논리적 변경 하나. Breaking change는 footer `BREAKING CHANGE: <설명>`. 티켓 참조는 `Refs: #123`.
- 강제: commitlint + husky `commit-msg` hook (`@commitlint/config-conventional` 기반, 영어 전용 룰인 `subject-case`/`subject-full-stop`은 비활성화). 설치는 모노레포 스캐폴딩 이후 진행.

```
feat(api): 취소 주문 환불 플로우 추가
fix(web): 장바구니 합계 반올림 오류 수정
```

## 3. PR 규칙

- 모든 PR(`dev`, `dev`→`main` 승격 포함) 최소 1명 승인 필수.
- 머지 방식: **Squash and merge** 고정.
- CI(lint/test/build) 통과 필수 — 브랜치 보호 규칙(required status check)으로 강제.
- ⚠️ **현재 예외 (1인 운영):** GitHub은 PR을 올린 계정이 그 PR을 승인하는 것을 막는다. 관리자가 사장님 한 명뿐인 지금은 이 규칙을 그대로 두면 아무 PR도 승인될 수 없어 머지가 막힌다. 그래서 브랜치 보호의 `enforce_admins`(관리자도 규칙 적용)를 꺼서, **관리자(1인)는 승인·CI 결과와 무관하게 머지할 수 있다.** 관리자가 아닌 협업자의 PR에는 승인 필수·CI 통과 필수가 그대로 적용된다. 팀원이 늘어나면 `enforce_admins`를 다시 켜고 관리자 PR도 다른 사람이 승인하는 흐름으로 되돌린다 (`docs/TBD.md` 참조).
- PR 제목 = 커밋 컨벤션 형식 (`<type>(<scope>): <한글 subject>`), 본문에 변경 요약 필수.
- 에이전트가 만든 PR은 본문에 어떤 지시/작업 단위로 생성됐는지 한 줄 요약 추가.
