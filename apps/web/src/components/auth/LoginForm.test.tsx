import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"

import { ApiError, login } from "@/api/auth"
import { LoginForm } from "@/components/auth/LoginForm"
import { useAuthStore } from "@/hooks/useAuthStore"

vi.mock("@/api/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/api/auth")>()
  return {
    ...actual,
    login: vi.fn(),
  }
})

const mockedLogin = vi.mocked(login)

function renderLoginForm() {
  return render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  )
}

describe("LoginForm", () => {
  beforeEach(() => {
    mockedLogin.mockReset()
    useAuthStore.setState({ accessToken: null, account: null, permissions: [] })
  })

  it("로그인 성공 시 인증 스토어를 채운다", async () => {
    const user = userEvent.setup()
    mockedLogin.mockResolvedValue({
      accessToken: "token",
      account: {
        id: 1,
        name: "관리자",
        email: "admin@menscake.com",
        role: "ADMIN",
      },
      permissions: [],
    })

    renderLoginForm()
    await user.type(screen.getByLabelText("이메일"), "admin@menscake.com")
    await user.type(screen.getByLabelText("비밀번호"), "password123")
    await user.click(screen.getByRole("button", { name: "로그인" }))

    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe("token")
    })
    expect(mockedLogin).toHaveBeenCalledWith(
      "admin@menscake.com",
      "password123"
    )
  })

  it("로그인 실패 시 서버 에러 메시지를 보여준다", async () => {
    const user = userEvent.setup()
    mockedLogin.mockRejectedValue(
      new ApiError("이메일 또는 비밀번호가 올바르지 않습니다", 401)
    )

    renderLoginForm()
    await user.type(screen.getByLabelText("이메일"), "admin@menscake.com")
    await user.type(screen.getByLabelText("비밀번호"), "wrong-password")
    await user.click(screen.getByRole("button", { name: "로그인" }))

    expect(
      await screen.findByText("이메일 또는 비밀번호가 올바르지 않습니다")
    ).toBeInTheDocument()
    expect(useAuthStore.getState().accessToken).toBeNull()
  })

  it("빈 값으로 제출하면 API를 호출하지 않고 검증 에러를 보여준다", async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.click(screen.getByRole("button", { name: "로그인" }))

    expect(await screen.findByText("이메일을 입력해주세요")).toBeInTheDocument()
    expect(mockedLogin).not.toHaveBeenCalled()
  })
})
