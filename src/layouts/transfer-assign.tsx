import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SaveIcon,
  SearchIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FullPage } from "@/components/erp/page"
import { PaneHeader } from "@/components/erp/page-header"
import { rows } from "@/data/mock"

const available = rows.slice(0, 10)
const assigned = rows.slice(10, 16)

function TransferList({
  title,
  items,
  count,
}: {
  title: string
  items: typeof rows
  count: string
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-lg border bg-card">
      <PaneHeader title={title} count={count} />
      <div className="border-b p-2">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="검색" />
        </InputGroup>
      </div>
      <ScrollArea className="h-96 flex-1">
        <div className="flex flex-col p-1">
          {items.map((item) => (
            <Field
              key={item.id}
              orientation="horizontal"
              className="rounded-md px-2 py-1.5 hover:bg-accent/50"
            >
              <Checkbox id={title + item.id} />
              <FieldLabel htmlFor={title + item.id} className="min-w-0 flex-1">
                <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <span className="truncate">{item.name}</span>
                  <Badge variant="outline">{item.category}</Badge>
                </span>
              </FieldLabel>
            </Field>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export function TransferAssign() {
  return (
    <FullPage className="overflow-y-auto">
      <div className="flex flex-col gap-4 p-4 lg:p-6">
        <PaneHeader
          className="rounded-lg border bg-card px-3"
          title="권한 · 항목 배정"
          count="좌 → 우로 이동"
          actions={
            <Button size="sm">
              <SaveIcon data-icon="inline-start" />
              저장
            </Button>
          }
        />
        <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
          <TransferList
            title="선택 가능"
            items={available}
            count={available.length + "건"}
          />
          <ButtonGroup
            orientation="vertical"
            className="mx-auto lg:mx-0"
          >
            <Button variant="outline" size="icon-sm" aria-label="전체 이동">
              <ChevronsRightIcon />
            </Button>
            <Button variant="outline" size="icon-sm" aria-label="선택 이동">
              <ChevronRightIcon />
            </Button>
            <Button variant="outline" size="icon-sm" aria-label="선택 해제">
              <ChevronLeftIcon />
            </Button>
            <Button variant="outline" size="icon-sm" aria-label="전체 해제">
              <ChevronsLeftIcon />
            </Button>
          </ButtonGroup>
          <TransferList
            title="배정됨"
            items={assigned}
            count={assigned.length + "건"}
          />
        </div>
      </div>
    </FullPage>
  )
}
