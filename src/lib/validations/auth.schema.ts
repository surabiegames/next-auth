import { object, string } from "zod"

export const RegisterSchema = object({
  name: string()
    .min(1, "Nama wajib diisi")
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama maksimal 50 karakter"),
  email: string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: string()
    .min(8, "Password minimal 8 karakter")
    .max(32, "Password maksimal 32 karakter")
    .regex(/[A-Z]/, "Password harus mengandung minimal satu huruf kapital")
    .regex(/[0-9]/, "Password harus mengandung minimal satu angka"),
  ConfirmPassword: string().min(1, "Konfirmasi password wajib diisi"),
}).refine((data) => data.password === data.ConfirmPassword, {
  message: "Password tidak cocok",
  path: ["ConfirmPassword"],
})

export const SignInSchema = object({
  email: string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: string().max(32, "Password wajib diisi"),
})
