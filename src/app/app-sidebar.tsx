import {
  BarChart3Icon,
  FileEditIcon,
  FileTextIcon,
  LayoutGridIcon,
  ListIcon,
  NetworkIcon,
  WorkflowIcon,
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { layoutGroups, layouts, type LayoutGroup } from "@/layouts/registry"

const GROUP_ICON: Record<LayoutGroup, typeof ListIcon> = {
  "목록 · 검색": ListIcon,
  "상세 · 편집": FileTextIcon,
  "입력 · 폼": FileEditIcon,
  "분석 · 대시보드": BarChart3Icon,
  "프로세스 · 워크플로": WorkflowIcon,
  "마스터 · 구조": NetworkIcon,
}

export function AppSidebar() {
  const { pathname } = useLocation()

  return (
    <Sidebar collapsible="icon">
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
                <span className="font-heading font-semibold">ERP Layouts</span>
                <span className="text-xs text-muted-foreground">
                  {layouts.length}종 · shadcn/ui
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {layoutGroups.map((group) => {
          const Icon = GROUP_ICON[group]
          const items = layouts.filter((layout) => layout.group === group)
          return (
            <SidebarGroup key={group}>
              <SidebarGroupLabel>
                <Icon className="me-1.5 size-3.5" />
                {group}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((layout) => (
                    <SidebarMenuItem key={layout.slug}>
                      <SidebarMenuButton
                        isActive={pathname === "/layouts/" + layout.slug}
                        tooltip={layout.name}
                        render={<NavLink to={"/layouts/" + layout.slug} />}
                      >
                        <Icon />
                        <span>{layout.name}</span>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>{layout.no}</SidebarMenuBadge>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
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
      <SidebarRail />
    </Sidebar>
  )
}
