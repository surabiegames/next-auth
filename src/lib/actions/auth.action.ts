"use server"

import { RegisterSchema } from "@/lib/validations/auth.schema"
import { hashSync } from "bcrypt-ts"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

type RegisterState = {
  error?: {
    name?: string[]
    email?: string[]
    password?: string[]
    ConfirmPassword?: string[]
  }
  message?: string
}

export const signUpCredentials = async (
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> => {
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        error: {
          email: ["Email sudah terdaftar"],
        },
      }
    }

    const hashedPassword = hashSync(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return { message: "Terjadi kesalahan. Silakan coba lagi." }
  }

  redirect("/login")
}
