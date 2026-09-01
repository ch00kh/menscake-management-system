import type { ComponentType } from "react"

import { AnalyticsFilters } from "./analytics-filters"
import { ApprovalInbox } from "./approval-inbox"
import { DashboardKpi } from "./dashboard-kpi"
import { DashboardOps } from "./dashboard-ops"
import { DetailSideSummary } from "./detail-side-summary"
import { DetailTabs } from "./detail-tabs"
import { DocumentEntry } from "./document-entry"
import { DocumentView } from "./document-view"
import { FormAnchorSections } from "./form-anchor-sections"
import { FormSingleColumn } from "./form-single-column"
import { FormTwoColumn } from "./form-two-column"
import { FormWizard } from "./form-wizard"
import { HierarchyOrg } from "./hierarchy-org"
import { KanbanBoard } from "./kanban-board"
import { ListAdvancedSearch } from "./list-advanced-search"
import { ListBasic } from "./list-basic"
import { ListCardGrid } from "./list-card-grid"
import { ListFilterPanel } from "./list-filter-panel"
import { ListGrouped } from "./list-grouped"
import { ListModalCrud } from "./list-modal-crud"
import { ListTabbed } from "./list-tabbed"
import { MasterDetail } from "./master-detail"
import { RecordTimeline } from "./record-timeline"
import { ReportPivot } from "./report-pivot"
import { TaskCalendar } from "./task-calendar"
import { ThreePane } from "./three-pane"
import { TransferAssign } from "./transfer-assign"
import { TreeGrid } from "./tree-grid"
import { WidgetBoard } from "./widget-board"
import { WorkflowStatus } from "./workflow-status"

export type LayoutGroup =
  | "목록 · 검색"
  | "상세 · 편집"
  | "입력 · 폼"
  | "분석 · 대시보드"
  | "프로세스 · 워크플로"
  | "마스터 · 구조"

export type LayoutMeta = {
  slug: string
  no: number
  name: string
  group: LayoutGroup
  summary: string
  useWhen: string
  component: ComponentType
  /** 페이지 자체가 화면 높이를 채우고 내부에서 스크롤하는 형태인지. */
  fullHeight?: boolean
}

export const layouts: LayoutMeta[] = [
  {
    slug: "list-basic",
    no: 1,
    name: "기본 목록",
    group: "목록 · 검색",
    summary: "검색바 + 표 + 페이지네이션",
    useWhen: "가장 표준적인 조회 화면. 다른 목록 레이아웃의 출발점입니다.",
    component: ListBasic,
  },
  {
    slug: "list-filter-panel",
    no: 2,
    name: "좌측 필터 패널 목록",
    group: "목록 · 검색",
    summary: "고정 필터 패널 + 결과 목록",
    useWhen: "조건을 자주 바꿔가며 조회할 때. 조건이 항상 보여야 하는 화면.",
    component: ListFilterPanel,
    fullHeight: true,
  },
  {
    slug: "list-advanced-search",
    no: 3,
    name: "상세 조회 목록",
    group: "목록 · 검색",
    summary: "접이식 상세 조건 + 목록",
    useWhen: "검색 조건이 10개 이상이지만 평소엔 2~3개만 쓰는 화면.",
    component: ListAdvancedSearch,
  },
  {
    slug: "list-tabbed",
    no: 4,
    name: "상태별 탭 목록",
    group: "목록 · 검색",
    summary: "상태 탭 + 건수 배지 + 목록",
    useWhen: "상태·구분처럼 상호배타적인 축으로 목록을 나눌 때.",
    component: ListTabbed,
  },
  {
    slug: "list-grouped",
    no: 5,
    name: "그룹 목록",
    group: "목록 · 검색",
    summary: "분류별 접기 + 소계",
    useWhen: "그룹별 건수·합계가 본문만큼 중요한 집계형 목록.",
    component: ListGrouped,
  },
  {
    slug: "list-card-grid",
    no: 6,
    name: "카드 그리드 목록",
    group: "목록 · 검색",
    summary: "카드 격자 + 진행률",
    useWhen: "건별 요약 정보가 많아 표로는 답답한 경우.",
    component: ListCardGrid,
  },
  {
    slug: "master-detail",
    no: 7,
    name: "마스터-디테일",
    group: "상세 · 편집",
    summary: "좌 목록 / 우 상세 (크기 조절)",
    useWhen: "목록과 상세를 번갈아 보는 검토 업무. 화면 이동이 없습니다.",
    component: MasterDetail,
    fullHeight: true,
  },
  {
    slug: "detail-tabs",
    no: 8,
    name: "탭 상세",
    group: "상세 · 편집",
    summary: "레코드 헤더 + 탭 본문",
    useWhen: "한 건에 딸린 정보가 성격별로 나뉘는 표준 상세 화면.",
    component: DetailTabs,
  },
  {
    slug: "detail-side-summary",
    no: 9,
    name: "요약 사이드 상세",
    group: "상세 · 편집",
    summary: "본문 + 우측 고정 요약/액션",
    useWhen: "본문을 읽으면서 상태와 액션 버튼이 늘 보여야 할 때.",
    component: DetailSideSummary,
  },
  {
    slug: "record-timeline",
    no: 10,
    name: "이력 타임라인 상세",
    group: "상세 · 편집",
    summary: "지표 + 기본정보 + 활동 타임라인",
    useWhen: "한 건의 처리 경과를 시간 순으로 추적해야 하는 업무.",
    component: RecordTimeline,
  },
  {
    slug: "three-pane",
    no: 11,
    name: "3분할",
    group: "상세 · 편집",
    summary: "분류 / 목록 / 상세",
    useWhen: "분류 → 항목 → 상세로 좁혀 들어가는 탐색형 화면.",
    component: ThreePane,
    fullHeight: true,
  },
  {
    slug: "document-view",
    no: 12,
    name: "문서 출력 뷰",
    group: "상세 · 편집",
    summary: "A4 폭 읽기 전용 전표",
    useWhen: "인쇄·PDF가 목적인 명세서/전표 미리보기.",
    component: DocumentView,
  },
  {
    slug: "form-single-column",
    no: 13,
    name: "단일 컬럼 폼",
    group: "입력 · 폼",
    summary: "한 줄에 하나씩, 위에서 아래로",
    useWhen: "항목이 10개 이하인 등록/수정 화면.",
    component: FormSingleColumn,
  },
  {
    slug: "form-two-column",
    no: 14,
    name: "2단 폼 + 액션 사이드",
    group: "입력 · 폼",
    summary: "2단 입력 + 우측 저장/상신",
    useWhen: "입력 항목이 많고 저장·상신 액션이 여러 개인 화면.",
    component: FormTwoColumn,
  },
  {
    slug: "form-anchor-sections",
    no: 15,
    name: "앵커 섹션 폼",
    group: "입력 · 폼",
    summary: "좌측 목차 + 긴 섹션 본문",
    useWhen: "섹션이 5개 이상인 설정/환경 편집 화면.",
    component: FormAnchorSections,
    fullHeight: true,
  },
  {
    slug: "form-wizard",
    no: 16,
    name: "단계 입력 위저드",
    group: "입력 · 폼",
    summary: "스텝퍼 + 단계별 폼",
    useWhen: "단계 간 의존이 있거나 한 번에 다 보여주기 부담스러운 신청 업무.",
    component: FormWizard,
  },
  {
    slug: "document-entry",
    no: 17,
    name: "전표 입력",
    group: "입력 · 폼",
    summary: "헤더 + 명세 그리드 + 합계 바",
    useWhen: "머리글 한 건에 명세 N행이 붙는 ERP의 핵심 입력 패턴.",
    component: DocumentEntry,
    fullHeight: true,
  },
  {
    slug: "list-modal-crud",
    no: 18,
    name: "목록 + 모달 등록",
    group: "입력 · 폼",
    summary: "목록 위에서 모달/시트로 CRUD",
    useWhen: "항목이 단순한 기준정보. 화면 이동 없이 바로 처리합니다.",
    component: ListModalCrud,
  },
  {
    slug: "dashboard-kpi",
    no: 19,
    name: "KPI 대시보드",
    group: "분석 · 대시보드",
    summary: "지표 카드 + 추이 + 최근 목록",
    useWhen: "모듈의 첫 화면. 대부분의 ERP 홈이 이 형태입니다.",
    component: DashboardKpi,
  },
  {
    slug: "dashboard-ops",
    no: 20,
    name: "운영 모니터링",
    group: "분석 · 대시보드",
    summary: "지표 게이지 + 실시간 대기열",
    useWhen: "현장 상황판. 지금 무엇이 밀려 있는지 한눈에 봐야 할 때.",
    component: DashboardOps,
    fullHeight: true,
  },
  {
    slug: "report-pivot",
    no: 21,
    name: "집계 리포트",
    group: "분석 · 대시보드",
    summary: "고정 헤더 · 고정 열 매트릭스",
    useWhen: "구분 × 기간처럼 축이 두 개인 대형 집계표.",
    component: ReportPivot,
    fullHeight: true,
  },
  {
    slug: "analytics-filters",
    no: 22,
    name: "조건형 분석",
    group: "분석 · 대시보드",
    summary: "상단 고정 필터 + 차트 섹션",
    useWhen: "조건을 바꿔가며 여러 각도로 들여다보는 분석 화면.",
    component: AnalyticsFilters,
  },
  {
    slug: "widget-board",
    no: 23,
    name: "위젯 보드",
    group: "분석 · 대시보드",
    summary: "사용자 구성형 위젯 격자",
    useWhen: "사용자마다 보고 싶은 지표가 다른 개인 홈 화면.",
    component: WidgetBoard,
  },
  {
    slug: "approval-inbox",
    no: 24,
    name: "결재함",
    group: "프로세스 · 워크플로",
    summary: "받은 목록 + 미리보기 + 승인/반려",
    useWhen: "결재·승인처럼 대량 건을 빠르게 처리해야 하는 업무.",
    component: ApprovalInbox,
    fullHeight: true,
  },
  {
    slug: "workflow-status",
    no: 25,
    name: "진행 현황",
    group: "프로세스 · 워크플로",
    summary: "단계 스텝퍼 + 처리 이력",
    useWhen: "정해진 단계를 밟는 업무의 현재 위치를 보여줄 때.",
    component: WorkflowStatus,
  },
  {
    slug: "kanban-board",
    no: 26,
    name: "칸반 보드",
    group: "프로세스 · 워크플로",
    summary: "상태 열 + 드래그 카드",
    useWhen: "상태 전환이 잦고 담당자가 직접 옮기는 업무.",
    component: KanbanBoard,
    fullHeight: true,
  },
  {
    slug: "task-calendar",
    no: 27,
    name: "일정 캘린더",
    group: "프로세스 · 워크플로",
    summary: "월 캘린더 + 우측 일정 목록",
    useWhen: "납기·일정처럼 날짜가 1차 축인 업무.",
    component: TaskCalendar,
    fullHeight: true,
  },
  {
    slug: "tree-grid",
    no: 28,
    name: "트리 + 그리드",
    group: "마스터 · 구조",
    summary: "좌 트리 분류 / 우 항목 표",
    useWhen: "계층 분류를 타고 내려가며 항목을 관리하는 기준정보.",
    component: TreeGrid,
    fullHeight: true,
  },
  {
    slug: "hierarchy-org",
    no: 29,
    name: "계층 다이어그램",
    group: "마스터 · 구조",
    summary: "조직도형 노드 트리",
    useWhen: "조직·BOM·계정과목처럼 상하 관계 자체를 봐야 할 때.",
    component: HierarchyOrg,
    fullHeight: true,
  },
  {
    slug: "transfer-assign",
    no: 30,
    name: "좌우 배정",
    group: "마스터 · 구조",
    summary: "선택 가능 ↔ 배정됨 이동",
    useWhen: "권한·메뉴·품목처럼 집합을 배정/해제하는 설정 화면.",
    component: TransferAssign,
    fullHeight: true,
  },
]

export const layoutGroups: LayoutGroup[] = [
  "목록 · 검색",
  "상세 · 편집",
  "입력 · 폼",
  "분석 · 대시보드",
  "프로세스 · 워크플로",
  "마스터 · 구조",
]

export function getLayout(slug?: string) {
  return layouts.find((layout) => layout.slug === slug)
}
