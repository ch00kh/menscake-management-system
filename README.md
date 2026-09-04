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
              adr/                  결정 기록. TODO 단계와 1:1 (001~004)
              convention.md         컨벤션 — 스택과 무관한 것
              convention-stack.md   컨벤션 — 스택 종속
              stack.md              기술 스택과 근거
              sizing.md             데이터 규모 추정
              operations.md         운영 규칙 (백업 · 접근통제 · 접속기록)
              design/theme.md       시스템 테마 (송편)
              domain/               도메인 9개 + glossary.md + scope.md

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
