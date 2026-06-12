"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Portal, PortalBackdrop } from "@/components/ui/portal"
import { navLinks } from "@/constants/navigation"
import { XIcon, MenuIcon } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false) // State loading
  const { status } = useSession()

  // Fungsi logout yang konsisten dan robust
  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ callbackUrl: "/home" })
  }

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        {open ? (
          <XIcon className="size-4.5" />
        ) : (
          <MenuIcon className="size-4.5" />
        )}
      </Button>

      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop onClick={() => setOpen(false)} />
          <div
            className={cn(
              "size-full p-4 ease-out data-[slot=open]:animate-in data-[slot=open]:zoom-in-97"
            )}
            data-slot={open ? "open" : "closed"}
          >
            {/* Daftar Link (Hanya muncul jika status loading selesai dan user login) */}
            {status === "authenticated" && (
              <div className="grid gap-y-2">
                {navLinks.map((link) => (
                  <Button
                    asChild
                    className="justify-start"
                    key={link.label}
                    variant="ghost"
                    onClick={() => setOpen(false)} // Menutup menu saat link diklik
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
              </div>
            )}

            {/* Tombol Aksi (Dinamis dan Robust) */}
            <div className="mt-12 flex flex-col gap-2">
              {status === "loading" ? (
                <Button className="w-full" variant="outline" disabled>
                  Loading...
                </Button>
              ) : status === "authenticated" ? (
                <Button
                  className="w-full"
                  variant="destructive"
                  disabled={isLoggingOut} // Mencegah klik ganda
                  onClick={handleLogout}
                >
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </Button>
              ) : (
                <>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button className="w-full">Get Started</Button>
                </>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
