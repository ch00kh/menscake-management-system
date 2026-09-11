import { useState } from "react"
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="login-email">이메일</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="login-email"
              type="email"
              placeholder="name@menscake.com"
              required
            />
            <InputGroupAddon>
              <MailIcon className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="login-password">비밀번호</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호 입력"
              required
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
        <Field>
          <Button type="submit" className="bg-teal-700 hover:bg-teal-800">
            로그인
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
