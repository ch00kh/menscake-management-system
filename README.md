# shadcn-skill-test

ERP 애플리케이션 저장소. 프런트엔드와 백엔드를 한 저장소에서 같이 개발합니다.

백엔드 착수 전에 정할 것들은 [TODO.md](TODO.md)에 있습니다.

## 구성

```
TODO.md       백엔드 착수 전 결정 목록
              (1 컨벤션 → 2 도메인 → 3 스택 → 4 스택별 컨벤션 → 5 착수)

frontend/     Vite + React + TypeScript + Tailwind v4 + shadcn/ui
              ERP 화면 레이아웃 30종. 자체 package.json / node_modules 를 가집니다.
              → frontend/README.md

backend/      (예정) 설계 문서를 먼저 만들고 시작합니다.

docs/         설계 문서
              convention.md     컨벤션 (표기 · 케이스 · 값 표기 · git)
              design/theme.md   시스템 테마 (송편)
              domain/scope.md   도메인 범위와 순서
              domain/prior-design-2026-09-02.md   이전 초안 (보관)

.claude/      Claude Code 스킬 (shadcn, migrate-radix-to-base)
.agents/      에이전트용 스킬 사본
```

각 패키지가 자기 의존성을 따로 관리합니다. 루트에는 `package.json`이 없으므로
npm 명령은 해당 폴더로 들어가서 실행합니다.

## 실행

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

나머지 스크립트와 레이아웃 30종 목록은 [frontend/README.md](frontend/README.md)에 있습니다.

## 백엔드

아직 없습니다. 스택을 정하고 설계 문서를 작성한 뒤 `backend/`를 추가할 예정입니다.
