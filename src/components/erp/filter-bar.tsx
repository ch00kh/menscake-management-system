import type * as React from "react"
import { FilterIcon, RotateCcwIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { CATEGORIES, OWNERS, STATUSES } from "@/data/mock"

/** 목록 화면 상단의 한 줄짜리 검색·필터 바. */
export function FilterBar({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-lg border bg-card p-2",
        className
      )}
    >
      <InputGroup className="w-full min-w-56 sm:w-72">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="코드 · 명칭 검색" />
      </InputGroup>
      <NativeSelect size="sm" className="w-32">
        <NativeSelectOption value="">전체 구분</NativeSelectOption>
        {CATEGORIES.map((c) => (
          <NativeSelectOption key={c} value={c}>
            {c}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <NativeSelect size="sm" className="w-28">
        <NativeSelectOption value="">전체 상태</NativeSelectOption>
        {STATUSES.map((s) => (
          <NativeSelectOption key={s} value={s}>
            {s}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      {children}
      <div className="ms-auto flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <RotateCcwIcon data-icon="inline-start" />
          초기화
        </Button>
        <Button size="sm">
          <FilterIcon data-icon="inline-start" />
          조회
        </Button>
      </div>
    </div>
  )
}

/** 좌측 세로 필터 패널 본문. */
export function FilterFields() {
  return (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="f-keyword">검색어</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput id="f-keyword" placeholder="코드 · 명칭" />
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="f-category">구분</FieldLabel>
        <NativeSelect id="f-category" className="w-full">
          <NativeSelectOption value="">전체</NativeSelectOption>
          {CATEGORIES.map((c) => (
            <NativeSelectOption key={c} value={c}>
              {c}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
      <Field>
        <FieldLabel htmlFor="f-owner">담당자</FieldLabel>
        <NativeSelect id="f-owner" className="w-full">
          <NativeSelectOption value="">전체</NativeSelectOption>
          {OWNERS.map((o) => (
            <NativeSelectOption key={o} value={o}>
              {o}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
      <Field>
        <FieldLabel htmlFor="f-status">상태</FieldLabel>
        <NativeSelect id="f-status" className="w-full">
          <NativeSelectOption value="">전체</NativeSelectOption>
          {STATUSES.map((s) => (
            <NativeSelectOption key={s} value={s}>
              {s}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
    </div>
  )
}
