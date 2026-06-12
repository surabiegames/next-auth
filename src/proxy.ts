// src
import { auth } from "@/auth/auth" // Mengimpor handler auth dari instance NextAuth Anda

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register")
  const isPublicRoute = nextUrl.pathname === "/home" || nextUrl.pathname === "/"

  // 1. Biarkan rute API Auth berjalan
  if (isApiAuthRoute) return

  // 2. Jika sudah login dan di rute auth, arahkan ke dashboard
  if (isAuthRoute) {
    if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl))
    return
  }

  // 3. Jika belum login dan bukan rute publik, paksa ke login
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  return
})

export const config = {
  // Pola ini mengecualikan aset statis agar middleware tidak berjalan di tiap request gambar/js
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
