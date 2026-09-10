import { createContext, useContext, useEffect, useRef } from "react"

/** 열린 탭 하나. `path` 가 곧 식별자다 (같은 경로는 탭 하나). */
export type WorkspaceTab = {
  path: string
  label: string
}

export type TabStore = {
  tabs: WorkspaceTab[]
  /** 활성 탭 = 현재 주소. 별도 상태로 두지 않아 주소와 어긋날 수 없다. */
  activePath: string
  openTab: (path: string) => void
  closeTab: (path: string) => void
  closeOthers: (path: string) => void
}

export const TabStoreContext = createContext<TabStore | null>(null)

/** 이 탭이 지금 화면에 보이는 탭인지. 숨은 탭에서 서버 요청을 막는 데 쓴다. */
export const TabActiveContext = createContext(true)

export function useTabStore() {
  const store = useContext(TabStoreContext)
  if (!store) {
    throw new Error("useTabStore 는 TabStoreProvider 안에서만 쓸 수 있습니다.")
  }
  return store
}

/**
 * 이 컴포넌트가 활성 탭 안에 있는지.
 *
 * 숨은 탭도 DOM 에 남아 있어 이펙트가 계속 돌기 때문에, 서버를 찌르는 코드는
 * 반드시 이 값으로 막아야 한다. 탭 10개가 동시에 폴링하는 것을 방지한다.
 */
export function useTabActive() {
  return useContext(TabActiveContext)
}

/**
 * 활성 탭에서만 도는 주기 실행. 폴링·자동 새로고침은 `setInterval` 을 직접 쓰지
 * 말고 이것을 쓴다. 탭이 숨으면 타이머가 멈추고, 다시 활성이 되면 즉시 한 번
 * 실행한 뒤 주기를 재개한다.
 *
 *   useActiveTabInterval(refetch, 30_000)
 *
 * `ms` 에 null 을 주면 멈춘다 (조건부 폴링).
 */
export function useActiveTabInterval(
  callback: () => void,
  ms: number | null
) {
  const isActive = useTabActive()

  // 콜백이 매 렌더 새로 만들어져도 타이머를 다시 걸지 않는다.
  const latest = useRef(callback)
  useEffect(() => {
    latest.current = callback
  }, [callback])

  useEffect(() => {
    if (!isActive || ms === null) return
    // 숨어 있던 동안의 변경을 반영하기 위해 활성화 시점에 한 번 즉시 실행.
    latest.current()
    const id = setInterval(() => latest.current(), ms)
    return () => clearInterval(id)
  }, [isActive, ms])
}
