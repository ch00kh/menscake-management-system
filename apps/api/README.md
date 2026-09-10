# API

Kotlin + Spring Boot 기반 menscake 관리 시스템 API 서버입니다.

이 README 안의 경로는 모두 `apps/api/` 기준입니다.

## 실행 방법

`apps/api/`에서 실행합니다.

```bash
cd apps/api
./gradlew bootRun           # 기본값으로 dev 프로파일 실행 (필요 환경변수는 아래 참고)
```

prod 프로파일로 실행하려면:

```bash
./gradlew bootRun --args='--spring.profiles.active=prod'
```

DB는 PostgreSQL을 사용합니다 (Testcontainers 기반 테스트 제외). 로컬에서 실행하려면
PostgreSQL 인스턴스를 준비하고 아래 환경변수로 접속 정보를 넘겨야 합니다.

## 필요 환경변수

`docs/rule/env-secrets-convention.md`에 따라 시크릿은 `.env`가 아닌 환경변수로 주입합니다
(`apps/api`는 아직 `.env`/`.env.example` 없이 셸 환경변수만 사용합니다).

| 변수 | 설명 | 사용처 |
|---|---|---|
| `DB_URL` | PostgreSQL JDBC URL (예: `jdbc:postgresql://localhost:5432/menscake`) | `application-dev.yml`, `application-prod.yml` |
| `DB_USERNAME` | DB 접속 계정 | `application-dev.yml`, `application-prod.yml` |
| `DB_PASSWORD` | DB 접속 비밀번호 | `application-dev.yml`, `application-prod.yml` |

CORS 허용 origin(`app.cors.allowed-origin`)은 환경변수가 아니라 프로파일 yml에
직접 값으로 박혀 있습니다 (dev: `https://dev.menscake.com`, prod: `https://app.menscake.com`) —
비밀값이 아니라 공개 도메인이므로 `docs/rule/infra-deployment.md`의 CORS 설정을 그대로 코드에 반영했습니다.

## 주요 명령어

```bash
./gradlew bootRun          # 로컬 실행
./gradlew build            # 컴파일 + 테스트 + 패키징
./gradlew build -x test    # 테스트 제외하고 컴파일 + 패키징
./gradlew test             # 테스트 실행 (Testcontainers/Docker 필요)
./gradlew ktlintCheck      # 린트 검사 (수정 없이 체크만, CI에서 사용)
./gradlew ktlintFormat     # 린트 자동 포맷
```

`test`는 `TestcontainersConfiguration`이 실제 PostgreSQL 컨테이너를 띄우므로 로컬에 Docker가
실행 중이어야 합니다 (`docs/rule/tech-stack.md` 참조).

## 구조

```
src/
  main/
    kotlin/com/menscake/api/
      ApiApplication.kt          Spring Boot 진입점
      common/
        HealthController.kt      배선 확인용 데모 엔드포인트 (GET /health)
        config/
          SecurityConfig.kt      CORS + 최소 Spring Security 설정 (JWT는 아직 없음)
        error/
          GlobalExceptionHandler.kt  검증 실패 등을 RFC 7807 ProblemDetail로 변환
          FieldValidationError.kt    ProblemDetail의 errors 확장 필드 항목
        response/
          ApiResponse.kt         모든 성공 응답 공통 wrapper (`ApiResponse<T>`)
    resources/
      application.yml            공통 설정
      application-dev.yml        dev 프로파일 (DB/CORS)
      application-prod.yml       prod 프로파일 (DB/CORS)
      logback-spring.xml         구조화된 JSON 로그 (stdout)
  test/
    kotlin/com/menscake/api/     테스트 (JUnit5 + MockK + Testcontainers)
```

## 참고

- API 응답 형식: `docs/rule/api-response-convention.md`
- 네이밍 규칙: `docs/rule/naming-convention.md`
- 로깅/타임존: `docs/rule/logging-timezone-convention.md`
- CORS/배포: `docs/rule/infra-deployment.md`
