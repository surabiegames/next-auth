// src/app/(main)/dashboard/layout.tsx
"use client" // Wajib ada karena menggunakan SessionProvider
import { SessionProvider } from "next-auth/react"
import { Header } from "@/components/navigasi/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      {/* Tambahkan items-center di sini */}
      <div className="relative flex min-h-screen flex-col items-center">
        <Header />
        <main className="w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
      </div>
    </SessionProvider>
  )
}
