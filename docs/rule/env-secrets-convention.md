# Environment &amp; Secrets Convention

## .env 파일 원칙

- 각 앱(`apps/web`, `apps/api`)에 자체 `.env`를 둔다.
- `.env.example`(플레이스홀더 값)만 커밋한다. 실제 `.env`는 `.gitignore`에 넣고 절대 커밋하지 않는다.
- 시크릿 공유는 현재 규모에서는 별도 도구 없이 직접 전달한다. 팀이 커지면 재검토한다.

## ⚠️ Vite 환경변수 함정

- Vite는 `VITE_` 접두사가 붙은 변수만 클라이언트 번들에 포함시켜 브라우저에서 쓸 수 있게 한다.
- **`VITE_` 접두사 변수는 빌드된 JS 파일에 그대로 노출된다.** API 키, DB 비밀번호 같은 시크릿은 절대 `VITE_` 변수에 넣지 않는다.
- 그런 값이 필요한 로직은 반드시 `api`가 처리하고, `web`은 그 결과만 받는 API 엔드포인트를 호출한다.

## api(Spring Boot) 설정

- `application.yml` 사용, profile로 분리한다: `application.yml`(공통) + `application-dev.yml` + `application-prod.yml`
- 시크릿 값은 yml에 직접 쓰지 않고 환경변수로 주입한다. 예: `password: ${DB_PASSWORD}`

## CI/배포 시크릿

- GitHub Actions 배포 시 GitHub Secrets를 사용한다.
- `dev`/`main` 배포 대상이 다르므로 GitHub **Environments** 기능으로 dev/prod 시크릿을 분리한다 (같은 이름이어도 환경별로 다른 값).

