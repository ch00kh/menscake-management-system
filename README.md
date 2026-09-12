# 멘즈케이크 관리 시스템 (menscake-management-system)

멘즈케이크(총각쓰떡) 사내 관리 시스템. 모노레포: `apps/web`(Vite + React + TypeScript), `apps/api`(Kotlin + Spring Boot).

## 준비물

| 도구 | 용도 | 비고 |
|---|---|---|
| [Node.js](https://nodejs.org/) 20 이상 | `apps/web` 실행 | npm 포함 |
| [Java](https://adoptium.net/) 21 (Temurin 권장) | `apps/api` 실행 | Gradle은 wrapper(`./gradlew`)로 자동 설치됨 |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | 로컬 PostgreSQL, `apps/api` 테스트(Testcontainers) | Windows는 WSL2 백엔드 필요 (`wsl --install`) |
| Git | - | - |

Docker 없이도 PostgreSQL을 직접 설치해 실행할 수는 있다 (아래 1번 대신). 단, `apps/api`의 Testcontainers 기반 테스트(`./gradlew test`)는 Docker가 반드시 있어야 한다.

## 프로젝트 구조

```
apps/
  web/       Vite + React + TypeScript — 관리자용 웹 (apps/web/README.md 참조)
  api/       Kotlin + Spring Boot — API 서버 (apps/api/README.md 참조)
docs/
  README.md  문서 지도 (상황별 라우팅)
  STATUS.md  지금까지 완료된 것/남은 것 핸드오프 문서 — 먼저 이걸 본다
  rule/      컨벤션 SSOT
  spec/      도메인 설계 스펙 (ERD, API 계약 등)
```

## 로컬에서 실행하기

### 1. PostgreSQL 준비

Docker로 실행:

```powershell
docker run --name menscake-db -e POSTGRES_DB=menscake -e POSTGRES_USER=menscake -e POSTGRES_PASSWORD=localdev -p 5432:5432 -d postgres:16
```

(또는 PostgreSQL을 직접 설치하고 `menscake`라는 빈 DB + 계정 하나만 만들어두면 된다 — 스키마는 백엔드가 뜰 때 Flyway가 자동 생성한다.)

### 2. 백엔드 실행 (`apps/api`)

PowerShell:

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/menscake"
$env:DB_USERNAME = "menscake"
$env:DB_PASSWORD = "localdev"
$env:JWT_SECRET = "local-dev-only-secret-key-must-be-at-least-32-bytes"
$env:ADMIN_SEED_EMAIL = "admin@menscake.com"
$env:ADMIN_SEED_PASSWORD = "admin1234"

cd apps/api
./gradlew bootRun --args='--app.cors.allowed-origin=http://localhost:5173'
```

`--args`로 CORS origin을 덮어쓰는 이유: `application-dev.yml`에 박혀있는 값이 실제 배포 주소(`https://dev.menscake.com`)라, 로컬 `localhost:5173`에서 오는 요청은 그대로 두면 CORS에 막힌다.

떴는지 확인: http://localhost:8080/health → `{"data":{"status":"OK"}}`

필요한 환경변수/자세한 명령어는 `apps/api/README.md` 참조.

### 3. 프론트엔드 실행 (`apps/web`)

```powershell
cd apps/web
Copy-Item .env.example .env
npm install
npm run dev
```

`.env`의 기본값(`VITE_API_BASE_URL=http://localhost:8080`)을 그대로 쓰면 된다. 자세한 명령어는 `apps/web/README.md` 참조.

### 4. 확인

http://localhost:5173/login 에서 위에서 설정한 관리자 계정(`ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD`)으로 로그인.

## 더 알아보기

- [docs/STATUS.md](docs/STATUS.md) — 지금까지 뭐가 됐고 다음에 뭘 하면 되는지
- [docs/README.md](docs/README.md) — 전체 문서 라우팅 지도
- [docs/rule/](docs/rule/) — 이 프로젝트의 모든 컨벤션(SSOT). 코드에서 문서와 다른 방식을 발견해도 임의로 새 패턴을 만들지 않는다
