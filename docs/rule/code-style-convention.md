# Code Style & Lint Convention

## web (Vite + React + TS)

- 린터: ESLint (`typescript-eslint` + `eslint-plugin-react-hooks`)
- 포매터: Prettier
- pre-commit: husky + lint-staged가 커밋될 파일만 자동으로 `eslint --fix` + `prettier --write`
- CI: `eslint` 검사(수정 없이 체크만) 통과 필수

## api (Kotlin + Spring Boot)

- 린터/포매터: ktlint (Gradle 플러그인, 공식 Kotlin 스타일 기준)
- pre-commit: 같은 husky pre-commit hook에서 Kotlin 파일 변경 감지 시 `./gradlew ktlintFormat` 실행 후 커밋
- CI: `./gradlew ktlintCheck` 통과 필수

## 생성 코드 예외

- `docs/rule/repo-structure.md`의 "생성/외부관리 코드" 목록에 있는 경로는 ESLint/Prettier 대상에서 제외한다.
  - ESLint `ignores` / `.prettierignore`에 해당 경로들을 추가
  - lint-staged 설정에서도 같은 경로들을 제외해 pre-commit 시 재포맷되지 않게 한다.
- 이유: 생성 도구가 만든 포맷을 사람이 만든 규칙으로 다시 고치면 재생성할 때마다 불필요한 diff가 생긴다.
- 새 생성/CLI 산출물 경로가 생기면 `repo-structure.md` 목록에 먼저 추가하고, 여기 설정(ESLint/Prettier/lint-staged)에 반영한다.

## 공통 원칙

- 커밋 시점 자동 포맷(auto-fix)이 원칙이다. 규칙 위반은 사람이 손으로 고치지 않고 도구가 고친다.
- CI의 lint 체크는 `docs/rule/git-convention.md`의 PR 규칙("CI 통과 필수")에 포함된다. 여기서는 대상 도구만 명시한다.
- 정확한 ESLint/ktlint 규칙셋 세부 튜닝(예: 특정 config 프리셋 채택 여부)은 실제 스캐폴딩 단계에서 진행한다.
