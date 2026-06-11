// auth.config.ts
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const role = (auth?.user as any)?.role
      const pathname = nextUrl.pathname

      const isProtectedRoute = ["/dashboard", "/user", "/pelanggan"].some((r) =>
        pathname.startsWith(r)
      )
      const isAdminRoute = pathname.startsWith("/admin")
      const isAuthRoute = ["/login", "/register"].some((r) =>
        pathname.startsWith(r)
      )

      if (!isLoggedIn && (isProtectedRoute || isAdminRoute)) {
        return Response.redirect(new URL("/login", nextUrl.origin))
      }

      if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL("/dashboard", nextUrl.origin))
      }

      if (isLoggedIn && isAdminRoute && role !== "ADMIN") {
        return Response.redirect(new URL("/dashboard", nextUrl.origin))
      }

      return true
    },
  },
} satisfies NextAuthConfig
