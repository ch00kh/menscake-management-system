import { CopyIcon, PlusIcon, SaveIcon, SendIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FullPage } from "@/components/erp/page"
import { PaneHeader } from "@/components/erp/page-header"
import { CATEGORIES, lineItems, formatNumber, OWNERS, formatWon } from "@/data/mock"

const supply = lineItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
const vat = Math.round(supply * 0.1)

export function DocumentEntry() {
  return (
    <FullPage>
      <PaneHeader
        title="전표 입력"
        count="DOC-2026-1019"
        actions={
          <>
            <Button variant="outline" size="sm">
              <SaveIcon data-icon="inline-start" />
              임시저장
            </Button>
            <Button size="sm">
              <SendIcon data-icon="inline-start" />
              확정
            </Button>
          </>
        }
      />

      <div className="border-b bg-muted/30 p-4">
        <FieldGroup className="grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-4 xl:grid-cols-6">
          <Field>
            <FieldLabel htmlFor="d-date">전표일자</FieldLabel>
            <Input id="d-date" type="date" defaultValue="2026-09-01" />
          </Field>
          <Field>
            <FieldLabel htmlFor="d-type">전표구분</FieldLabel>
            <NativeSelect id="d-type" className="w-full">
              {CATEGORIES.map((c) => (
                <NativeSelectOption key={c} value={c}>
                  {c}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="d-partner">거래처</FieldLabel>
            <Input id="d-partner" defaultValue="거래처 A" />
          </Field>
          <Field>
            <FieldLabel htmlFor="d-owner">담당자</FieldLabel>
            <NativeSelect id="d-owner" className="w-full">
              {OWNERS.map((o) => (
                <NativeSelectOption key={o} value={o}>
                  {o}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <Field className="col-span-2">
            <FieldLabel htmlFor="d-title">적요</FieldLabel>
            <Input id="d-title" placeholder="전표 요약" />
          </Field>
        </FieldGroup>
      </div>

      <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
        <span className="text-sm font-medium">명세 ({lineItems.length}행)</span>
        <ButtonGroup>
          <Button variant="outline" size="sm">
            <PlusIcon data-icon="inline-start" />
            행 추가
          </Button>
          <Button variant="outline" size="sm">
            <CopyIcon data-icon="inline-start" />
            복사
          </Button>
          <Button variant="outline" size="sm">
            <Trash2Icon data-icon="inline-start" />
            행 삭제
          </Button>
        </ButtonGroup>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <Table className="min-w-4xl pe-3">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead className="w-40">품목코드</TableHead>
              <TableHead>품목명</TableHead>
              <TableHead className="w-32">규격</TableHead>
              <TableHead className="w-20">단위</TableHead>
              <TableHead className="w-28 text-right">수량</TableHead>
              <TableHead className="w-32 text-right">단가</TableHead>
              <TableHead className="w-36 text-right">금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineItems.map((item) => (
              <TableRow key={item.code}>
                <TableCell className="tabular-nums text-muted-foreground">
                  {item.no}
                </TableCell>
                <TableCell className="p-1">
                  <Input defaultValue={item.code} className="h-7 font-mono text-xs" />
                </TableCell>
                <TableCell className="p-1">
                  <Input defaultValue={item.name} className="h-7" />
                </TableCell>
                <TableCell className="p-1">
                  <Input defaultValue={item.spec} className="h-7" />
                </TableCell>
                <TableCell className="p-1">
                  <Input defaultValue={item.unit} className="h-7" />
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    defaultValue={item.quantity}
                    type="number"
                    className="h-7 text-right tabular-nums"
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    defaultValue={item.price}
                    type="number"
                    className="h-7 text-right tabular-nums"
                  />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatWon(item.quantity * item.price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-wrap items-center justify-end gap-6 border-t bg-muted/30 px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">총 수량</span>
          <span className="text-sm font-medium tabular-nums">
            {formatNumber(lineItems.reduce((s, i) => s + i.quantity, 0))}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">공급가액</span>
          <span className="text-sm font-medium tabular-nums">{formatWon(supply)}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">부가세</span>
          <span className="text-sm font-medium tabular-nums">{formatWon(vat)}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">합계</span>
          <span className="font-heading text-lg font-semibold tabular-nums">
            {formatWon(supply + vat)}
          </span>
        </div>
      </div>
    </FullPage>
  )
}
