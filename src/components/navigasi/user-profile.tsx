"use client"

import * as React from "react" // Pastikan mengimpor React
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UserProfile() {
  const { data: session, status } = useSession()

  // State baru untuk menangani loading saat klik logout
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  if (status === "loading") {
    // Memberikan placeholder agar navigasi tidak bergeser (layout shift)
    return <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
  }

  if (!session?.user) return null

  const user = session.user
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  // Fungsi handle logout yang diperbarui
  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ callbackUrl: "/home" })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={10}
        className="w-56"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="mt-1 text-xs font-bold text-primary">
              Role: {user.role || "USER"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {/* Tombol Logout dengan status loading */}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          disabled={isLoggingOut}
          onClick={handleLogout}
        >
          {isLoggingOut ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
