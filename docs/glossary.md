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

## 계정 관리 (account-management) — [스펙](./spec/account-management/overview.md)

| 용어 | 의미 | 코드/DB 이름 |
|---|---|---|
| 비밀번호 변경 강제 | 관리자가 계정을 생성/비밀번호 재설정하면 다음 로그인 시 비밀번호 변경 화면으로 강제 이동시키는 상태 | `Account.mustChangePassword` (boolean) |
| 비밀번호 재설정 | 관리자가 기존 계정의 비밀번호를 대신 설정하는 액션. 대상 계정은 다시 변경 강제 대상이 됨 | `PATCH /api/accounts/{id}`의 `password` 필드 |

## 권한 관리 (permission-management) — [스펙](./spec/permission-management/overview.md)

| 용어 | 의미 | 코드/DB 이름 |
|---|---|---|
| 리소스 화이트리스트 | 권한 부여 대상이 될 수 있는 리소스 키 전체 목록. DB 테이블이 아니라 코드 상수 | `PermissionResource` enum (`key`, `label`) |
| 기본값 프리필 | 저장된 권한 행이 하나도 없는 계정의 매트릭스를 열 때, role에 따라 화면에만 미리 채워두는 CRUD 값. 저장 전까지는 실제 `permission` 행이 아님 | 프론트 전용 계산값 |
| 자기잠금 방지 | 로그인 본인 계정의 `permissions` 리소스 조회/수정 권한을 스스로 없애 이 화면에서 잠기는 것을 막는 검사 | `PUT /api/accounts/{id}/permissions`의 400 응답 조건 |
