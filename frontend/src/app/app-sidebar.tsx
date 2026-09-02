import * as React from "react"
import {
  BarChart3Icon,
  ChevronRightIcon,
  FileEditIcon,
  FileTextIcon,
  LayoutGridIcon,
  ListIcon,
  NetworkIcon,
  WorkflowIcon,
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { MENU_LAYOUTS, MENU_ROOT } from "@/app/menu"
import { layoutGroups, layouts, type LayoutGroup } from "@/layouts/registry"
const GROUP_ICON: Record<LayoutGroup, typeof ListIcon> = {
  "목록 · 검색": ListIcon,
  "상세 · 편집": FileTextIcon,
  "입력 · 폼": FileEditIcon,
  "분석 · 대시보드": BarChart3Icon,
  "프로세스 · 워크플로": WorkflowIcon,
  "마스터 · 구조": NetworkIcon,
}
/** 4단계까지 중첩되므로 기본 들여쓰기로는 폭이 부족하다. 단계별로 좁혀 쓴다. */
const SUB_L2 = "mx-2 px-2"
const SUB_NESTED = "mx-1 px-1"
export function AppSidebar() {
  const { pathname } = useLocation()
  const activeGroup = layouts.find(
    (layout) => pathname === "/layouts/" + layout.slug
  )?.group
  const [openGroups, setOpenGroups] = React.useState<
    Partial<Record<LayoutGroup, boolean>>
  >(() => (activeGroup ? { [activeGroup]: true } : {}))
  // 다른 그룹의 레이아웃으로 이동하면 해당 그룹을 자동으로 펼친다.
  // (사용자가 직접 접은 그룹은 그대로 두기 위해 렌더 중 보정 패턴을 사용한다.)
  const [lastActiveGroup, setLastActiveGroup] = React.useState(activeGroup)
  if (activeGroup !== lastActiveGroup) {
    setLastActiveGroup(activeGroup)
    if (activeGroup) {
      setOpenGroups((prev) => ({ ...prev, [activeGroup]: true }))
    }
  }
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="레이아웃 갤러리"
              render={<NavLink to="/" />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <LayoutGridIcon className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-serif font-semibold">ERP Layouts</span>
                <span className="text-xs text-muted-foreground">
                  {layouts.length}종 · shadcn/ui
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* 1단계: 환경설정 */}
              <Collapsible defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={<SidebarMenuButton tooltip={MENU_ROOT.label} />}
                  >
                    <MENU_ROOT.icon />
                    <span>{MENU_ROOT.label}</span>
                    <ChevronRightIcon className="ms-auto transition-transform group-data-panel-open/menu-button:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className={SUB_L2}>
                      {/* 2단계: 레이아웃 */}
                      <Collapsible defaultOpen>
                        <SidebarMenuSubItem>
                          <CollapsibleTrigger
                            render={
                              <SidebarMenuSubButton
                                className="group/layouts w-full cursor-pointer"
                                render={<button type="button" />}
                              />
                            }
                          >
                            <MENU_LAYOUTS.icon />
                            <span>{MENU_LAYOUTS.label}</span>
                            <ChevronRightIcon className="ms-auto transition-transform group-data-panel-open/layouts:rotate-90" />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub className={SUB_NESTED}>
                              {/* 3단계: 레이아웃 그룹 */}
                              {layoutGroups.map((group) => {
                                const Icon = GROUP_ICON[group]
                                const items = layouts.filter(
                                  (layout) => layout.group === group
                                )
                                return (
                                  <Collapsible
                                    key={group}
                                    open={openGroups[group] ?? false}
                                    onOpenChange={(open) =>
                                      setOpenGroups((prev) => ({
                                        ...prev,
                                        [group]: open,
                                      }))
                                    }
                                  >
                                    <SidebarMenuSubItem>
                                      <CollapsibleTrigger
                                        render={
                                          <SidebarMenuSubButton
                                            className="group/group w-full cursor-pointer"
                                            render={<button type="button" />}
                                          />
                                        }
                                      >
                                        <Icon />
                                        <span className="truncate">
                                          {group}
                                        </span>
                                        <ChevronRightIcon className="ms-auto transition-transform group-data-panel-open/group:rotate-90" />
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        {/* 4단계: 레이아웃 항목 */}
                                        <SidebarMenuSub className={SUB_NESTED}>
                                          {items.map((layout) => (
                                            <SidebarMenuSubItem
                                              key={layout.slug}
                                            >
                                              <SidebarMenuSubButton
                                                size="sm"
                                                isActive={
                                                  pathname ===
                                                  "/layouts/" + layout.slug
                                                }
                                                render={
                                                  <NavLink
                                                    to={
                                                      "/layouts/" + layout.slug
                                                    }
                                                  />
                                                }
                                              >
                                                <span className="truncate">
                                                  {layout.name}
                                                </span>
                                                <span className="ms-auto shrink-0 text-xs text-muted-foreground tabular-nums">
                                                  {layout.no}
                                                </span>
                                              </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                          ))}
                                        </SidebarMenuSub>
                                      </CollapsibleContent>
                                    </SidebarMenuSubItem>
                                  </Collapsible>
                                )
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuSubItem>
                      </Collapsible>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="전체 보기" render={<NavLink to="/" />}>
              <LayoutGridIcon />
              <span>전체 레이아웃</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
