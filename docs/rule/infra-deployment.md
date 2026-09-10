# Infra & Deployment

## 서버 구성

- 사내 서버 1대, Docker + Docker Compose 설치
- dev/prod는 같은 서버에서 컨테이너/포트만 분리해서 운영
- PostgreSQL도 컨테이너로 운영하되, **dev DB와 prod DB는 별도 컨테이너로 분리**한다. 데이터가 섞이거나 dev 테스트가 운영 자원에 영향 주는 것을 막는다.

## 리버스 프록시 & 도메인

- Nginx가 도메인 라우팅 + TLS 종료를 담당한다.
- 서브도메인으로 web/api를 구분한다 (`docs/rule/tech-stack.md`의 "같은 상위 도메인" 결정과 일치):
  - 운영: `app.menscake.com`(web), `api.menscake.com`(api)
  - 개발: `dev.menscake.com`(web), `dev-api.menscake.com`(api)
- 인증서: Let's Encrypt + certbot으로 자동 발급/갱신한다.

## CORS 설정

- `app.menscake.com`(web)과 `api.menscake.com`(api)은 같은 상위 도메인이어도 브라우저 기준으로는 **서로 다른 origin**이다. 상위 도메인 통일은 쿠키 공유(`Domain=.menscake.com`)를 위한 것이지 CORS와는 무관하다. CORS는 api가 별도로 허용해야 한다.
- api(Spring Security)에서 CORS를 프로파일별로 명시적으로 허용한다:
  - 운영(`application-prod.yml`): `Access-Control-Allow-Origin: https://app.menscake.com`
  - 개발(`application-dev.yml`): `Access-Control-Allow-Origin: https://dev.menscake.com`
- `Access-Control-Allow-Credentials: true`를 반드시 설정한다 (쿠키 기반 인증이라 credentials 포함 요청을 허용해야 함).
- ⚠️ `Access-Control-Allow-Origin: *`(와일드카드)는 credentials 허용과 함께 쓸 수 없다. 반드시 구체적인 도메인을 지정한다.
- web 쪽 fetch/TanStack Query 요청은 반드시 `credentials: 'include'`를 설정한다.

## CI/CD

- 사내 서버에 GitHub Actions **self-hosted runner**를 설치한다.
- `dev` 브랜치 반영 → 개발용 docker compose 스택 재빌드/재기동
- `main` 브랜치 반영 → 운영용 docker compose 스택 재빌드/재기동
- 배포 방식: `docker compose up -d --build` (별도 이미지 레지스트리 없이 서버에서 직접 빌드)

## DB 마이그레이션

- Flyway는 Spring Boot 앱 기동 시 자동 실행된다. 별도 배포 스텝이 필요 없다 — 컨테이너 재기동만 되면 스키마도 같이 최신화된다.
