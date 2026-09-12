import { logout, refresh } from "@/api/auth"
import { authorizedFetch } from "@/api/http"
import { useAuthStore } from "@/hooks/useAuthStore"

vi.mock("@/api/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/api/auth")>()
  return {
    ...actual,
    refresh: vi.fn(),
    logout: vi.fn(),
  }
})

const mockedRefresh = vi.mocked(refresh)
const mockedLogout = vi.mocked(logout)
const fetchMock = vi.fn()

describe("authorizedFetch", () => {
  beforeEach(() => {
    mockedRefresh.mockReset()
    mockedLogout.mockReset()
    mockedLogout.mockResolvedValue(undefined)
    fetchMock.mockReset()
    vi.stubGlobal("fetch", fetchMock)
    useAuthStore.setState({
      accessToken: "old-token",
      account: null,
      permissions: [],
    })
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, assign: vi.fn() },
    })
  })

  it("정상 응답이면 그대로 반환한다", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }))

    const response = await authorizedFetch("/api/orders")

    expect(response.status).toBe(200)
    expect(mockedRefresh).not.toHaveBeenCalled()
  })

  it("401을 받으면 refresh 후 새 토큰으로 재시도한다", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
    mockedRefresh.mockResolvedValue({
      accessToken: "new-token",
      account: {
        id: 1,
        name: "관리자",
        email: "admin@menscake.com",
        role: "ADMIN",
        mustChangePassword: false,
      },
      permissions: [],
    })

    const response = await authorizedFetch("/api/orders")

    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(useAuthStore.getState().accessToken).toBe("new-token")

    const secondCallInit = fetchMock.mock.calls[1][1] as RequestInit
    const headers = secondCallInit.headers as Record<string, string>
    expect(headers.Authorization).toBe("Bearer new-token")
  })

  it("refresh도 실패하면 로그아웃 처리 후 /login으로 보낸다", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }))
    mockedRefresh.mockRejectedValue(new Error("no session"))

    await authorizedFetch("/api/orders")

    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(mockedLogout).toHaveBeenCalled()
    expect(window.location.assign).toHaveBeenCalledWith("/login")
  })
})
