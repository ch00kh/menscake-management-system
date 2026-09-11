import { GalleryVerticalEndIcon, PackageIcon, TrendingUpIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/LoginForm"

function Brand() {
  return (
    <a href="#" className="flex items-center gap-2 self-center font-medium">
      <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <GalleryVerticalEndIcon className="size-4" />
      </div>
      멘즈케이크
    </a>
  )
}

export function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-card shadow-2xl md:grid-cols-2">
        {/* 왼쪽: 로그인 폼 */}
        <div className="flex flex-col gap-10 p-8 md:p-12">
          <Brand />
          <div className="flex flex-1 flex-col justify-center gap-6">
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-2xl font-bold">
                멘즈케이크에 오신 것을 환영합니다
              </h1>
              <p className="text-sm text-muted-foreground">
                사내 관리 시스템에 로그인하세요.
              </p>
            </div>
            <LoginForm />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            © 멘즈케이크. All Rights Reserved.{" "}
            <a href="#" className="underline underline-offset-4">
              이용약관
            </a>{" "}
            |{" "}
            <a href="#" className="underline underline-offset-4">
              개인정보처리방침
            </a>
          </p>
        </div>

        {/* 오른쪽: 장식용 패널 */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-10 md:flex">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative flex size-10 items-center justify-center rounded-xl bg-teal-600 text-white">
            <GalleryVerticalEndIcon className="size-5" />
          </div>

          <div className="relative flex flex-1 items-center justify-center py-10">
            <Card className="absolute top-0 left-2 w-56 rotate-[-4deg] gap-2 py-3 shadow-xl">
              <CardContent className="flex flex-col gap-1 px-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUpIcon className="size-3" /> 이번 달 매출
                </div>
                <div className="text-lg font-bold">₩12,480,000</div>
              </CardContent>
            </Card>
            <Card className="absolute right-2 bottom-0 w-56 rotate-[3deg] gap-2 py-3 shadow-xl">
              <CardContent className="flex flex-col gap-1 px-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <PackageIcon className="size-3" /> 재고 현황
                </div>
                <div className="text-lg font-bold">1,204개 입고 완료</div>
              </CardContent>
            </Card>
          </div>

          <div className="relative flex flex-col gap-3 text-white">
            <h2 className="text-2xl font-bold text-balance">
              총각쓰떡 운영을 위한 단 하나의 허브
            </h2>
            <p className="text-sm text-balance text-white/70">
              주문, 재고, 매출을 한곳에서 관리하세요.
            </p>
            <div className="flex gap-1 pt-2">
              <div className="h-1 w-8 rounded-full bg-white" />
              <div className="h-1 w-4 rounded-full bg-white/30" />
              <div className="h-1 w-4 rounded-full bg-white/30" />
              <div className="h-1 w-4 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
