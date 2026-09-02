import { HistoryIcon, SaveIcon, SendIcon, TrashIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Page } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { CATEGORIES, OWNERS } from "@/data/mock"

export function FormTwoColumn() {
  return (
    <Page>
      <PageHeader
        breadcrumb={["업무", "등록"]}
        title="상세 등록"
        description="입력 항목이 많은 화면. 본문은 2단으로 밀도를 올리고 저장 액션은 오른쪽에 고정합니다."
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="t-code">문서번호</FieldLabel>
                  <Input id="t-code" defaultValue="DOC-2026-1019" disabled />
                </Field>
                <Field>
                  <FieldLabel htmlFor="t-date">등록일</FieldLabel>
                  <Input id="t-date" type="date" defaultValue="2026-09-01" />
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="t-name">명칭</FieldLabel>
                  <Input id="t-name" placeholder="업무명을 입력하세요" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="t-category">구분</FieldLabel>
                  <NativeSelect id="t-category" className="w-full">
                    {CATEGORIES.map((c) => (
                      <NativeSelectOption key={c} value={c}>
                        {c}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </Field>
                <Field>
                  <FieldLabel htmlFor="t-owner">담당자</FieldLabel>
                  <NativeSelect id="t-owner" className="w-full">
                    {OWNERS.map((o) => (
                      <NativeSelectOption key={o} value={o}>
                        {o}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>처리 조건</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field className="md:col-span-2">
                  <FieldLabel>우선순위</FieldLabel>
                  <ToggleGroup defaultValue={["보통"]} variant="outline">
                    <ToggleGroupItem value="긴급">긴급</ToggleGroupItem>
                    <ToggleGroupItem value="높음">높음</ToggleGroupItem>
                    <ToggleGroupItem value="보통">보통</ToggleGroupItem>
                    <ToggleGroupItem value="낮음">낮음</ToggleGroupItem>
                  </ToggleGroup>
                  <FieldDescription>
                    선택지가 2~7개면 드롭다운보다 토글이 빠릅니다.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="t-quantity">수량</FieldLabel>
                  <Input id="t-quantity" type="number" defaultValue={120} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="t-amount">금액</FieldLabel>
                  <Input id="t-amount" type="number" defaultValue={1500000} />
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="t-note">비고</FieldLabel>
                  <Textarea id="t-note" rows={4} />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col gap-4">
          <Card className="xl:sticky xl:top-4">
            <CardHeader>
              <CardTitle>작업</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button className="w-full">
                <SendIcon data-icon="inline-start" />
                저장 후 상신
              </Button>
              <Button variant="outline" className="w-full">
                <SaveIcon data-icon="inline-start" />
                임시 저장
              </Button>
              <Button variant="ghost" className="w-full">
                <HistoryIcon data-icon="inline-start" />
                변경 이력
              </Button>
              <Button variant="ghost" className="w-full text-destructive">
                <TrashIcon data-icon="inline-start" />
                삭제
              </Button>
            </CardContent>
          </Card>
          <Alert>
            <AlertTitle>필수 항목 2건 미입력</AlertTitle>
            <AlertDescription>
              명칭과 담당자를 입력해야 상신할 수 있습니다.
            </AlertDescription>
          </Alert>
        </aside>
      </div>
    </Page>
  )
}
