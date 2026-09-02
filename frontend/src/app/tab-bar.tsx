import * as React from "react"
import { BroomIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTabStore } from "@/app/tab-context"

/** 활성 탭을 스크롤 영역 안으로 들일 때 좌우로 남길 여백. */
const SCROLL_MARGIN = 8

export function TabBar() {
  const { tabs, activePath, closeTab, closeOthers } = useTabStore()

  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const pinnedRef = React.useRef<HTMLDivElement>(null)

  // 탭이 늘어나 스크롤이 생기면 활성 탭이 화면 밖에 있을 수 있다. 따라 옮겨준다.
  // scrollIntoView 는 조상까지 스크롤시켜 페이지가 튀므로 scrollLeft 만 직접 만진다.
  React.useEffect(() => {
    const scroller = scrollerRef.current
    const active = scroller?.querySelector<HTMLElement>(
      '[data-slot="tabs-trigger"][data-active]'
    )
    if (!scroller || !active) return

    const view = scroller.getBoundingClientRect()
    const tab = active.getBoundingClientRect()
    // 오른쪽 고정 버튼이 스크롤 영역 위에 겹쳐 있으므로 그만큼 가려진 것으로 본다.
    const pinnedWidth = pinnedRef.current?.offsetWidth ?? 0

    if (tab.left < view.left) {
      scroller.scrollLeft -= view.left - tab.left + SCROLL_MARGIN
    } else if (tab.right > view.right - pinnedWidth) {
      scroller.scrollLeft +=
        tab.right - (view.right - pinnedWidth) + SCROLL_MARGIN
    }
  }, [activePath, tabs.length])

  return (
    <div className="bg-tab-strip flex shrink-0 pt-1">
      <div
        ref={scrollerRef}
        className="no-scrollbar me-2 flex min-w-0 flex-1 overflow-x-auto overflow-y-hidden"
      >
        <div className="relative flex min-w-full items-end">
          {/*
            탭 줄과 컨텐츠 사이 경계선.

            컨텐츠 패널에 border-t 를 주면 활성 탭 아래에도 선이 그려져 탭이
            컨텐츠와 끊긴다. 그렇다고 스트립 바깥에 그리면 스크롤 영역이 탭을
            잘라내서 활성 탭이 그 선을 덮을 수 없다.

            그래서 선을 스크롤 영역 '안'에 깔고 탭보다 먼저 그린다. 활성 탭은
            배경이 불투명하므로 자기 구간만 가리고, 비활성 탭은 배경이 투명해
            선이 그대로 비친다.
          */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border"
          />

          <TabsList className="h-auto w-fit items-end justify-start gap-0 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.path}
                value={tab.path}
                title={tab.label}
                // 활성 탭이 아래 컨텐츠와 이어져 보이려면 배경이 --background 와 같아야 한다.
                // tabs.tsx 가 다크 모드에서 bg-input/30 을 쓰므로 dark: 로 다시 덮는다.
                className="h-auto flex-none justify-start rounded-t-[7px] rounded-b-none border-b-0 px-3 py-2 text-[12.5px] font-normal data-active:border-border data-active:bg-background data-active:font-medium dark:data-active:border-border dark:data-active:bg-background"
                // 가운데 클릭으로 닫기. 브라우저 탭과 같은 동작.
                onAuxClick={(event) => {
                  if (event.button === 1) {
                    event.preventDefault()
                    closeTab(tab.path)
                  }
                }}
              >
                <span className="max-w-40 truncate">{tab.label}</span>
                <span
                  role="button"
                  aria-label={`${tab.label} 탭 닫기`}
                  tabIndex={-1}
                  className="-me-1 flex size-4 shrink-0 items-center justify-center rounded-sm opacity-50 hover:bg-accent hover:opacity-100"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    closeTab(tab.path)
                  }}
                >
                  <XIcon className="size-3.5" />
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/*
            탭과 같은 flex 라인에 두고 sticky 로 붙인다. 같은 라인이라 items-end 가
            똑같이 적용되어 탭의 x 와 세로 위치가 자동으로 맞는다. ms-auto 는 탭이
            적어 스크롤이 없을 때도 오른쪽 끝에 붙여 둔다. 배경이 불투명해 위 경계선을
            가리므로 border-b 로 그 구간을 다시 이어 준다.
          */}
          <div
            ref={pinnedRef}
            className="bg-tab-strip sticky end-0 z-10 ms-auto flex shrink-0 items-center self-stretch rounded-t-[7px] border-b px-1.5"
          >
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="다른 탭 모두 닫기"
                    className="text-muted-foreground"
                    disabled={tabs.length <= 1}
                    onClick={() => closeOthers(activePath)}
                  />
                }
              >
                <BroomIcon />
              </TooltipTrigger>
              <TooltipContent side="bottom">다른 탭 모두 닫기</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}
