import { GalleryVerticalEndIcon } from "lucide-react"

import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm"

/**
 * `mustChangePassword===true`인 계정이 `RequireAuth`에 의해 강제로 도착하는 화면.
 * 셸 진입 전/밖의 독립 라우트라 `LoginPage`처럼 `src/pages/`에 둔다
 * (docs/rule/repo-structure.md).
 */
export function ChangePasswordPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6">
      <div className="flex w-full max-w-sm flex-col gap-8 rounded-3xl bg-card p-8 shadow-2xl">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          멘즈케이크
        </a>
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-xl font-bold">비밀번호를 변경해주세요</h1>
          <p className="text-sm text-muted-foreground">
            보안을 위해 다음 화면으로 진행하기 전에 비밀번호를 변경해야 합니다.
          </p>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  )
}
