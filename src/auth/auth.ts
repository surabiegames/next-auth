// src/auth/auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { SignInSchema } from "@/lib/validations/auth.schema"
import { compareSync } from "bcrypt-ts"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials)
        if (!validatedFields.success) return null
        const { email, password } = validatedFields.data
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.password) return null
        const passwordMatch = compareSync(password, user.password)
        if (!passwordMatch) return null
        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id ?? token.sub
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as "USER" | "ADMIN"
      }
      return session
    },
  },
})
