import { LayersIcon, SettingsIcon } from "lucide-react"

/**
 * 사이드바 상위 두 단계. 헤더 브레드크럼도 같은 값을 쓴다.
 * 여기만 고치면 사이드바와 브레드크럼이 함께 따라간다.
 */
export const MENU_ROOT = { label: "환경설정", icon: SettingsIcon } as const
export const MENU_LAYOUTS = { label: "레이아웃", icon: LayersIcon } as const

/** 브레드크럼에서 화면 폭이 좁을 때 접히는 고정 접두부의 길이. */
export const MENU_PREFIX_LENGTH = 2
