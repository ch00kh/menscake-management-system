import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  FilterIcon,
  KeyRoundIcon,
  PencilIcon,
  PlusIcon,
  RotateCcwIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  createAccount,
  deleteAccount,
  fetchAccounts,
  updateAccount,
  type AccountResponse,
  type AccountSearchParams,
} from "@/api/accounts"
import { ApiError, type Role } from "@/api/auth"
import {
  fetchAccountPermissions,
  fetchPermissionResources,
  updateAccountPermissions,
} from "@/api/permissions"
import { useAuthStore } from "@/hooks/useAuthStore"
import { hasPermission } from "@/lib/permissions"
import { buildPermissionMatrix, type PermissionRow } from "@/lib/permissionMatrix"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Page, Surface } from "@/components/erp/Page"
import { PageHeader } from "@/components/erp/PageHeader"

const ROLES = ["ADMIN", "MANAGER", "STAFF"] as const
const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "관리자",
  MANAGER: "매니저",
  STAFF: "직원",
}
const PAGE_SIZE = 20
const ACCOUNTS_QUERY_KEY = "accounts"

type ActiveFilter = "" | "true" | "false"

function apiErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback
}

/** 검색어/역할/활성상태 조건에 맞는 계정 목록을 검색·필터로 조회, 생성/수정/삭제하는 화면. */
export function AccountManagementPage() {
  const currentAccountId = useAuthStore((state) => state.account?.id)
  const permissions = useAuthStore((state) => state.permissions)
  const canReadPermissions = hasPermission(permissions, "permissions", "canRead")
  const canEditPermissions = hasPermission(
    permissions,
    "permissions",
    "canUpdate"
  )
  const queryClient = useQueryClient()

  const [queryInput, setQueryInput] = useState("")
  const [roleInput, setRoleInput] = useState<Role | "">("")
  const [activeInput, setActiveInput] = useState<ActiveFilter>("")
  const [appliedFilters, setAppliedFilters] = useState<AccountSearchParams>({})
  const [page, setPage] = useState(0)

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<AccountResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AccountResponse | null>(
    null
  )
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [permissionTarget, setPermissionTarget] =
    useState<AccountResponse | null>(null)

  const searchParams: AccountSearchParams = {
    ...appliedFilters,
    page,
    size: PAGE_SIZE,
  }

  const accountsQuery = useQuery({
    queryKey: [ACCOUNTS_QUERY_KEY, appliedFilters, page],
    queryFn: () => fetchAccounts(searchParams),
  })

  function invalidateAccounts() {
    return queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] })
  }

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAccount(id),
    onSuccess: () => {
      setDeleteTarget(null)
      setDeleteError(null)
      void invalidateAccounts()
    },
    onError: (error) => {
      setDeleteError(apiErrorMessage(error, "삭제에 실패했습니다"))
    },
  })

  function applyFilters() {
    setDeleteError(null)
    setAppliedFilters({
      query: queryInput.trim() || undefined,
      role: roleInput || undefined,
      isActive: activeInput === "" ? undefined : activeInput === "true",
    })
    setPage(0)
  }

  function resetFilters() {
    setQueryInput("")
    setRoleInput("")
    setActiveInput("")
    setAppliedFilters({})
    setPage(0)
  }

  const accounts = accountsQuery.data?.content ?? []
  const totalElements = accountsQuery.data?.totalElements ?? 0
  const totalPages = accountsQuery.data?.totalPages ?? 0

  return (
    <Page>
      <PageHeader
        breadcrumb={["환경설정", "계정 관리"]}
        title="계정 관리"
        description="직원 계정을 검색·조회하고 생성/수정/삭제합니다."
        actions={
          <CreateAccountDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            onCreated={() => {
              setCreateOpen(false)
              void invalidateAccounts()
            }}
          />
        }
      />

      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-2">
        <InputGroup className="w-full min-w-56 sm:w-72">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="이름 · 이메일 검색"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                applyFilters()
              }
            }}
          />
        </InputGroup>
        <NativeSelect
          size="sm"
          className="w-32"
          aria-label="역할 필터"
          value={roleInput}
          onChange={(event) =>
            setRoleInput(event.target.value as Role | "")
          }
        >
          <NativeSelectOption value="">전체 역할</NativeSelectOption>
          {ROLES.map((role) => (
            <NativeSelectOption key={role} value={role}>
              {ROLE_LABEL[role]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <NativeSelect
          size="sm"
          className="w-28"
          aria-label="활성상태 필터"
          value={activeInput}
          onChange={(event) =>
            setActiveInput(event.target.value as ActiveFilter)
          }
        >
          <NativeSelectOption value="">전체 상태</NativeSelectOption>
          <NativeSelectOption value="true">활성</NativeSelectOption>
          <NativeSelectOption value="false">비활성</NativeSelectOption>
        </NativeSelect>
        <div className="ms-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcwIcon data-icon="inline-start" />
            초기화
          </Button>
          <Button size="sm" onClick={applyFilters}>
            <FilterIcon data-icon="inline-start" />
            조회
          </Button>
        </div>
      </div>

      {accountsQuery.isError ? (
        <Alert variant="destructive">
          <AlertTitle>목록을 불러오지 못했습니다</AlertTitle>
          <AlertDescription>
            {apiErrorMessage(accountsQuery.error, "잠시 후 다시 시도해주세요")}
          </AlertDescription>
        </Alert>
      ) : null}

      {deleteError ? (
        <Alert variant="destructive">
          <AlertTitle>삭제에 실패했습니다</AlertTitle>
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      ) : null}

      <Surface>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이메일</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>역할</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>가입일</TableHead>
              <TableHead className="w-24 text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountsQuery.isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  불러오는 중...
                </TableCell>
              </TableRow>
            ) : accounts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  검색 결과가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => {
                const isSelf = account.id === currentAccountId
                return (
                  <TableRow key={account.id}>
                    <TableCell className="font-mono text-xs">
                      {account.email}
                    </TableCell>
                    <TableCell className="font-medium">
                      {account.name}
                    </TableCell>
                    <TableCell>{ROLE_LABEL[account.role]}</TableCell>
                    <TableCell>
                      <Badge variant={account.isActive ? "default" : "outline"}>
                        {account.isActive ? "활성" : "비활성"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(account.createdAt).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`${account.name} 수정`}
                          onClick={() => setEditTarget(account)}
                        >
                          <PencilIcon />
                        </Button>
                        {canReadPermissions ? (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`${account.name} 권한`}
                            onClick={() => setPermissionTarget(account)}
                          >
                            <KeyRoundIcon />
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`${account.name} 삭제`}
                          disabled={isSelf}
                          title={isSelf ? "본인 계정은 삭제할 수 없습니다" : undefined}
                          onClick={() => {
                            setDeleteError(null)
                            setDeleteTarget(account)
                          }}
                        >
                          <TrashIcon />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2">
          <p className="text-xs text-muted-foreground tabular-nums">
            총 {totalElements}건
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((current) => current - 1)}
            >
              이전
            </Button>
            <span className="text-xs text-muted-foreground tabular-nums">
              {totalPages === 0 ? 0 : page + 1} / {Math.max(totalPages, 1)}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              다음
            </Button>
          </div>
        </div>
      </Surface>

      <EditAccountSheet
        account={editTarget}
        currentAccountId={currentAccountId}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null)
        }}
        onUpdated={() => {
          setEditTarget(null)
          void invalidateAccounts()
        }}
      />

      <PermissionMatrixDialog
        account={permissionTarget}
        canEdit={canEditPermissions}
        onOpenChange={(open) => {
          if (!open) setPermissionTarget(null)
        }}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>계정을 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.name}({deleteTarget?.email}) 계정을 삭제합니다.
              되돌릴 수 없는 작업입니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deleteTarget) deleteMutation.mutate(deleteTarget.id)
              }}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  )
}

const createAccountSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  name: z.string().min(1, "이름을 입력해주세요"),
  role: z.enum(ROLES),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
})

type CreateAccountFormValues = z.infer<typeof createAccountSchema>

function CreateAccountDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { email: "", name: "", role: "STAFF", password: "" },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      await createAccount(values)
      reset()
      onCreated()
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setError("email", { message: "이미 사용 중인 이메일입니다" })
        return
      }
      if (error instanceof ApiError && error.errors?.length) {
        for (const fieldError of error.errors) {
          if (fieldError.field in ({} as CreateAccountFormValues)) {
            setError(fieldError.field as keyof CreateAccountFormValues, {
              message: fieldError.message,
            })
          }
        }
        return
      }
      setSubmitError(apiErrorMessage(error, "계정 생성에 실패했습니다"))
    }
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          reset()
          setSubmitError(null)
        }
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm">
            <PlusIcon data-icon="inline-start" />
            신규 등록
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>계정 신규 등록</DialogTitle>
          <DialogDescription>
            생성된 계정은 다음 로그인 시 비밀번호 변경이 강제됩니다.
          </DialogDescription>
        </DialogHeader>
        <form className="contents" onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="account-create-email">이메일</FieldLabel>
              <Input
                id="account-create-email"
                type="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="account-create-name">이름</FieldLabel>
              <Input
                id="account-create-name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field data-invalid={!!errors.role}>
              <FieldLabel htmlFor="account-create-role">역할</FieldLabel>
              <NativeSelect
                id="account-create-role"
                className="w-full"
                aria-invalid={!!errors.role}
                {...register("role")}
              >
                {ROLES.map((role) => (
                  <NativeSelectOption key={role} value={role}>
                    {ROLE_LABEL[role]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              <FieldError errors={[errors.role]} />
            </Field>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="account-create-password">
                초기 비밀번호
              </FieldLabel>
              <Input
                id="account-create-password"
                type="password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>
            {submitError ? <FieldError>{submitError}</FieldError> : null}
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">취소</Button>} />
            <Button type="submit" disabled={isSubmitting}>
              저장
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const editAccountSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  role: z.enum(ROLES),
  password: z.string().optional(),
})

type EditAccountFormValues = z.infer<typeof editAccountSchema>

function EditAccountSheet({
  account,
  currentAccountId,
  onOpenChange,
  onUpdated,
}: {
  account: AccountResponse | null
  currentAccountId: number | undefined
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}) {
  return (
    <Sheet open={!!account} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0">
        {account ? (
          <EditAccountForm
            key={account.id}
            account={account}
            isSelf={account.id === currentAccountId}
            onUpdated={onUpdated}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function EditAccountForm({
  account,
  isSelf,
  onUpdated,
}: {
  account: AccountResponse
  isSelf: boolean
  onUpdated: () => void
}) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  // Switch는 RHF의 watch()로 제어하지 않는다 — react-hook-form의 watch가 반환하는
  // 함수는 React Compiler가 메모이즈할 수 없어 경고가 발생한다. 토글 하나뿐이라
  // 별도 로컬 state로 다루는 편이 더 단순하다.
  const [isActive, setIsActive] = useState(account.isActive)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditAccountFormValues>({
    resolver: zodResolver(editAccountSchema),
    defaultValues: {
      name: account.name,
      role: account.role,
      password: "",
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      await updateAccount(account.id, {
        name: values.name,
        role: values.role,
        isActive,
        password: values.password ? values.password : undefined,
      })
      onUpdated()
    } catch (error) {
      setSubmitError(apiErrorMessage(error, "계정 수정에 실패했습니다"))
    }
  })

  return (
    <>
      <SheetHeader>
        <SheetTitle>계정 수정</SheetTitle>
        <SheetDescription>
          {account.name}({account.email}) 계정 정보를 수정합니다.
        </SheetDescription>
      </SheetHeader>
      <form
        className="flex flex-1 flex-col justify-between overflow-y-auto"
        onSubmit={onSubmit}
        noValidate
      >
        <div className="px-4">
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="account-edit-name">이름</FieldLabel>
              <Input
                id="account-edit-name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field data-invalid={!!errors.role}>
              <FieldLabel htmlFor="account-edit-role">역할</FieldLabel>
              <NativeSelect
                id="account-edit-role"
                className="w-full"
                aria-invalid={!!errors.role}
                {...register("role")}
              >
                {ROLES.map((role) => (
                  <NativeSelectOption key={role} value={role}>
                    {ROLE_LABEL[role]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              <FieldError errors={[errors.role]} />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="account-edit-active">
                활성 상태
              </FieldLabel>
              <Switch
                id="account-edit-active"
                checked={isActive}
                disabled={isSelf}
                onCheckedChange={(checked) =>
                  setIsActive(checked === true)
                }
              />
            </Field>
            {isSelf ? (
              <p className="text-xs text-muted-foreground">
                본인 계정은 비활성화할 수 없습니다.
              </p>
            ) : null}
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="account-edit-password">
                비밀번호 재설정
              </FieldLabel>
              <Input
                id="account-edit-password"
                type="password"
                placeholder="변경하려면 입력 (선택)"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>
            {submitError ? <FieldError>{submitError}</FieldError> : null}
          </FieldGroup>
        </div>
        <SheetFooter>
          <Button type="submit" disabled={isSubmitting}>
            저장
          </Button>
        </SheetFooter>
      </form>
    </>
  )
}

const PERMISSION_RESOURCES_QUERY_KEY = "permission-resources"
const ACCOUNT_PERMISSIONS_QUERY_KEY = "account-permissions"

type PermissionField = "canCreate" | "canRead" | "canUpdate" | "canDelete"

const PERMISSION_FIELDS: PermissionField[] = [
  "canCreate",
  "canRead",
  "canUpdate",
  "canDelete",
]
const PERMISSION_FIELD_LABEL: Record<PermissionField, string> = {
  canCreate: "생성",
  canRead: "조회",
  canUpdate: "수정",
  canDelete: "삭제",
}

function PermissionMatrixDialog({
  account,
  canEdit,
  onOpenChange,
}: {
  account: AccountResponse | null
  canEdit: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={!!account} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {account ? (
          <PermissionMatrixForm
            key={account.id}
            account={account}
            canEdit={canEdit}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function PermissionMatrixForm({
  account,
  canEdit,
  onClose,
}: {
  account: AccountResponse
  canEdit: boolean
  onClose: () => void
}) {
  const [rows, setRows] = useState<PermissionRow[] | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const resourcesQuery = useQuery({
    queryKey: [PERMISSION_RESOURCES_QUERY_KEY],
    queryFn: fetchPermissionResources,
  })
  const accountPermissionsQuery = useQuery({
    queryKey: [ACCOUNT_PERMISSIONS_QUERY_KEY, account.id],
    queryFn: () => fetchAccountPermissions(account.id),
  })

  const whitelist = resourcesQuery.data
  const savedRows = accountPermissionsQuery.data

  // 최초 로드시에만 매트릭스를 계산해 시드한다(렌더 중 상태 조정 — 이후 편집 중
  // 백그라운드 refetch가 일어나도(예: 창 포커스) 사용자가 체크해둔 값을 덮어쓰지 않는다).
  if (rows === null && whitelist && savedRows) {
    setRows(buildPermissionMatrix(whitelist, savedRows, account.role))
  }

  const saveMutation = useMutation({
    mutationFn: (items: PermissionRow[]) =>
      updateAccountPermissions(
        account.id,
        items.map(({ resource, canCreate, canRead, canUpdate, canDelete }) => ({
          resource,
          canCreate,
          canRead,
          canUpdate,
          canDelete,
        }))
      ),
    onSuccess: () => {
      setSubmitError(null)
      onClose()
    },
    onError: (error) => {
      setSubmitError(apiErrorMessage(error, "권한 저장에 실패했습니다"))
    },
  })

  function toggle(resource: string, field: PermissionField, checked: boolean) {
    setRows(
      (current) =>
        current?.map((row) =>
          row.resource === resource ? { ...row, [field]: checked } : row
        ) ?? null
    )
  }

  const isLoading =
    resourcesQuery.isLoading || accountPermissionsQuery.isLoading
  const isError = resourcesQuery.isError || accountPermissionsQuery.isError

  return (
    <>
      <DialogHeader>
        <DialogTitle>권한 관리</DialogTitle>
        <DialogDescription>
          {account.name}({account.email}) 계정의 리소스별 권한을 설정합니다.
          {canEdit ? null : " 조회 전용입니다."}
        </DialogDescription>
      </DialogHeader>

      {isError ? (
        <FieldError>
          {apiErrorMessage(
            resourcesQuery.error ?? accountPermissionsQuery.error,
            "권한 정보를 불러오지 못했습니다"
          )}
        </FieldError>
      ) : null}

      {isLoading || !rows ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          불러오는 중...
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>리소스</TableHead>
              {PERMISSION_FIELDS.map((field) => (
                <TableHead key={field} className="text-center">
                  {PERMISSION_FIELD_LABEL[field]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.resource}>
                <TableCell>
                  <div className="font-medium">{row.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {row.resource}
                  </div>
                </TableCell>
                {PERMISSION_FIELDS.map((field) => (
                  <TableCell key={field} className="text-center">
                    <Checkbox
                      aria-label={`${row.label} ${PERMISSION_FIELD_LABEL[field]}`}
                      checked={row[field]}
                      disabled={!canEdit}
                      onCheckedChange={(checked) =>
                        toggle(row.resource, field, checked === true)
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {submitError ? <FieldError>{submitError}</FieldError> : null}

      <DialogFooter>
        <DialogClose render={<Button variant="outline">닫기</Button>} />
        <Button
          disabled={!canEdit || !rows || saveMutation.isPending}
          title={canEdit ? undefined : "권한 수정 권한이 없습니다"}
          onClick={() => {
            if (rows) saveMutation.mutate(rows)
          }}
        >
          저장
        </Button>
      </DialogFooter>
    </>
  )
}
