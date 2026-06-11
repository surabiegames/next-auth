// import NextAuth from "next-auth"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { prisma } from "@/lib/prisma"
// import { SignInSchema } from "@/lib/validations/auth.schema"
// import { compareSync } from "bcrypt-ts"

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: "jwt" },
//   pages: {
//     signIn: "/login",
//   },
//   providers: [
//     Credential({
//       credentials: {
//         email: {},
//         password: {},
//       },
//       authorize: async (credentials) => {
//         const validatedFields = SignInSchema.safeParse(credentials)
//         if (!validatedFields.succsess) {
//           return null
//         }

//         const { email, password } = validatedFields.data
//         const user = await prisma.user.findUnique({
//           where: { email },
//         })
//         if (!user || !user.password) {
//           throw new error("Tidak ada pengguna yang tidak ditemukan")
//         }
//         const passwordMatch = compareSync(password, user.password)
//         if (!passwordMatch) return null
//         return user
//       },
//     }),
//   ],
// })
