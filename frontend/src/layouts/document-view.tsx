import { DownloadIcon, PrinterIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Page } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { lineItems, formatNumber, formatWon } from "@/data/mock"

const total = lineItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
const vat = Math.round(total * 0.1)

export function DocumentView() {
  return (
    <Page className="items-center">
      <PageHeader
        className="w-full max-w-[860px]"
        breadcrumb={["업무", "전표", "DOC-2026-1004"]}
        title="전표 출력 미리보기"
        description="A4 폭에 맞춘 읽기 전용 문서 뷰. 인쇄·PDF 저장이 목적인 화면입니다."
        actions={
          <>
            <Button variant="outline" size="sm">
              <DownloadIcon data-icon="inline-start" />
              PDF
            </Button>
            <Button size="sm">
              <PrinterIcon data-icon="inline-start" />
              인쇄
            </Button>
          </>
        }
      />

      <article className="w-full max-w-[860px] rounded-lg border bg-card p-8 shadow-sm">
        <header className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                거 래 명 세 서
              </h2>
              <p className="font-mono text-xs text-muted-foreground">
                DOC-2026-1004
              </p>
            </div>
            <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-sm">
              <dt className="text-muted-foreground">작성일</dt>
              <dd className="tabular-nums">2026-08-28</dd>
              <dt className="text-muted-foreground">담당자</dt>
              <dd>김담당</dd>
              <dt className="text-muted-foreground">상태</dt>
              <dd>승인 완료</dd>
            </dl>
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">공급자</p>
              <p className="text-sm font-medium">주식회사 표준</p>
              <p className="text-sm text-muted-foreground">
                서울특별시 중구 표준대로 1
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">공급받는 자</p>
              <p className="text-sm font-medium">거래처 A</p>
              <p className="text-sm text-muted-foreground">
                경기도 성남시 예시로 22
              </p>
            </div>
          </div>
        </header>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">No</TableHead>
                <TableHead>품목</TableHead>
                <TableHead>규격</TableHead>
                <TableHead>단위</TableHead>
                <TableHead className="text-right">수량</TableHead>
                <TableHead className="text-right">단가</TableHead>
                <TableHead className="text-right">금액</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineItems.map((item) => (
                <TableRow key={item.code}>
                  <TableCell className="tabular-nums">{item.no}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.spec}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.unit}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(item.quantity)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(item.price)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatWon(item.quantity * item.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <footer className="mt-6 flex justify-end">
          <dl className="grid w-64 grid-cols-2 gap-y-2 text-sm">
            <dt className="text-muted-foreground">공급가액</dt>
            <dd className="text-right tabular-nums">{formatWon(total)}</dd>
            <dt className="text-muted-foreground">부가세</dt>
            <dd className="text-right tabular-nums">{formatWon(vat)}</dd>
            <dt className="col-span-2">
              <Separator />
            </dt>
            <dt className="font-medium">합계</dt>
            <dd className="text-right font-medium tabular-nums">
              {formatWon(total + vat)}
            </dd>
          </dl>
        </footer>
      </article>
    </Page>
  )
}
