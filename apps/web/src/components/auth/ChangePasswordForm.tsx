import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { LockIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import { z } from "zod"

import { changePassword } from "@/api/accounts"
import { ApiError } from "@/api/auth"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import type { RequireAuthLocationState } from "@/app/RequireAuth"
import { useAuthStore } from "@/hooks/useAuthStore"

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요"),
  newPassword: z.string().min(1, "새 비밀번호를 입력해주세요"),
})

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

/**
 * 다음 로그인 시 비밀번호 변경이 강제된 계정(`mustChangePassword===true`)이 쓰는 폼.
 * 성공하면 스토어의 `mustChangePassword`를 `false`로 되돌리고, `RequireAuth`가
 * 리다이렉트하며 실어 보낸 원래 목적지(없으면 홈)로 이동한다.
 */
export function ChangePasswordForm() {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const setMustChangePassword = useAuthStore(
    (state) => state.setMustChangePassword
  )
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = handleSubmit(async ({ currentPassword, newPassword }) => {
    setSubmitError(null)
    try {
      await changePassword({ currentPassword, newPassword })
      setMustChangePassword(false)
      const state = location.state as RequireAuthLocationState | null
      navigate(state?.from?.pathname ?? "/", { replace: true })
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : "비밀번호 변경에 실패했습니다"
      )
    }
  })

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.currentPassword}>
          <FieldLabel htmlFor="change-password-current">
            현재 비밀번호
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="change-password-current"
              type="password"
              placeholder="현재 비밀번호 입력"
              aria-invalid={!!errors.currentPassword}
              {...register("currentPassword")}
            />
            <InputGroupAddon>
              <LockIcon className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
          <FieldError errors={[errors.currentPassword]} />
        </Field>
        <Field data-invalid={!!errors.newPassword}>
          <FieldLabel htmlFor="change-password-new">새 비밀번호</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="change-password-new"
              type="password"
              placeholder="새 비밀번호 입력"
              aria-invalid={!!errors.newPassword}
              {...register("newPassword")}
            />
            <InputGroupAddon>
              <LockIcon className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
          <FieldError errors={[errors.newPassword]} />
        </Field>
        {submitError ? <FieldError>{submitError}</FieldError> : null}
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            비밀번호 변경
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
