import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import {
  createAccount,
  deleteAccount,
  fetchAccounts,
  updateAccount,
  type AccountResponse,
  type Page,
} from "@/api/accounts"
import { ApiError } from "@/api/auth"
import {
  fetchAccountPermissions,
  fetchPermissionResources,
  updateAccountPermissions,
} from "@/api/permissions"
import { AccountManagementPage } from "@/pages/AccountManagementPage"
import { useAuthStore } from "@/hooks/useAuthStore"

vi.mock("@/api/accounts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/api/accounts")>()
  return {
    ...actual,
    fetchAccounts: vi.fn(),
    createAccount: vi.fn(),
    updateAccount: vi.fn(),
    deleteAccount: vi.fn(),
  }
})

vi.mock("@/api/permissions", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/api/permissions")>()
  return {
    ...actual,
    fetchPermissionResources: vi.fn(),
    fetchAccountPermissions: vi.fn(),
    updateAccountPermissions: vi.fn(),
  }
})

const mockedFetchAccounts = vi.mocked(fetchAccounts)
const mockedCreateAccount = vi.mocked(createAccount)
const mockedUpdateAccount = vi.mocked(updateAccount)
const mockedDeleteAccount = vi.mocked(deleteAccount)
const mockedFetchPermissionResources = vi.mocked(fetchPermissionResources)
const mockedFetchAccountPermissions = vi.mocked(fetchAccountPermissions)
const mockedUpdateAccountPermissions = vi.mocked(updateAccountPermissions)

function page(content: AccountResponse[]): Page<AccountResponse> {
  return { content, totalElements: content.length, totalPages: 1, number: 0, size: 20 }
}

const STAFF_ACCOUNT: AccountResponse = {
  id: 2,
  email: "staff@menscake.com",
  name: "홍길동",
  role: "STAFF",
  isActive: true,
  mustChangePassword: false,
  createdAt: "2026-01-01T00:00:00Z",
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <AccountManagementPage />
    </QueryClientProvider>
  )
}

describe("AccountManagementPage", () => {
  beforeEach(() => {
    mockedFetchAccounts.mockReset()
    mockedCreateAccount.mockReset()
    mockedUpdateAccount.mockReset()
    mockedDeleteAccount.mockReset()
    mockedFetchPermissionResources.mockReset()
    mockedFetchAccountPermissions.mockReset()
    mockedUpdateAccountPermissions.mockReset()
    useAuthStore.setState({
      accessToken: "token",
      account: {
        id: 1,
        name: "관리자",
        email: "admin@menscake.com",
        role: "ADMIN",
        mustChangePassword: false,
      },
      permissions: [],
    })
  })

  it("목록을 조회해 보여준다", async () => {
    mockedFetchAccounts.mockResolvedValue(page([STAFF_ACCOUNT]))

    renderPage()

    expect(await screen.findByText("홍길동")).toBeInTheDocument()
    expect(screen.getByText("staff@menscake.com")).toBeInTheDocument()
    expect(mockedFetchAccounts).toHaveBeenCalledWith({ page: 0, size: 20 })
  })

  it("검색/필터 조건을 적용해 다시 조회한다", async () => {
    const user = userEvent.setup()
    mockedFetchAccounts.mockResolvedValue(page([]))

    renderPage()
    await waitFor(() => expect(mockedFetchAccounts).toHaveBeenCalledTimes(1))

    await user.type(screen.getByPlaceholderText("이름 · 이메일 검색"), "홍길동")
    await user.selectOptions(screen.getByLabelText("역할 필터"), "STAFF")
    await user.selectOptions(screen.getByLabelText("활성상태 필터"), "true")
    await user.click(screen.getByRole("button", { name: "조회" }))

    await waitFor(() => {
      expect(mockedFetchAccounts).toHaveBeenLastCalledWith({
        query: "홍길동",
        role: "STAFF",
        isActive: true,
        page: 0,
        size: 20,
      })
    })
  })

  it("계정을 생성하면 목록을 다시 불러오고 다이얼로그를 닫는다", async () => {
    const user = userEvent.setup()
    mockedFetchAccounts.mockResolvedValue(page([]))
    mockedCreateAccount.mockResolvedValue({
      ...STAFF_ACCOUNT,
      id: 3,
      email: "new@menscake.com",
    })

    renderPage()
    await waitFor(() => expect(mockedFetchAccounts).toHaveBeenCalledTimes(1))

    await user.click(screen.getByRole("button", { name: "신규 등록" }))
    await user.type(screen.getByLabelText("이메일"), "new@menscake.com")
    await user.type(screen.getByLabelText("이름"), "신규직원")
    await user.selectOptions(screen.getByLabelText("역할"), "MANAGER")
    await user.type(screen.getByLabelText("초기 비밀번호"), "initial-pw")
    await user.click(screen.getByRole("button", { name: "저장" }))

    await waitFor(() => {
      expect(mockedCreateAccount).toHaveBeenCalledWith({
        email: "new@menscake.com",
        name: "신규직원",
        role: "MANAGER",
        password: "initial-pw",
      })
    })
    await waitFor(() => {
      expect(screen.queryByLabelText("이메일")).not.toBeInTheDocument()
    })
    await waitFor(() => expect(mockedFetchAccounts).toHaveBeenCalledTimes(2))
  })

  it("이메일이 중복되면 이메일 필드에 에러를 보여준다", async () => {
    const user = userEvent.setup()
    mockedFetchAccounts.mockResolvedValue(page([]))
    mockedCreateAccount.mockRejectedValue(
      new ApiError("이미 사용 중인 이메일입니다", 409)
    )

    renderPage()
    await waitFor(() => expect(mockedFetchAccounts).toHaveBeenCalledTimes(1))

    await user.click(screen.getByRole("button", { name: "신규 등록" }))
    await user.type(screen.getByLabelText("이메일"), "dup@menscake.com")
    await user.type(screen.getByLabelText("이름"), "중복직원")
    await user.type(screen.getByLabelText("초기 비밀번호"), "initial-pw")
    await user.click(screen.getByRole("button", { name: "저장" }))

    expect(
      await screen.findByText("이미 사용 중인 이메일입니다")
    ).toBeInTheDocument()
  })

  it("계정을 수정하면 변경된 필드로 업데이트를 호출한다", async () => {
    const user = userEvent.setup()
    mockedFetchAccounts.mockResolvedValue(page([STAFF_ACCOUNT]))
    mockedUpdateAccount.mockResolvedValue({ ...STAFF_ACCOUNT, name: "홍길순" })

    renderPage()
    expect(await screen.findByText("홍길동")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "홍길동 수정" }))
    const nameInput = await screen.findByLabelText("이름")
    await user.clear(nameInput)
    await user.type(nameInput, "홍길순")
    await user.click(screen.getByRole("button", { name: "저장" }))

    await waitFor(() => {
      expect(mockedUpdateAccount).toHaveBeenCalledWith(STAFF_ACCOUNT.id, {
        name: "홍길순",
        role: "STAFF",
        isActive: true,
        password: undefined,
      })
    })
  })

  it("삭제를 확인하면 계정을 삭제한다", async () => {
    const user = userEvent.setup()
    mockedFetchAccounts.mockResolvedValue(page([STAFF_ACCOUNT]))
    mockedDeleteAccount.mockResolvedValue(undefined)

    renderPage()
    expect(await screen.findByText("홍길동")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "홍길동 삭제" }))
    const dialog = await screen.findByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "삭제" }))

    await waitFor(() => {
      expect(mockedDeleteAccount).toHaveBeenCalledWith(STAFF_ACCOUNT.id)
    })
  })

  it("본인 계정은 삭제 버튼이 비활성화된다", async () => {
    useAuthStore.setState({
      accessToken: "token",
      account: {
        id: STAFF_ACCOUNT.id,
        name: "홍길동",
        email: "staff@menscake.com",
        role: "STAFF",
        mustChangePassword: false,
      },
      permissions: [],
    })
    mockedFetchAccounts.mockResolvedValue(page([STAFF_ACCOUNT]))

    renderPage()
    expect(await screen.findByText("홍길동")).toBeInTheDocument()

    expect(screen.getByRole("button", { name: "홍길동 삭제" })).toBeDisabled()
  })

  it("permissions:READ 권한이 없으면 권한 버튼을 보여주지 않는다", async () => {
    mockedFetchAccounts.mockResolvedValue(page([STAFF_ACCOUNT]))

    renderPage()
    expect(await screen.findByText("홍길동")).toBeInTheDocument()

    expect(
      screen.queryByRole("button", { name: "홍길동 권한" })
    ).not.toBeInTheDocument()
  })

  it("permissions:READ만 있으면 권한 버튼을 보여주되 매트릭스는 조회 전용이다", async () => {
    const user = userEvent.setup()
    useAuthStore.setState({
      accessToken: "token",
      account: {
        id: 1,
        name: "관리자",
        email: "admin@menscake.com",
        role: "ADMIN",
        mustChangePassword: false,
      },
      permissions: [
        {
          resource: "permissions",
          canCreate: false,
          canRead: true,
          canUpdate: false,
          canDelete: false,
        },
      ],
    })
    mockedFetchAccounts.mockResolvedValue(page([STAFF_ACCOUNT]))
    mockedFetchPermissionResources.mockResolvedValue([
      { key: "accounts", label: "계정 관리" },
      { key: "permissions", label: "권한 관리" },
    ])
    mockedFetchAccountPermissions.mockResolvedValue([])

    renderPage()
    expect(await screen.findByText("홍길동")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "홍길동 권한" }))

    await waitFor(() => {
      expect(mockedFetchPermissionResources).toHaveBeenCalled()
      expect(mockedFetchAccountPermissions).toHaveBeenCalledWith(
        STAFF_ACCOUNT.id
      )
    })

    const readCheckbox = await screen.findByRole("checkbox", {
      name: "계정 관리 조회",
    })
    expect(readCheckbox).toBeChecked()
    expect(readCheckbox).toHaveAttribute("aria-disabled", "true")
    expect(screen.getByRole("button", { name: "저장" })).toBeDisabled()
  })

  it("permissions:UPDATE까지 있으면 매트릭스를 편집해 저장할 수 있다", async () => {
    const user = userEvent.setup()
    useAuthStore.setState({
      accessToken: "token",
      account: {
        id: 1,
        name: "관리자",
        email: "admin@menscake.com",
        role: "ADMIN",
        mustChangePassword: false,
      },
      permissions: [
        {
          resource: "permissions",
          canCreate: false,
          canRead: true,
          canUpdate: true,
          canDelete: false,
        },
      ],
    })
    mockedFetchAccounts.mockResolvedValue(page([STAFF_ACCOUNT]))
    mockedFetchPermissionResources.mockResolvedValue([
      { key: "accounts", label: "계정 관리" },
      { key: "permissions", label: "권한 관리" },
    ])
    mockedFetchAccountPermissions.mockResolvedValue([])
    mockedUpdateAccountPermissions.mockResolvedValue([])

    renderPage()
    expect(await screen.findByText("홍길동")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "홍길동 권한" }))

    const createCheckbox = await screen.findByRole("checkbox", {
      name: "계정 관리 생성",
    })
    expect(createCheckbox).not.toBeChecked()
    await user.click(createCheckbox)
    expect(createCheckbox).toBeChecked()

    await user.click(screen.getByRole("button", { name: "저장" }))

    await waitFor(() => {
      expect(mockedUpdateAccountPermissions).toHaveBeenCalledWith(
        STAFF_ACCOUNT.id,
        [
          {
            resource: "accounts",
            canCreate: true,
            canRead: true,
            canUpdate: false,
            canDelete: false,
          },
          {
            resource: "permissions",
            canCreate: false,
            canRead: true,
            canUpdate: false,
            canDelete: false,
          },
        ]
      )
    })
  })
})
