import { SaveIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { FullPage } from "@/components/erp/page"
import { PageHeader } from "@/components/erp/page-header"
import { CATEGORIES, OWNERS } from "@/data/mock"

const SECTIONS = [
  { id: "basic", title: "기본 정보" },
  { id: "detail", title: "상세 조건" },
  { id: "policy", title: "정책 · 규칙" },
  { id: "extra", title: "추가 정보" },
  { id: "memo", title: "메모" },
]

export function FormAnchorSections() {
  return (
    <FullPage className="overflow-y-auto">
      <div className="flex flex-col gap-4 p-4 lg:p-6">
        <PageHeader
          breadcrumb={["설정", "상세 설정"]}
          title="설정 편집"
          description="섹션이 많은 긴 폼. 왼쪽 앵커 목록으로 위치를 잡고 오른쪽 본문을 스크롤합니다."
          actions={
            <Button size="sm">
              <SaveIcon data-icon="inline-start" />
              저장
            </Button>
          }
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
          <nav className="hidden lg:block">
            <ul className="sticky top-4 flex flex-col gap-1 border-l">
              {SECTIONS.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={"#" + section.id}
                    className="-ms-px block border-l-2 border-transparent px-3 py-1.5 text-sm text-muted-foreground hover:border-border hover:text-foreground data-[active=true]:border-primary data-[active=true]:font-medium data-[active=true]:text-foreground"
                    data-active={i === 0}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex min-w-0 flex-col gap-4">
            <Card id="basic">
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="a-name">명칭</FieldLabel>
                    <Input id="a-name" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="a-category">구분</FieldLabel>
                    <NativeSelect id="a-category" className="w-full">
                      {CATEGORIES.map((c) => (
                        <NativeSelectOption key={c} value={c}>
                          {c}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card id="detail">
              <CardHeader>
                <CardTitle>상세 조건</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="a-owner">담당자</FieldLabel>
                    <NativeSelect id="a-owner" className="w-full">
                      {OWNERS.map((o) => (
                        <NativeSelectOption key={o} value={o}>
                          {o}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="a-date">적용일</FieldLabel>
                    <Input id="a-date" type="date" />
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card id="policy">
              <CardHeader>
                <CardTitle>정책 · 규칙</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel>채번 방식</FieldLabel>
                    <RadioGroup defaultValue="auto">
                      <Field orientation="horizontal">
                        <RadioGroupItem id="a-auto" value="auto" />
                        <FieldLabel htmlFor="a-auto">자동 채번</FieldLabel>
                      </Field>
                      <Field orientation="horizontal">
                        <RadioGroupItem id="a-manual" value="manual" />
                        <FieldLabel htmlFor="a-manual">수동 입력</FieldLabel>
                      </Field>
                    </RadioGroup>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="a-approve" defaultChecked />
                    <FieldLabel htmlFor="a-approve">저장 시 결재 자동 상신</FieldLabel>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card id="extra">
              <CardHeader>
                <CardTitle>추가 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="a-ex1">참조 1</FieldLabel>
                    <Input id="a-ex1" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="a-ex2">참조 2</FieldLabel>
                    <Input id="a-ex2" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="a-ex3">참조 3</FieldLabel>
                    <Input id="a-ex3" />
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card id="memo">
              <CardHeader>
                <CardTitle>메모</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea rows={5} placeholder="내부 공유용 메모" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FullPage>
  )
}
