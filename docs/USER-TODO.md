# User TODO

에이전트가 대신할 수 없고 사람이 직접 해야 하는 일들. 완료하면 체크하고, 논의 중 새로 생기면 여기에 추가한다.

## 지금 필요

- [ ] ERP 레이아웃 자료 전달 (shadcn/ui로 이미 만들어둔 것) — web UI 스캐폴딩 시 그대로 재사용 예정
- [ ] GitHub 조직/저장소 생성 — 아직 git 저장소가 아님

## 스캐폴딩/첫 배포 전에 필요

- [ ] `menscake.com` 도메인 DNS 설정: `app`, `api`, `dev`, `dev-api` 서브도메인을 사내 서버 IP로 A레코드 연결 (`docs/rule/infra-deployment.md`)
- [ ] 사내 서버 준비: Docker + Docker Compose 설치, 80/443 포트 외부 개방(Let's Encrypt 인증서 발급용), 접근 계정(SSH 등) (`docs/rule/infra-deployment.md`)
- [ ] 사내 서버에 GitHub Actions self-hosted runner 등록 — 서버 접근권한 필요 (`docs/rule/infra-deployment.md`)
- [ ] GitHub 저장소 설정: 브랜치 보호 규칙(`main`/`dev`, 최소 1명 승인, CI 필수), GitHub Projects 보드, 라벨(`feat`/`fix`/`web`/`api`/`blocked` 등) 생성 (`docs/rule/git-convention.md`, `docs/rule/issue-management.md`)
- [ ] GitHub Environments(dev/prod) 생성 + Secrets 실제 값 입력 (DB 비밀번호, JWT 서명 키 등) (`docs/rule/env-secrets-convention.md`)

## 나중에 (TBD 트리거될 때 — `docs/TBD.md` 참조)

- [ ] 팀원 늘어나면 시크릿 공유 도구(1Password 등) 결정
- [ ] 오프라인 지원 요구사항이 실제로 나오면 PWA 오프라인 전략 논의
