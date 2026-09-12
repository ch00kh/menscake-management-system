-- 계정 관리 도메인: `must_change_password` 컬럼 추가 + admin 시드 계정의 `accounts`
-- 리소스 권한 (docs/spec/account-management/schema.md, flow.md 참조).

-- 기존 행/신규 기본값 모두 FALSE — 이미 시드된 관리자 계정은 비밀번호를 알고 있는
-- 상태이므로 강제 변경 대상이 아니다 (docs/spec/account-management/schema.md).
ALTER TABLE account
    ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT FALSE;

-- 닭-달걀 문제: 권한 관리 화면이 아직 없어 누구도 스스로 accounts 권한을 부여할 수
-- 없다. 시드 관리자 계정에 accounts 리소스 CRUD 전체 권한을 부여해 해결한다
-- (docs/spec/account-management/flow.md 참조).
INSERT INTO permission (account_id, resource, can_create, can_read, can_update, can_delete)
SELECT id, 'accounts', TRUE, TRUE, TRUE, TRUE
FROM account
WHERE email = '${adminEmail}';
