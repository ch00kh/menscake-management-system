import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type PageHeaderProps = {
  title: string
  description?: string
  breadcrumb?: string[]
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {breadcrumb && breadcrumb.length > 0 ? (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.map((crumb, i) => (
              <React.Fragment key={crumb}>
                <BreadcrumbItem>
                  {i === breadcrumb.length - 1 ? (
                    <BreadcrumbPage>{crumb}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href="#">{crumb}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {i < breadcrumb.length - 1 ? <BreadcrumbSeparator /> : null}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="truncate font-serif text-xl font-semibold tracking-tight">
            {title}
          </h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {children}
    </div>
  )
}

/** 패널/영역 상단의 얇은 제목 줄. */
export function PaneHeader({
  title,
  count,
  actions,
  className,
}: {
  title: string
  count?: number | string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex h-11 shrink-0 items-center justify-between gap-2 border-b px-3",
        className
      )}
    >
      <div className="flex min-w-0 items-baseline gap-2">
        <span className="truncate text-sm font-medium">{title}</span>
        {count !== undefined ? (
          <span className="text-xs text-muted-foreground tabular-nums">
            {count}
          </span>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-1">{actions}</div>
      ) : null}
    </div>
  )
}
