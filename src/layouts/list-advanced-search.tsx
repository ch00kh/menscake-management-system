import { ChevronDownIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Separator } from "@/components/ui/separator"
import { Page, Surface } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { RecordTable, TableFooterBar } from "@/components/erp/record-table"
import { CATEGORIES, OWNERS, STATUSES } from "@/data/mock"

export function ListAdvancedSearch() {
  return (
    <Page>
      <PageHeader
        breadcrumb={["업무", "상세 조회"]}
        title="상세 조회"
        description="조건이 많은 화면. 기본 조건은 항상 노출하고 나머지는 접어 둡니다."
      />
      <Collapsible defaultOpen className="rounded-lg border bg-card">
        <div className="flex flex-col gap-4 p-4">
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="s-code">문서번호</FieldLabel>
              <Input id="s-code" placeholder="DOC-2026-0000" />
            </Field>
            <Field>
              <FieldLabel htmlFor="s-name">명칭</FieldLabel>
              <Input id="s-name" placeholder="포함되는 단어" />
            </Field>
            <Field>
              <FieldLabel htmlFor="s-status">상태</FieldLabel>
              <NativeSelect id="s-status" className="w-full">
                <NativeSelectOption value="">전체</NativeSelectOption>
                {STATUSES.map((s) => (
                  <NativeSelectOption key={s} value={s}>
                    {s}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          </FieldGroup>
          <CollapsibleContent>
            <Separator className="mb-4" />
            <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="s-category">구분</FieldLabel>
                <NativeSelect id="s-category" className="w-full">
                  <NativeSelectOption value="">전체</NativeSelectOption>
                  {CATEGORIES.map((c) => (
                    <NativeSelectOption key={c} value={c}>
                      {c}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor="s-owner">담당자</FieldLabel>
                <NativeSelect id="s-owner" className="w-full">
                  <NativeSelectOption value="">전체</NativeSelectOption>
                  {OWNERS.map((o) => (
                    <NativeSelectOption key={o} value={o}>
                      {o}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor="s-from">등록일</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input id="s-from" type="date" />
                  <span className="text-muted-foreground">~</span>
                  <Input aria-label="종료일" type="date" />
                </div>
              </Field>
            </FieldGroup>
          </CollapsibleContent>
          <div className="flex items-center justify-between gap-2">
            <CollapsibleTrigger
              render={
                <Button variant="ghost" size="sm">
                  상세 조건
                  <ChevronDownIcon data-icon="inline-end" />
                </Button>
              }
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                초기화
              </Button>
              <Button size="sm">
                <SearchIcon data-icon="inline-start" />
                조회
              </Button>
            </div>
          </div>
        </div>
      </Collapsible>
      <Surface>
        <RecordTable />
        <TableFooterBar />
      </Surface>
    </Page>
  )
}
