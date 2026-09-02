import * as React from "react"
import { MoonIcon, SearchIcon, SunIcon } from "lucide-react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/app-sidebar"
import { getLayout, layoutGroups, layouts } from "@/layouts/registry"

export function AppShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = React.useState(false)

  const current = getLayout(pathname.split("/")[2])

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-svh min-h-0 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-muted-foreground">
                  {current ? current.group : "레이아웃"}
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {current ? current.name : "전체 보기"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ms-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setOpen(true)}
            >
              <SearchIcon data-icon="inline-start" />
              레이아웃 찾기
              <KbdGroup className="ms-2 hidden sm:flex">
                <Kbd>Ctrl</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="테마 전환"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <SunIcon className="hidden dark:block" />
              <MoonIcon className="block dark:hidden" />
            </Button>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>

      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* cmdk는 Input/List/Item 이 Command 루트 안에 있어야 스토어를 찾는다. */}
        <Command>
          <CommandInput placeholder="레이아웃 이름 또는 용도로 검색" />
          <CommandList>
            <CommandEmpty>결과가 없습니다.</CommandEmpty>
            {layoutGroups.map((group) => (
              <CommandGroup key={group} heading={group}>
                {layouts
                  .filter((layout) => layout.group === group)
                  .map((layout) => (
                    <CommandItem
                      key={layout.slug}
                      value={
                        layout.name +
                        " " +
                        layout.summary +
                        " " +
                        layout.useWhen
                      }
                      onSelect={() => {
                        navigate("/layouts/" + layout.slug)
                        setOpen(false)
                      }}
                    >
                      <span className="w-6 text-xs text-muted-foreground tabular-nums">
                        {layout.no}
                      </span>
                      <span>{layout.name}</span>
                      {/* CommandShortcut 을 써야 CommandItem 의 숨은 체크 아이콘이
                          비활성화되어 요약문이 오른쪽에 정렬된다. */}
                      <CommandShortcut className="truncate tracking-normal">
                        {layout.summary}
                      </CommandShortcut>
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </SidebarProvider>
  )
}
