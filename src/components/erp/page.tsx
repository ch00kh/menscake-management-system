import type * as React from "react"

import { cn } from "@/lib/utils"

/** 위아래로 스크롤되는 일반 업무 화면 컨테이너. */
export function Page({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-1 flex-col gap-4 p-4 lg:p-6", className)}>
      {children}
    </div>
  )
}

/** 화면 높이를 꽉 채우는 다중 패널 화면 컨테이너(내부에서 스크롤). */
export function FullPage({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      {children}
    </div>
  )
}

/** 테두리가 있는 카드형 표 영역. */
export function Surface({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-lg border bg-card",
        className
      )}
    >
      {children}
    </div>
  )
}
