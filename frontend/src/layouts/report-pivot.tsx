import { DownloadIcon, TableIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FullPage } from "@/components/erp/page"
import { PaneHeader } from "@/components/erp/page-header"
import { CATEGORIES, num } from "@/data/mock"

const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

const matrix = CATEGORIES.flatMap((category) =>
  ["A-1 분류", "A-2 분류", "A-3 분류"].map((_sub, j) => ({
    category,
    sub: category.slice(0, 1) + "-" + (j + 1) + " 분류",
    values: MONTHS.map(
      (_, m) => 1200 + ((category.charCodeAt(0) + j * 37 + m * 53) % 900)
    ),
  }))
)

export function ReportPivot() {
  return (
    <FullPage>
      <PaneHeader
        title="집계 리포트"
        count="구분 × 월"
        actions={
          <>
            <NativeSelect size="sm" className="w-28">
              <NativeSelectOption>2026년</NativeSelectOption>
              <NativeSelectOption>2025년</NativeSelectOption>
            </NativeSelect>
            <Button variant="outline" size="sm">
              <TableIcon data-icon="inline-start" />
              축 변경
            </Button>
            <Button size="sm">
              <DownloadIcon data-icon="inline-start" />
              엑셀
            </Button>
          </>
        }
      />
      <ScrollArea className="min-h-0 flex-1">
        <Table className="min-w-max">
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="sticky left-0 z-20 min-w-28 bg-background">
                구분
              </TableHead>
              <TableHead className="sticky left-28 z-20 min-w-32 bg-background">
                세부
              </TableHead>
              {MONTHS.map((m) => (
                <TableHead key={m} className="min-w-24 text-right">
                  {m}
                </TableHead>
              ))}
              <TableHead className="min-w-28 text-right">합계</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matrix.map((row, i) => {
              const sum = row.values.reduce((a, b) => a + b, 0)
              const first = i === 0 || matrix[i - 1].category !== row.category
              return (
                <TableRow key={row.category + row.sub}>
                  <TableCell
                    className={cn(
                      "sticky left-0 z-10 bg-background font-medium",
                      !first && "text-transparent"
                    )}
                  >
                    {row.category}
                  </TableCell>
                  <TableCell className="sticky left-28 z-10 bg-background text-muted-foreground">
                    {row.sub}
                  </TableCell>
                  {row.values.map((v, m) => (
                    <TableCell key={m} className="text-right tabular-nums">
                      {num(v)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-medium tabular-nums">
                    {num(sum)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="sticky left-0 z-10 bg-muted">
                총계
              </TableCell>
              {MONTHS.map((_, m) => (
                <TableCell key={m} className="text-right tabular-nums">
                  {num(matrix.reduce((sum, r) => sum + r.values[m], 0))}
                </TableCell>
              ))}
              <TableCell className="text-right tabular-nums">
                {num(
                  matrix.reduce(
                    (sum, r) => sum + r.values.reduce((a, b) => a + b, 0),
                    0
                  )
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </FullPage>
  )
}
