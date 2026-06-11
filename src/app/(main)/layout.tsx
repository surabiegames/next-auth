"use client"

import { SessionProvider } from "next-auth/react"
import { Header } from "@/components/navigasi/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      {/* Container utama harus memiliki flex-col agar Header di atas */}
      <div className="relative flex min-h-screen flex-col">
        <Header />

        {/* Pastikan main tidak memiliki class yang membuatnya hilang */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
