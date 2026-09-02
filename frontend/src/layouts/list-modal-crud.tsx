import { PencilIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { FilterBar } from "@/components/erp/filter-bar"
import { Page, Surface } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { RecordTable, TableFooterBar } from "@/components/erp/record-table"
import { CATEGORIES, OWNERS } from "@/data/mock"

function EntryFields() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="m-name">명칭</FieldLabel>
        <Input id="m-name" placeholder="필수 입력" />
      </Field>
      <Field>
        <FieldLabel htmlFor="m-category">구분</FieldLabel>
        <NativeSelect id="m-category" className="w-full">
          {CATEGORIES.map((c) => (
            <NativeSelectOption key={c} value={c}>
              {c}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
      <Field>
        <FieldLabel htmlFor="m-owner">담당자</FieldLabel>
        <NativeSelect id="m-owner" className="w-full">
          {OWNERS.map((o) => (
            <NativeSelectOption key={o} value={o}>
              {o}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
      <Field>
        <FieldLabel htmlFor="m-note">비고</FieldLabel>
        <Textarea id="m-note" rows={3} />
      </Field>
    </FieldGroup>
  )
}

export function ListModalCrud() {
  return (
    <Page>
      <PageHeader
        breadcrumb={["기준정보", "코드 관리"]}
        title="코드 관리"
        description="화면 이동 없이 목록 위에서 등록·수정합니다. 짧은 폼은 모달, 긴 폼은 사이드 시트."
        actions={
          <>
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="outline" size="sm">
                    <PencilIcon data-icon="inline-start" />
                    시트로 수정
                  </Button>
                }
              />
              <SheetContent className="flex flex-col gap-0">
                <SheetHeader>
                  <SheetTitle>항목 수정</SheetTitle>
                  <SheetDescription>
                    목록을 보면서 편집할 때는 사이드 시트가 편합니다.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-4">
                  <EntryFields />
                </div>
                <SheetFooter>
                  <Button>저장</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Dialog>
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
                  <DialogTitle>신규 등록</DialogTitle>
                  <DialogDescription>
                    필수 항목만 입력하고 바로 저장합니다.
                  </DialogDescription>
                </DialogHeader>
                <EntryFields />
                <DialogFooter>
                  <DialogClose render={<Button variant="outline">취소</Button>} />
                  <Button>저장</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />
      <FilterBar />
      <Surface>
        <RecordTable />
        <TableFooterBar />
      </Surface>
    </Page>
  )
}
