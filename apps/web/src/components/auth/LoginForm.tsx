import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

import { ApiError, login } from "@/api/auth"
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
import { useAuthStore } from "@/hooks/useAuthStore"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setSubmitError(null)
    try {
      const auth = await login(email, password)
      setAuth(auth)
      navigate("/", { replace: true })
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : "로그인에 실패했습니다"
      )
    }
  })

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="login-email">이메일</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="login-email"
              type="email"
              placeholder="name@menscake.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <InputGroupAddon>
              <MailIcon className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
          <FieldError errors={[errors.email]} />
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="login-password">비밀번호</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호 입력"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <InputGroupAddon>
              <LockIcon className="text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-muted-foreground"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </InputGroupAddon>
          </InputGroup>
          <FieldError errors={[errors.password]} />
        </Field>
        <Field>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="size-4 rounded border-input" />
              로그인 상태 유지
            </label>
            <a href="#" className="underline-offset-4 hover:underline">
              비밀번호를 잊으셨나요?
            </a>
          </div>
        </Field>
        {submitError ? <FieldError>{submitError}</FieldError> : null}
        <Field>
          <Button
            type="submit"
            className="bg-teal-700 hover:bg-teal-800"
            disabled={isSubmitting}
          >
            로그인
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
