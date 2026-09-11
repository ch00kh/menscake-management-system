# 용어 사전 (Glossary)

도메인이 하나 늘어날 때마다(`docs/spec/<도메인>/` 작성 시) 그 도메인에서 쓰는 용어와 실제 코드/DB 이름을 여기에 추가한다. 새 스펙을 쓰기 전에 여기서 이미 쓰인 용어·이름이 있는지 먼저 확인한다 — 같은 개념을 도메인마다 다른 이름으로 부르는 걸 막기 위함이다.

## 공통

| 용어 | 의미 | 코드/DB 이름 |
|---|---|---|
| 리소스 | 권한 체크 단위가 되는 대상(대체로 업무 메뉴 하나) | `resource` (문자열 키) |

## 인증 (auth) — [스펙](./spec/auth/overview.md)

| 용어 | 의미 | 코드/DB 이름 |
|---|---|---|
| 계정 | 로그인 가능한 사용자 | `Account` 엔티티 / `account` 테이블 |
| 역할 | 계정 분류 라벨. 인가 판단에는 쓰지 않음(분류) | `Account.role` — 허용값 `ADMIN`\|`MANAGER`\|`STAFF` |
| 액세스 토큰 | 요청 인증에 쓰는 단기 토큰(JWT). 클라이언트 메모리에만 보관 | `accessToken` (API 응답 필드) |
| 리프레시 토큰 | Access Token 재발급용 장기 토큰, DB에서 철회 가능 | `RefreshToken` 엔티티 / `refresh_token` 테이블 |
| 권한 | 계정별 리소스에 대한 생성/조회/수정/삭제 허용 여부(상태) | `Permission` 엔티티 / `permission` 테이블 |
| 액션 | 권한 체크의 동작 단위 | `Action` enum — `CREATE`\|`READ`\|`UPDATE`\|`DELETE` |
