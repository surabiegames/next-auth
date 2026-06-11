"use client"

import Link from "next/link"
import Image from "next/image"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import UserProfile from "@/components/navbar/user-profile"

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      {/* Gunakan mx-auto dan max-w agar konten mengumpul di tengah 
        dan tidak menempel ke pojok kiri/kanan layar
      */}
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Sisi Kiri: Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo Tirta"
              width={30}
              height={30}
              priority
            />
          </Link>
        </div>

        {/* Sisi Kanan: Menu + Profile */}
        <div className="flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className={navigationMenuTriggerStyle()}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/pelanggan"
                  className={navigationMenuTriggerStyle()}
                >
                  Pelanggan
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/dashboard"
                  className={navigationMenuTriggerStyle()}
                >
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/user"
                  className={navigationMenuTriggerStyle()}
                >
                  User
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="border-l pl-4">
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
