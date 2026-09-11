-- 인증 도메인 테이블 (docs/spec/auth/schema.md 참조).
-- pgcrypto: 관리자 계정 시드 시 비밀번호를 BCrypt로 해시하기 위해 필요.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE account (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE permission (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES account (id),
    resource VARCHAR(100) NOT NULL,
    can_create BOOLEAN NOT NULL DEFAULT FALSE,
    can_read BOOLEAN NOT NULL DEFAULT FALSE,
    can_update BOOLEAN NOT NULL DEFAULT FALSE,
    can_delete BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (account_id, resource)
);

CREATE TABLE refresh_token (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES account (id),
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- 최초 관리자 계정 시드. 실제 이메일/비밀번호는 Flyway placeholder로 주입된다
-- (application-{dev,prod}.yml의 spring.flyway.placeholders, docs/rule/env-secrets-convention.md 참조).
-- 아직 실제 업무 메뉴(resource)가 없어 permission 시드는 없다 — 리소스가 생길 때
-- 그 이슈에서 admin의 permission 행을 함께 추가한다 (docs/spec/auth/schema.md 참조).
INSERT INTO account (email, password_hash, name, role)
VALUES (
    '${adminEmail}',
    crypt('${adminPassword}', gen_salt('bf', 10)),
    '관리자',
    'ADMIN'
);
