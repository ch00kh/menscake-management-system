# 인증/로그인 — 기술 선택

| 결정 사항 | 선택 | 근거 |
|---|---|---|
| JWT 라이브러리 | `jjwt` (io.jsonwebtoken) | HMAC 서명 기반의 단순 발급/검증만 필요. Spring Security OAuth2 Resource Server(Nimbus JOSE)는 외부 OAuth2 제공자 연동을 전제로 해 이 정도 단순 인증에는 과함 |
| 프론트 API 연동 방식 | 손으로 `fetch` 작성 | 이번 이슈의 엔드포인트는 3~4개뿐. orval 코드생성 파이프라인 구축은 그 자체로 별도 범위(엔드포인트가 쌓였을 때 도입) — `docs/TBD.md`의 orval 항목 참조 |
| 권한 체크 메커니즘 | 커스텀 어노테이션(`@RequiresPermission`) + Spring AOP | `@PreAuthorize` + `PermissionEvaluator`보다 호출부 문법이 단순하고, resource+action 2개 인자를 SpEL 없이 명시적으로 표현 |
| 권한 데이터 위치 | Access Token claim에 permissions 통째로 포함 | 매 요청 DB 조회 없이 인가 판단 가능. 권한이 바뀌면 다음 refresh(최대 15분 지연)부터 반영 — 이 지연은 감수 |
| Refresh Token 저장 | DB에 해시로 저장, 철회 가능(stateful) | 로그아웃/계정 정지 시 즉시 무효화가 필요하다는 요구사항 때문에 순수 stateless(자연 만료만) 대신 선택 |
