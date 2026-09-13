# 권한 관리 — 흐름

필드 목록/타입은 [api.md](./api.md)를 참조하고 여기서 중복 기술하지 않는다. `@RequiresPermission` 메커니즘 자체(어노테이션 + AOP)는 [auth 도메인 flow.md](../auth/flow.md) 참조.

## 진입점

계정 관리 화면(`AccountManagementPage`)의 목록 각 행에 "권한" 액션 버튼을 추가한다. 로그인 응답(`AuthResponse.permissions`, `PermissionSummary[]`)에서 `resource === "permissions" && canRead === true`인 항목이 있을 때만 버튼을 표시한다 — `account.role` 값으로 판단하지 않는다.

버튼을 누르면 모달이 열리고, 해당 계정의 권한 매트릭스를 조회/편집한다.

## 모달 데이터 로드

모달이 열리면 두 요청을 병렬로 보낸다:

1. `GET /api/permission-resources` — 화이트리스트 `[{key, label}]`
2. `GET /api/accounts/{accountId}/permissions` — 그 계정에 저장된 권한 행 (sparse)

두 응답을 프론트에서 병합해 매트릭스를 만든다: 화이트리스트의 각 `key`를 행으로 놓고, (2)에서 같은 `resource`를 가진 항목이 있으면 그 CRUD 값을 쓰고, 없으면 기본값을 채운다.

## 기본값(프리필) 계산

- (2)의 응답 배열이 **완전히 비어 있을 때만**(그 계정에 저장된 권한 행이 하나도 없을 때) role 기반 기본값을 화이트리스트 전체 행에 적용한다:
  - `STAFF` → `canRead = true`, 나머지 `false`
  - `MANAGER` → `canRead = true`, `canUpdate = true`, 나머지 `false`
  - `ADMIN` → 전부 `true`
- (2)의 응답 배열에 항목이 하나라도 있으면(이미 저장된 권한이 있는 계정), role 기본값을 적용하지 않는다 — 화이트리스트에 있지만 (2)에 없는 리소스는 전부 `false`(권한 없음)로만 채운다.
- 이 기본값은 화면에 보여주기 위한 계산일 뿐이며, 사용자가 저장 버튼을 눌러야 실제 `permission` 행이 생긴다.

## 편집 및 저장

- `permissions:UPDATE`가 없으면(로그인 응답의 `PermissionSummary`로 판단) 매트릭스 체크박스와 저장 버튼을 비활성화하고 조회 전용으로 보여준다.
- 저장 버튼을 누르면 화이트리스트 전체 키에 대한 현재 체크 상태를 `PUT /api/accounts/{accountId}/permissions`로 보낸다 (화이트리스트 일부만 보내지 않는다).
- 성공하면 모달을 닫고 필요 시 목록을 갱신한다. 실패(4xx)는 `ProblemDetail`을 그대로 폼 에러로 표시한다.

## 자기잠금 판정 (백엔드)

`PUT /api/accounts/{accountId}/permissions` 처리 시:

1. 요청 본문에 화이트리스트에 없는 `resource` 키가 있으면 즉시 400.
2. `accountId`가 존재하지 않으면 404.
3. `accountId`가 로그인 계정 본인이면, 요청 본문에서 `resource == "permissions"`인 항목을 찾아 그 `canRead`/`canUpdate` 중 하나라도 `false`면 요청 전체를 400으로 거부하고 아무 것도 저장하지 않는다 (계정 관리의 "본인 비활성화 차단"과 동일하게, 검사를 통과한 요청만 이후 로직을 진행하는 형태로 구현 — 부분 저장 없음).
4. 통과하면 화이트리스트 전체 키를 `(accountId, resource)` 기준 upsert.

## 테스트 대상 (`docs/rule/testing-convention.md` 기준)

**api (service 계층)**
- 자기잠금 판정: 본인 계정 + `permissions` 리소스의 `canRead`/`canUpdate` 중 하나라도 `false` → 400, 저장 안 됨
- 자기잠금 판정: 본인 계정이라도 `permissions` 리소스의 `canRead`/`canUpdate`가 모두 유지되면 통과
- 자기잠금 판정: 본인이 아닌 다른 계정 대상이면 `permissions` 값이 어떻든 통과
- upsert: 기존 행이 있는 리소스는 갱신, 없는 리소스는 생성
- 화이트리스트에 없는 `resource` 키 포함 시 400, 아무 행도 저장되지 않음(원자성)

**web (hook)**
- 프리필 계산: 저장된 권한 행이 하나도 없을 때만 role 기본값 적용, 하나라도 있으면 미적용
- 프리필 계산: `STAFF`/`MANAGER`/`ADMIN` 각각의 기본값 매핑이 맞는지
- `permissions:READ`/`permissions:UPDATE` 보유 여부에 따라 버튼 노출·편집 가능 여부가 갈리는지
