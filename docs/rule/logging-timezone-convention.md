# Logging & Timezone Convention

## 타임존

- 서버(OS)와 DB 모두 KST(Asia/Seoul)로 고정한다.
- Spring Boot JVM 타임존도 KST로 맞춘다 (`-Duser.timezone=Asia/Seoul`).

## 로깅

- 구조화된 JSON 로그를 컨테이너 stdout으로 출력한다 (컨테이너 표준 관행).
- ⚠️ Docker 로그 드라이버에 `max-size`/`max-file`을 반드시 설정한다. 설정하지 않으면 로그가 무한정 쌓여 디스크가 찬다 (`docker-compose.yml` 각 서비스에 logging 옵션 지정).
- 로그 레벨 기준:
  - `INFO`: 정상 흐름의 주요 이벤트 (주문 생성, 상태 변경 등)
  - `WARN`: 복구 가능한 이상 상황 (재시도, 외부 API 지연 등)
  - `ERROR`: 즉시 확인이 필요한 실패 (미처리 예외 등)
- **민감정보(비밀번호, 토큰, 카드번호 등)는 절대 로그에 남기지 않는다.** 요청/응답 로깅 시 해당 필드는 마스킹한다.
- 확인 방법: `docker logs <container>`로 직접 확인한다. 서비스가 늘거나 검색이 자주 필요해지면 그때 Grafana Loki 같은 로그 수집 스택 도입을 재검토한다 (YAGNI).
