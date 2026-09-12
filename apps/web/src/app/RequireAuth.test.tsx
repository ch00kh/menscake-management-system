import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"

import { refresh } from "@/api/auth"
import { RequireAuth } from "@/app/RequireAuth"
import { useAuthStore } from "@/hooks/useAuthStore"

vi.mock("@/api/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/api/auth")>()
  return {
    ...actual,
    refresh: vi.fn(),
  }
})

const mockedRefresh = vi.mocked(refresh)

function renderGuarded() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/login" element={<div>로그인 화면</div>} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <div>보호된 화면</div>
            </RequireAuth>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe("RequireAuth", () => {
  beforeEach(() => {
    mockedRefresh.mockReset()
    useAuthStore.setState({ accessToken: null, account: null, permissions: [] })
  })

  it("이미 인증된 상태면 refresh를 호출하지 않고 바로 렌더링한다", async () => {
    useAuthStore.setState({
      accessToken: "token",
      account: {
        id: 1,
        name: "관리자",
        email: "admin@menscake.com",
        role: "ADMIN",
      },
      permissions: [],
    })

    renderGuarded()

    expect(await screen.findByText("보호된 화면")).toBeInTheDocument()
    expect(mockedRefresh).not.toHaveBeenCalled()
  })

  it("refresh가 성공하면 세션을 복구하고 렌더링한다", async () => {
    mockedRefresh.mockResolvedValue({
      accessToken: "restored-token",
      account: {
        id: 1,
        name: "관리자",
        email: "admin@menscake.com",
        role: "ADMIN",
      },
      permissions: [],
    })

    renderGuarded()

    expect(await screen.findByText("보호된 화면")).toBeInTheDocument()
    expect(useAuthStore.getState().accessToken).toBe("restored-token")
  })

  it("refresh가 실패하면 /login으로 리다이렉트한다", async () => {
    mockedRefresh.mockRejectedValue(new Error("no session"))

    renderGuarded()

    expect(await screen.findByText("로그인 화면")).toBeInTheDocument()
  })
})
