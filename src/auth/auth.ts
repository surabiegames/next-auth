import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { SignInSchema } from "@/lib/validations/auth.schema"
import { compareSync } from "bcrypt-ts"
import Credentials from "next-auth/providers/credentials" // 1. Fix: Import provider
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google,
    GitHub,
    Credentials({
      async authorize(credentials) {
        // 2. Fix: 'succsess' typo
        const validatedFields = SignInSchema.safeParse(credentials)
        if (!validatedFields.success) return null

        const { email, password } = validatedFields.data
        const user = await prisma.user.findUnique({
          where: { email },
        })

        // 3. Fix: 'throw new error' bikin crash, gunakan return null
        if (!user || !user.password) return null

        const passwordMatch = compareSync(password, user.password)
        if (!passwordMatch) return null

        return user
      },
    }),
  ],
  callbacks: {
    // 4. Fix: Menyatukan logika RBAC agar role tersimpan di Token & Session
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "USER" | "ADMIN"
      }
      return session
    },
  },
})
