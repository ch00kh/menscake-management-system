-- 권한 관리 화면(docs/spec/permission-management) 자체를 admin 계정이 열고 저장할 수
-- 있어야 하므로, admin 계정의 `permission` 행으로 `resource = 'permissions'` CRUD 전체
-- 허용을 시드한다 (docs/spec/permission-management/schema.md "시드 데이터 갱신 필요" 참조).
INSERT INTO permission (account_id, resource, can_create, can_read, can_update, can_delete)
SELECT id, 'permissions', TRUE, TRUE, TRUE, TRUE
FROM account
WHERE email = '${adminEmail}';
