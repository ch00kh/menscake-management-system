# Repository Structure

## 요약

```
apps/
  web/       # Vite + React (TypeScript) — 관리자용 웹
  api/       # Kotlin + Spring Boot — API 서버
docs/
  rule/      # 컨벤션 문서
```

## 원칙

- `apps/`: 실행 가능한 서비스 단위. 지금은 `web`, `api` 2개.
- `packages/` 폴더는 아직 만들지 않는다. 프론트 앱이 `web` 하나뿐이라 JS/TS끼리 공유할 코드가 없다. 프론트 앱이 늘어나면 그때 만든다 (YAGNI).
- `web`(TypeScript)과 `api`(Kotlin)는 언어가 달라 파일 단위 코드 공유가 불가능하다. 별도 빌드 생태계(pnpm/npm workspace vs Gradle)로 분리된다.

## API 타입 동기화

- `api`가 OpenAPI 스펙을 노출한다 (springdoc-openapi).
- `web`은 그 스펙을 기반으로 TypeScript 타입/TanStack Query 훅을 자동생성한다 (`orval`, `docs/rule/tech-stack.md` 참조).
- 생성된 코드는 `apps/web` 내부(예: `apps/web/src/api/generated/`)에 위치한다. 구체적인 버전 pin과 생성 스크립트 이름은 실제 스캐폴딩 단계에서 결정한다.

## 생성/외부관리 코드 (SSOT — 수동 수정 금지 목록)

아래 경로는 사람이 직접 작성하지 않고 도구/CLI가 생성·관리하는 산출물이다. **lint, 포맷, 코드 주석, 파일 네이밍 규칙 전부 적용 대상에서 제외**하며, 재생성 스크립트나 CLI 재실행으로만 갱신한다. `docs/rule/code-style-convention.md`, `docs/rule/documentation-convention.md`, `docs/rule/naming-convention.md`는 각자 규칙 대상에서 이 목록을 제외한다고만 언급하고, 실제 경로 목록은 여기 하나로만 관리한다.

| 경로 | 생성 주체 | 비고 |
|---|---|---|
| `apps/web/src/api/generated/**` | orval (OpenAPI 스펙 기반) | TS 타입 + TanStack Query 훅 |
| `apps/web/src/components/ui/**` | shadcn/ui CLI (`npx shadcn add`) | 프리미티브 컴포넌트 |
| `apps/web/src/hooks/use-mobile.ts` | shadcn/ui CLI | sidebar 컴포넌트가 함께 생성하는 훅 |

새로 생기는 생성/CLI 산출물 경로가 있으면 이 표에 먼저 추가한다.

git convention의 `scope` 규칙(패키지/앱 디렉터리명과 1:1)에 따라 커밋/브랜치 scope는 `web`, `api`를 사용한다.
