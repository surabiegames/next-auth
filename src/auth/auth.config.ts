import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [], // Kosongkan di sini, isi di auth.ts
  pages: {
    signIn: "/login", // Pastikan sinkron dengan di auth.ts
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith("/admin")

      if (isAdminRoute) {
        return isLoggedIn && (auth?.user as any)?.role === "ADMIN"
      }
      return true // Halaman lain bebas diakses
    },
  },
} satisfies NextAuthConfig
