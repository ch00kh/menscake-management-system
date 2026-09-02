import * as React from "react"
import { BellIcon, MoonIcon, SearchIcon, SunIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  PALETTES,
  useTheme,
  type Palette,
  type Theme,
} from "@/components/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AppSidebar } from "@/app/app-sidebar"
import { useTabStore } from "@/app/tab-context"
import { TabStoreProvider } from "@/app/tab-store"
import { TabWorkspace } from "@/app/tab-workspace"
import { MENU_PREFIX_LENGTH } from "@/app/menu"
import { resolveTab } from "@/app/tab-resolve"
import { layoutGroups, layouts } from "@/layouts/registry"

export function AppShell() {
  const [searchOpen, setSearchOpen] = React.useState(false)

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setSearchOpen((value) => !value)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  // 플로팅 사이드바 카드 주변 여백에 헤더와 같은 색이 깔리게 한다.
  return (
    <SidebarProvider className="bg-tab-strip">
      <TabStoreProvider>
        <AppSidebar />
        <SidebarInset className="bg-tab-strip flex h-svh min-h-0 flex-col overflow-hidden">
          <AppHeader onOpenSearch={() => setSearchOpen(true)} />
          <TabWorkspace />
        </SidebarInset>
        <LayoutSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      </TabStoreProvider>
    </SidebarProvider>
  )
}

function AppHeader({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { activePath } = useTabStore()
  const { theme, setTheme, palette, setPalette } = useTheme()
  const trail = resolveTab(activePath)?.trail ?? []

  return (
    <header className="bg-tab-strip flex h-14 shrink-0 items-center gap-2 px-3">
      <SidebarTrigger />
      <Breadcrumb className="min-w-0">
        <BreadcrumbList className="flex-nowrap">
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1
            // 고정 접두부(환경설정 > 레이아웃)는 좁은 화면에서 접는다.
            const collapsible = index < MENU_PREFIX_LENGTH && trail.length > 2
            return (
              <React.Fragment key={crumb}>
                {index > 0 && (
                  <BreadcrumbSeparator
                    className={collapsible ? "hidden md:block" : undefined}
                  />
                )}
                <BreadcrumbItem className={collapsible ? "hidden md:flex" : undefined}>
                  <BreadcrumbPage
                    className={cn(
                      "truncate",
                      !isLast && "font-normal text-muted-foreground"
                    )}
                  >
                    {crumb}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ms-auto flex shrink-0 items-center gap-2">
        {/* 단축키 표시는 검색 버튼 안에 둔다 (목업의 별도 kbd 배지 대신). */}
        <Button
          variant="outline"
          size="sm"
          className="text-muted-foreground"
          onClick={onOpenSearch}
        >
          <SearchIcon data-icon="inline-start" />
          레이아웃 찾기
          <KbdGroup className="ms-2 hidden sm:flex">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="알림"
                className="relative"
              />
            }
          >
            <BellIcon />
            {/* 읽지 않은 알림 표시. 실제 카운트는 백엔드 붙일 때 연결한다. */}
            <span className="absolute end-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
          </TooltipTrigger>
          <TooltipContent side="bottom">알림</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label="테마" />
            }
          >
            <SunIcon className="hidden dark:block" />
            <MoonIcon className="block dark:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {/*
              DropdownMenuLabel(Base UI GroupLabel)은 부모 그룹과 자동으로 연결되므로
              Group / RadioGroup 안에 있어야 한다. Content 바로 밑에 두면 렌더가 깨진다.
            */}
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as Theme)}
            >
              <DropdownMenuLabel>밝기</DropdownMenuLabel>
              <DropdownMenuRadioItem value="light">라이트</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">다크</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                시스템 설정
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            <DropdownMenuRadioGroup
              value={palette}
              onValueChange={(value) => setPalette(value as Palette)}
            >
              <DropdownMenuLabel>색</DropdownMenuLabel>
              {PALETTES.map((item) => (
                <DropdownMenuRadioItem key={item.value} value={item.value}>
                  {/*
                    색점은 값을 복제하지 않는다. 해당 팔레트 클래스를 이 요소에
                    직접 걸면 --primary 가 그 팔레트 값으로 잡히고, bg-primary 가
                    그걸 읽는다. index.css 를 고치면 자동으로 따라간다.
                  */}
                  <span
                    className={cn(
                      "size-3 shrink-0 rounded-full bg-primary ring-1 ring-foreground/15",
                      `palette-${item.value}`
                    )}
                  />
                  {item.label}
                  <span className="ms-auto whitespace-nowrap text-xs text-muted-foreground">
                    {item.hint}
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Avatar className="size-7">
          <AvatarFallback className="text-xs">CH</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

function LayoutSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { openTab } = useTabStore()

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
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
                      layout.name + " " + layout.summary + " " + layout.useWhen
                    }
                    onSelect={() => {
                      openTab("/layouts/" + layout.slug)
                      onOpenChange(false)
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
  )
}
