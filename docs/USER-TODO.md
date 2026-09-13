# User TODO

에이전트가 대신할 수 없고 사람이 직접 해야 하는 일들. 완료하면 체크하고, 논의 중 새로 생기면 여기에 추가한다.

## 지금 필요

- [x] ERP 레이아웃 자료 전달 (shadcn/ui로 이미 만들어둔 것) — `apps/web`에 30종 레이아웃 스캐폴딩으로 반영됨
- [x] GitHub 조직/저장소 생성 — `ch00kh/menscake-management-system`에 초기 스캐폴딩 push 완료

## 스캐폴딩/첫 배포 전에 필요

- [ ] `menscake.com` 도메인 DNS 설정: `app`, `api`, `dev`, `dev-api` 서브도메인을 사내 서버 IP로 A레코드 연결 (`docs/rule/infra-deployment.md`)
- [ ] 사내 서버 준비: Docker + Docker Compose 설치, 80/443 포트 외부 개방(Let's Encrypt 인증서 발급용), 접근 계정(SSH 등) (`docs/rule/infra-deployment.md`)
- [ ] 사내 서버에 GitHub Actions self-hosted runner 등록 — 서버 접근권한 필요 (`docs/rule/infra-deployment.md`)
- [x] 브랜치 보호 규칙(`main`/`dev`, 최소 1명 승인) 설정 — GitHub Free 플랜은 Private 저장소에 브랜치 보호를 지원하지 않아 저장소를 **Public**으로 전환하고 적용함. CI 필수 체크(`CI` job, `.github/workflows/ci.yml`)도 `docs/rule/ci-convention.md`대로 required status check로 등록 완료. **1인 계정으로는 "본인 PR 승인 불가"라 실질적으로 머지가 막혀서, `enforce_admins`는 끄고 admin(1인)만 승인 없이 머지 가능하도록 예외 처리함** — 팀원이 늘어나면 이 예외를 다시 검토해야 함
- [x] 라벨 생성 — `feat`/`fix`/`refactor`/`perf`/`test`/`docs`/`chore`/`ci`/`style`/`revert`(type), `web`/`api`(scope), `blocked` (`docs/rule/issue-management.md`). GitHub 기본 라벨(`bug`/`enhancement`/`documentation` 등 10개)은 컨벤션과 무관하고 `bug`/`fix`, `documentation`/`docs`처럼 의미가 겹쳐 혼선을 줄 수 있어 전부 삭제함 — 저장소 라벨이 문서와 정확히 일치
- [x] ~~GitHub Projects 보드~~ — 작업 단위별 이슈 트래킹 자체를 폐지하면서 안 쓰던 보드도 삭제함 (`docs/rule/issue-management.md` 참조). 더 이상 할 일 없음.
- [ ] GitHub Environments(dev/prod) 생성 + Secrets 실제 값 입력: `DB_PASSWORD`, `JWT_SECRET`(32바이트 이상 랜덤 문자열), `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD`(dev/prod 환경별로 다른 값 권장) (`docs/rule/env-secrets-convention.md`, `apps/api/README.md`)

## 나중에 (TBD 트리거될 때 — `docs/TBD.md` 참조)

- [ ] 팀원 늘어나면 시크릿 공유 도구(1Password 등) 결정
- [ ] 오프라인 지원 요구사항이 실제로 나오면 PWA 오프라인 전략 논의
