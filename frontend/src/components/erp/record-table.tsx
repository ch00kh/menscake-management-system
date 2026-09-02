import type * as React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { formatNumber, rows as allRows, statusVariant, formatWon, type Row } from "@/data/mock"

export type ColumnKey =
  | "code"
  | "name"
  | "category"
  | "owner"
  | "status"
  | "quantity"
  | "amount"
  | "date"

const LABEL: Record<ColumnKey, string> = {
  code: "문서번호",
  name: "명칭",
  category: "구분",
  owner: "담당자",
  status: "상태",
  quantity: "수량",
  amount: "금액",
  date: "등록일",
}

const NUMERIC: ColumnKey[] = ["quantity", "amount"]

export function RecordTable({
  data = allRows,
  columns = ["code", "name", "category", "owner", "status", "quantity", "amount", "date"],
  selectable = true,
  activeId,
  onRowClick,
  withTotal = false,
  className,
}: {
  data?: Row[]
  columns?: ColumnKey[]
  selectable?: boolean
  activeId?: string
  onRowClick?: (row: Row) => void
  withTotal?: boolean
  className?: string
}) {
  const total = data.reduce((sum, r) => sum + r.amount, 0)

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {selectable ? (
            <TableHead className="w-10">
              <Checkbox aria-label="전체 선택" />
            </TableHead>
          ) : null}
          {columns.map((c) => (
            <TableHead
              key={c}
              className={cn(NUMERIC.includes(c) && "text-right")}
            >
              {LABEL[c]}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow
            key={row.id}
            data-state={activeId === row.id ? "selected" : undefined}
            className={cn(onRowClick && "cursor-pointer")}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {selectable ? (
              <TableCell>
                <Checkbox aria-label={`${row.code} 선택`} />
              </TableCell>
            ) : null}
            {columns.map((c) => (
              <TableCell
                key={c}
                className={cn(
                  NUMERIC.includes(c) && "text-right tabular-nums",
                  c === "code" && "font-mono text-xs",
                  c === "name" && "font-medium"
                )}
              >
                {c === "status" ? (
                  <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                ) : c === "amount" ? (
                  formatWon(row.amount)
                ) : c === "quantity" ? (
                  formatNumber(row.quantity)
                ) : (
                  row[c]
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      {withTotal ? (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={(selectable ? 1 : 0) + columns.length - 1}>
              합계
            </TableCell>
            <TableCell className="text-right tabular-nums">{formatWon(total)}</TableCell>
          </TableRow>
        </TableFooter>
      ) : null}
    </Table>
  )
}

export function TableFooterBar({
  total = 128,
  className,
  children,
}: {
  total?: number
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2",
        className
      )}
    >
      <p className="text-xs text-muted-foreground tabular-nums">
        총 {formatNumber(total)}건 · 1–18 표시
      </p>
      {children}
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
