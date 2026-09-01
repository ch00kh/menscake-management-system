import { SaveIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Page } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { CATEGORIES, OWNERS } from "@/data/mock"

export function FormSingleColumn() {
  return (
    <Page className="items-center">
      <PageHeader
        className="w-full max-w-2xl"
        breadcrumb={["기준정보", "등록"]}
        title="기본 등록"
        description="항목 수가 적은 등록/수정 화면. 한 줄에 하나씩, 위에서 아래로 읽습니다."
      />
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fc-code">코드</FieldLabel>
              <Input id="fc-code" placeholder="자동 채번" disabled />
              <FieldDescription>저장 시 규칙에 따라 부여됩니다.</FieldDescription>
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor="fc-name">명칭</FieldLabel>
              <Input id="fc-name" aria-invalid placeholder="필수 입력" />
              <FieldError errors={[{ message: "명칭은 필수 항목입니다." }]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="fc-category">구분</FieldLabel>
              <NativeSelect id="fc-category" className="w-full">
                {CATEGORIES.map((c) => (
                  <NativeSelectOption key={c} value={c}>
                    {c}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="fc-owner">담당자</FieldLabel>
              <NativeSelect id="fc-owner" className="w-full">
                {OWNERS.map((o) => (
                  <NativeSelectOption key={o} value={o}>
                    {o}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="fc-note">비고</FieldLabel>
              <Textarea id="fc-note" rows={4} placeholder="자유 입력" />
            </Field>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>옵션</FieldLegend>
              <FieldGroup>
                <Field orientation="horizontal">
                  <Checkbox id="fc-opt1" />
                  <FieldLabel htmlFor="fc-opt1">목록에 노출</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="fc-opt2" defaultChecked />
                  <FieldLabel htmlFor="fc-opt2">변경 이력 기록</FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
              <Switch id="fc-active" defaultChecked />
              <FieldLabel htmlFor="fc-active">사용 여부</FieldLabel>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline">
            <XIcon data-icon="inline-start" />
            취소
          </Button>
          <Button>
            <SaveIcon data-icon="inline-start" />
            저장
          </Button>
        </CardFooter>
      </Card>
    </Page>
  )
}
