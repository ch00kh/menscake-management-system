import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"

import { changePassword } from "@/api/accounts"
import { ApiError } from "@/api/auth"
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm"
import { useAuthStore } from "@/hooks/useAuthStore"

vi.mock("@/api/accounts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/api/accounts")>()
  return {
    ...actual,
    changePassword: vi.fn(),
  }
})

const mockedChangePassword = vi.mocked(changePassword)

function renderChangePasswordForm(initialEntries: string[] = ["/change-password"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/change-password" element={<ChangePasswordForm />} />
        <Route path="/" element={<div>홈 화면</div>} />
        <Route path="/orders" element={<div>원래 목적지 화면</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe("ChangePasswordForm", () => {
  beforeEach(() => {
    mockedChangePassword.mockReset()
    useAuthStore.setState({
      accessToken: "token",
      account: {
        id: 1,
        name: "관리자",
        email: "admin@menscake.com",
        role: "ADMIN",
        mustChangePassword: true,
      },
      permissions: [],
    })
  })

  it("성공 시 mustChangePassword를 false로 바꾸고 홈으로 이동한다", async () => {
    const user = userEvent.setup()
    mockedChangePassword.mockResolvedValue(undefined)

    renderChangePasswordForm()
    await user.type(screen.getByLabelText("현재 비밀번호"), "old-password")
    await user.type(screen.getByLabelText("새 비밀번호"), "new-password")
    await user.click(screen.getByRole("button", { name: "비밀번호 변경" }))

    expect(await screen.findByText("홈 화면")).toBeInTheDocument()
    expect(mockedChangePassword).toHaveBeenCalledWith({
      currentPassword: "old-password",
      newPassword: "new-password",
    })
    await waitFor(() => {
      expect(useAuthStore.getState().account?.mustChangePassword).toBe(false)
    })
  })

  it("리다이렉트로 실려온 원래 목적지가 있으면 그곳으로 이동한다", async () => {
    const user = userEvent.setup()
    mockedChangePassword.mockResolvedValue(undefined)

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/change-password",
            state: { from: { pathname: "/orders" } },
          },
        ]}
      >
        <Routes>
          <Route path="/change-password" element={<ChangePasswordForm />} />
          <Route path="/orders" element={<div>원래 목적지 화면</div>} />
        </Routes>
      </MemoryRouter>
    )
    await user.type(screen.getByLabelText("현재 비밀번호"), "old-password")
    await user.type(screen.getByLabelText("새 비밀번호"), "new-password")
    await user.click(screen.getByRole("button", { name: "비밀번호 변경" }))

    expect(await screen.findByText("원래 목적지 화면")).toBeInTheDocument()
  })

  it("실패 시 서버 에러 메시지를 보여준다", async () => {
    const user = userEvent.setup()
    mockedChangePassword.mockRejectedValue(
      new ApiError("현재 비밀번호가 올바르지 않습니다", 400)
    )

    renderChangePasswordForm()
    await user.type(screen.getByLabelText("현재 비밀번호"), "wrong-password")
    await user.type(screen.getByLabelText("새 비밀번호"), "new-password")
    await user.click(screen.getByRole("button", { name: "비밀번호 변경" }))

    expect(
      await screen.findByText("현재 비밀번호가 올바르지 않습니다")
    ).toBeInTheDocument()
    expect(useAuthStore.getState().account?.mustChangePassword).toBe(true)
  })

  it("빈 값으로 제출하면 API를 호출하지 않고 검증 에러를 보여준다", async () => {
    const user = userEvent.setup()

    renderChangePasswordForm()
    await user.click(screen.getByRole("button", { name: "비밀번호 변경" }))

    expect(
      await screen.findByText("현재 비밀번호를 입력해주세요")
    ).toBeInTheDocument()
    expect(mockedChangePassword).not.toHaveBeenCalled()
  })
})
