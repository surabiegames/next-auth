"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/navigasi/logo"
import { useScroll } from "@/hooks/use-scroll"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/navigasi/mobile-nav"
import UserProfile from "./user-profile"
import { navLinks } from "@/constants/navigation"

export function Header() {
  const scrolled = useScroll(10)
  const { status } = useSession() // Mengambil status login (loading, authenticated, unauthenticated)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-4xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out",
        {
          "border-border bg-background/95 backdrop-blur-sm md:top-2 md:max-w-3xl md:shadow":
            scrolled,
        }
      )}
    >
      <nav className="flex h-14 w-full items-center justify-between px-4 md:h-12">
        <a className="rounded-md p-2 hover:bg-muted" href="#">
          <Logo className="h-4" />
        </a>

        {/* BAGIAN NAVIGASI DINAMIS */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Jika sudah login, tampilkan menu lengkap */}
          {status === "authenticated" && (
            <div>
              {navLinks.map((link) => (
                <Button key={link.label} size="sm" variant="ghost" asChild>
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </div>
          )}

          {/* Logic Tombol: Jika Login tampilkan UserProfile, jika belum tampilkan Sign In */}
          {status === "authenticated" ? (
            <UserProfile />
          ) : status === "unauthenticated" ? (
            <Button asChild size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          ) : (
            // Placeholder saat masih loading agar tidak melompat
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          )}
        </div>

        <MobileNav />
      </nav>
    </header>
  )
}
