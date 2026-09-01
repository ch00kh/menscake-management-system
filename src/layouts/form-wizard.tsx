import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Page } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { RecordTable } from "@/components/erp/record-table"
import { Surface } from "@/components/erp/page"
import { CATEGORIES, rows, steps } from "@/data/mock"

export function FormWizard() {
  const [current, setCurrent] = React.useState(1)

  return (
    <Page className="items-center">
      <PageHeader
        className="w-full max-w-3xl"
        breadcrumb={["업무", "신규 신청"]}
        title="단계 입력"
        description="입력이 길거나 단계 간 의존이 있을 때. 한 번에 한 단계만 보여 줍니다."
      />

      <ol className="flex w-full max-w-3xl items-center gap-2">
        {steps.map((step, i) => (
          <li key={step.title} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrent(i)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular-nums",
                  i < current && "border-primary bg-primary text-primary-foreground",
                  i === current && "border-primary text-primary",
                  i > current && "text-muted-foreground"
                )}
              >
                {i < current ? <CheckIcon className="size-3.5" /> : i + 1}
              </span>
              <span className="flex min-w-0 flex-col">
                <span
                  className={cn(
                    "truncate text-sm",
                    i === current ? "font-medium" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
                <span className="hidden truncate text-xs text-muted-foreground lg:block">
                  {step.description}
                </span>
              </span>
            </button>
            {i < steps.length - 1 ? (
              <Separator className="hidden w-8 shrink-0 sm:block" />
            ) : null}
          </li>
        ))}
      </ol>

      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>{steps[current].title}</CardTitle>
          <CardDescription>{steps[current].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {current === 0 ? (
            <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="w-name">명칭</FieldLabel>
                <Input id="w-name" />
              </Field>
              <Field>
                <FieldLabel htmlFor="w-category">구분</FieldLabel>
                <NativeSelect id="w-category" className="w-full">
                  {CATEGORIES.map((c) => (
                    <NativeSelectOption key={c} value={c}>
                      {c}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            </FieldGroup>
          ) : null}
          {current === 1 ? (
            <Surface>
              <RecordTable
                data={rows.slice(0, 5)}
                withTotal
                columns={["code", "name", "qty", "amount"]}
              />
            </Surface>
          ) : null}
          {current === 2 ? (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="w-file">첨부</FieldLabel>
                <Input id="w-file" type="file" />
              </Field>
              <Field>
                <FieldLabel htmlFor="w-ref">참조 문서</FieldLabel>
                <Input id="w-ref" placeholder="DOC-2026-0000" />
              </Field>
            </FieldGroup>
          ) : null}
          {current === 3 ? (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="w-memo">상신 의견</FieldLabel>
                <Textarea id="w-memo" rows={4} />
              </Field>
            </FieldGroup>
          ) : null}
        </CardContent>
        <CardFooter className="justify-between">
          <Button
            variant="outline"
            disabled={current === 0}
            onClick={() => setCurrent((s) => Math.max(0, s - 1))}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            이전
          </Button>
          {current === steps.length - 1 ? (
            <Button>
              <CheckIcon data-icon="inline-start" />
              제출
            </Button>
          ) : (
            <Button onClick={() => setCurrent((s) => Math.min(steps.length - 1, s + 1))}>
              다음
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </Page>
  )
}
