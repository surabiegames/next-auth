"use server"

import { RegisterSchema } from "@/lib/validations/auth.schema"
import { hash } from "bcrypt-ts"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { signIn } from "@/auth/auth"
import { AuthError } from "next-auth"
import { z } from "zod"

export type AuthState = {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
  }
  message?: string
}

// --- Fungsi Login ---
export const signInCredentials = async (
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> => {
  const LoginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
  })

  // PERBAIKAN: Deklarasi validatedFields
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Gagal login. Periksa kembali input Anda.",
    }
  }

  const { email, password } = validatedFields.data

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
          return {
            message: "Email atau password salah.",
            errors: { email: ["Periksa kembali kredensial Anda"] },
          }
        default:
          return { message: "Terjadi kesalahan sistem.", errors: {} }
      }
    }
    // Handle redirect agar tidak tertangkap sebagai error
    if ((error as any)?.digest?.includes("NEXT_REDIRECT")) {
      throw error
    }
    return { message: "Terjadi kesalahan yang tidak terduga.", errors: {} }
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
    // PERBAIKAN: Menambahkan message agar sesuai AuthState
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Input tidak valid",
    }
  }

  const { name, email, password } = validatedFields.data

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return {
        errors: { email: ["Email sudah terdaftar"] },
        message: "Registrasi gagal",
      }
    }

    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })
  } catch (error) {
    console.error("Registration error:", error)
    // PERBAIKAN: Pastikan selalu mengembalikan objek yang sesuai tipe
    return { message: "Terjadi kesalahan sistem.", errors: {} }
  }

  redirect("/login")
}
