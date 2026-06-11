import { authConfig } from "@/auth/auth.config" // Sesuaikan path alias Anda
import NextAuth from "next-auth"

// Inisialisasi Auth.js dengan config
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Logika proteksi halaman
  const isAuthPage = nextUrl.pathname.startsWith("/auth")
  const isProtectedPage = !isAuthPage && nextUrl.pathname !== "/"

  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/", nextUrl))
  }

  if (!isLoggedIn && isProtectedPage) {
    return Response.redirect(new URL("/auth", nextUrl))
  }
})

// Konfigurasi matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
