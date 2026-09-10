# API Response Convention

## 성공 응답

- 모든 성공 응답은 `data` 필드 안에 실제 값을 담아 반환한다.
- 단건 조회/생성/수정:
  ```json
  { "data": { "id": 1, "status": "REFUNDED" } }
  ```
- 목록 조회(페이지네이션): Spring Data의 `Page<T>` 직렬화 형태를 그대로 `data`에 담는다.
  ```json
  { "data": { "content": [...], "totalElements": 132, "totalPages": 7, "number": 0, "size": 20 } }
  ```
- 페이지네이션 요청은 offset 기반이다: `?page=0&size=20&sort=createdAt,desc`

### 구현 방식 — 제네릭 wrapper를 명시적으로 반환

- `ApiResponse<T>(val data: T)` 제네릭 클래스를 만들고, 컨트롤러는 이 타입을 **명시적으로** 반환한다 (예: `ApiResponse<OrderResponse>`).
- ⚠️ `@ControllerAdvice`의 `ResponseBodyAdvice`로 응답을 자동으로 감싸는 방식은 쓰지 않는다. springdoc-openapi는 컨트롤러 메서드의 반환 타입만 보고 OpenAPI 스펙을 생성하는데, 자동 wrapping은 실제 응답과 스펙에 기록되는 타입이 달라지게 만든다. 그 결과 orval이 감싸지지 않은 잘못된 TS 타입을 생성해 web에서 타입 불일치가 난다. 반드시 컨트롤러가 `ApiResponse<T>`를 직접 반환해야 스펙이 정확해지고 orval 생성 타입도 맞는다.

## 에러 응답 — RFC 7807 (Problem Details)

- 에러 응답은 `data`로 감싸지 않는다. HTTP 상태코드가 2xx면 `data`를 열어보고, 4xx/5xx면 `ProblemDetail`을 그대로 파싱하는 식으로 web에서 최상위 구조만 보고 성공/실패를 구분할 수 있게 한다.
- Spring Boot 3.x에 내장된 `ProblemDetail` 표준을 그대로 쓴다. 커스텀 에러 포맷을 새로 만들지 않는다.
  ```json
  {
    "type": "about:blank",
    "title": "Bad Request",
    "status": 400,
    "detail": "환불 사유는 필수입니다",
    "errors": [{ "field": "reason", "message": "필수 항목입니다" }]
  }
  ```
- 검증 에러(`errors` 배열)는 `ProblemDetail`의 표준 확장 필드로 추가한다.

## HTTP 상태코드 원칙

| 상황 | 코드 |
|---|---|
| 조회/수정 성공 | 200 |
| 생성 성공 | 201 |
| 삭제 성공 | 204 |
| 요청 검증 실패 | 400 |
| 인증 안 됨 | 401 |
| 권한 없음 | 403 |
| 리소스 없음 | 404 |
| 상태 충돌(중복 등) | 409 |
| 서버 오류 | 500 |
