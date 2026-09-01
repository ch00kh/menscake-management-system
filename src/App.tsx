import { Navigate, Route, Routes } from "react-router-dom"

import { AppShell } from "@/app/app-shell"
import { Gallery } from "@/app/gallery"
import { LayoutPage } from "@/app/layout-page"

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Gallery />} />
        <Route path="/layouts/:slug" element={<LayoutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
