/**
 * 도메인 중립 더미 데이터.
 * 어떤 ERP 도메인(구매/생산/재고/회계/인사)에 붙여도 어색하지 않도록
 * 필드명을 일반 업무 용어로만 구성했습니다.
 */

export type Status = "대기" | "진행" | "완료" | "보류" | "반려"

export const STATUSES: Status[] = ["대기", "진행", "완료", "보류", "반려"]

export const statusVariant: Record<
  Status,
  "default" | "secondary" | "outline" | "destructive"
> = {
  대기: "outline",
  진행: "default",
  완료: "secondary",
  보류: "outline",
  반려: "destructive",
}

export type Row = {
  id: string
  code: string
  name: string
  category: string
  owner: string
  status: Status
  quantity: number
  amount: number
  progress: number
  date: string
}

export const CATEGORIES = ["A그룹", "B그룹", "C그룹", "D그룹"]
export const OWNERS = ["김담당", "이책임", "박선임", "최주임", "정과장"]

const NAMES = [
  "표준 항목 등록",
  "월간 정산 처리",
  "외부 반입 요청",
  "라인 배정 계획",
  "재고 실사 결과",
  "단가 개정 검토",
  "출고 지시 확인",
  "협력사 평가",
  "설비 점검 이력",
  "예산 배분 조정",
  "품질 이상 보고",
  "계약 갱신 심의",
  "자재 소요 산출",
  "생산 실적 마감",
  "비용 전표 승인",
  "인원 배치 변경",
  "반품 처리 요청",
  "발주 잔량 정리",
]

export const rows: Row[] = NAMES.map((name, i) => ({
  id: String(i + 1),
  code: `DOC-2026-${String(1001 + i)}`,
  name,
  category: CATEGORIES[i % CATEGORIES.length],
  owner: OWNERS[i % OWNERS.length],
  status: STATUSES[i % STATUSES.length],
  quantity: 12 + ((i * 37) % 480),
  amount: 1_250_000 + ((i * 987_654) % 48_000_000),
  progress: (i * 13) % 101,
  date: `2026-0${(i % 9) + 1}-${String(((i * 7) % 27) + 1).padStart(2, "0")}`,
}))

export const kpis = [
  { label: "총 건수", value: "1,284", delta: "+8.2%", trend: "up" as const },
  { label: "진행 중", value: "312", delta: "+3.1%", trend: "up" as const },
  { label: "지연", value: "27", delta: "-12.4%", trend: "down" as const },
  { label: "처리 금액", value: "₩842.5M", delta: "+5.7%", trend: "up" as const },
]

export const monthly = [
  { month: "1월", plan: 320, actual: 286 },
  { month: "2월", plan: 340, actual: 351 },
  { month: "3월", plan: 360, actual: 342 },
  { month: "4월", plan: 380, actual: 396 },
  { month: "5월", plan: 400, actual: 372 },
  { month: "6월", plan: 420, actual: 438 },
  { month: "7월", plan: 410, actual: 401 },
  { month: "8월", plan: 430, actual: 452 },
]

export const composition = CATEGORIES.map((name, i) => ({
  name,
  value: [42, 27, 19, 12][i],
}))

export const timeline = [
  { at: "2026-08-28 14:20", who: "김담당", what: "상태를 진행으로 변경했습니다." },
  { at: "2026-08-27 09:05", who: "이책임", what: "첨부 파일 2건을 등록했습니다." },
  { at: "2026-08-26 17:41", who: "박선임", what: "수량을 120 → 148로 수정했습니다." },
  { at: "2026-08-25 11:12", who: "최주임", what: "결재를 상신했습니다." },
  { at: "2026-08-24 08:30", who: "정과장", what: "문서를 생성했습니다." },
]

export const steps = [
  { title: "기본 정보", description: "구분과 대상을 지정합니다." },
  { title: "상세 항목", description: "명세를 입력합니다." },
  { title: "첨부 · 참조", description: "근거 자료를 등록합니다." },
  { title: "검토 · 제출", description: "내용을 확인하고 상신합니다." },
]

export const lineItems = Array.from({ length: 6 }, (_, i) => ({
  no: i + 1,
  code: `ITM-${2100 + i}`,
  name: ["표준품 A", "표준품 B", "부자재 C", "소모품 D", "외주 E", "기타 F"][i],
  spec: ["100×200", "Ø45", "KS-3등급", "Set", "-", "-"][i],
  unit: ["EA", "EA", "KG", "SET", "건", "EA"][i],
  quantity: [120, 80, 45, 12, 3, 240][i],
  price: [12_500, 24_000, 8_900, 320_000, 1_200_000, 950][i],
}))

export const treeData = [
  {
    label: "전체",
    children: [
      {
        label: "A그룹",
        children: [{ label: "A-1 분류" }, { label: "A-2 분류" }, { label: "A-3 분류" }],
      },
      {
        label: "B그룹",
        children: [{ label: "B-1 분류" }, { label: "B-2 분류" }],
      },
      {
        label: "C그룹",
        children: [{ label: "C-1 분류" }, { label: "C-2 분류" }, { label: "C-3 분류" }],
      },
      { label: "D그룹", children: [{ label: "D-1 분류" }] },
    ],
  },
]

export const kanban = [
  { key: "접수", items: rows.slice(0, 4) },
  { key: "검토", items: rows.slice(4, 7) },
  { key: "진행", items: rows.slice(7, 11) },
  { key: "완료", items: rows.slice(11, 14) },
]

export function formatWon(n: number) {
  return `₩${n.toLocaleString("ko-KR")}`
}

export function formatNumber(n: number) {
  return n.toLocaleString("ko-KR")
}
