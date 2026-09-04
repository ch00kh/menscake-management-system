# menscake-management-system

**쇼핑몰 운영팀의 주문 취합 시스템.**

5명 이상이 교대·야간으로 돌아가는 팀이 구글 공유 스프레드시트와 디스코드로 주문·재고를
관리하고 있습니다. 시트는 데이터를 담고 디스코드는 그 데이터의 **상태**를 담습니다 —
"이거 처리했어요?" "네"가 지금의 워크플로 엔진이자 감사 로그입니다.

만들 것은 ERP 화면이 아니라 **주문 행의 상태 · 담당자 · 시각을 권위 있게 보유하고
교대 경계를 넘어 살아남는 공유 운영 상태 계층**입니다.

> **설계 리트머스** — 디스코드 스크롤백 없이, 처음 보는 야간 담당자가 화면만 보고
> 지금 뭘 해야 하는지 정확히 아는가?

---

## 구성

```
frontend/   Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui
            ERP 화면 레이아웃 30종. 자체 package.json 을 가집니다

backend/    (예정) Java 21 + Spring Boot 3 + PostgreSQL

docs/       설계 문서 — 결정 기록 · 도메인 · 스택 · 컨벤션
```

각 패키지가 자기 의존성을 따로 관리합니다. 루트에 `package.json`이 없으므로 npm 명령은
해당 폴더로 들어가서 실행합니다.

## 실행

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

| 명령 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입 검사 후 프로덕션 빌드 |
| `npm run typecheck` | 타입만 검사 |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

레이아웃 30종 목록은 [frontend/README.md](frontend/README.md)에 있습니다.
앱을 띄운 뒤 `/gallery` 에서도 볼 수 있습니다.

## 문서

작업을 시작하기 전에 [AGENTS.md](AGENTS.md)를 보세요. 어떤 문서를 언제 읽어야 하는지가
거기 있습니다.

남은 할 일은 [TODO.md](TODO.md)에 단계별로 있습니다.

## 브랜치

```
feature/* · fix/*  →  dev  →  (릴리스)  →  main
                      ↓                     ↓
                   개발 서버              운영 서버
```

작업 브랜치는 `dev` 에서 따고 `dev` 로 돌아갑니다. 규칙 전체는
[docs/convention/git.md](docs/convention/git.md).
