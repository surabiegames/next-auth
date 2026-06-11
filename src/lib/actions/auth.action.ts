"use server"

import { RegisterSchema } from "@/lib/validations/auth.schema"
import { hash } from "bcrypt-ts"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { signIn, signOut } from "@/auth/auth"
import { AuthError } from "next-auth"

type AuthState = {
  error?: {
    name?: string[]
    email?: string[]
    password?: string[]
    ConfirmPassword?: string[]
  }
  message?: string
}

// --- Fungsi Login ---
export const signInCredentials = async (
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> => {
  const { email, password } = Object.fromEntries(formData.entries()) as {
    email: string
    password: string
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Email atau password salah." }
        default:
          return { message: "Terjadi kesalahan sistem." }
      }
    }
    throw error
  }

  redirect("/dashboard")
}

// --- Fungsi Register ---
export const signUpCredentials = async (
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> => {
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { name, email, password } = validatedFields.data

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { error: { email: ["Email sudah terdaftar"] } }
    }

    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "USER" },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return { message: "Terjadi kesalahan sistem." }
  }

  redirect("/login")
}

// --- Fungsi Logout ---
export const signOutAction = async () => {
  await signOut({ redirectTo: "/login" })
}
