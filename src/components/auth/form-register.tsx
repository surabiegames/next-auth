"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { signUpCredentials } from "@/lib/actions/auth.action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { SubmitButton } from "@/components/auth/submit-button"
import { DecorIcon } from "@/components/ui/decor"
import Image from "next/image"

const initialState = { error: {} }

export const FormRegister = () => {
  const [state, formAction, isPending] = useActionState(
    signUpCredentials,
    initialState
  )
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <Card className="relative w-full max-w-md overflow-hidden">
      {/* Dekorasi sudut */}
      <DecorIcon position="top-left" size="lg" weight="medium" offset="sm" />
      <DecorIcon position="top-right" size="lg" weight="medium" offset="sm" />
      <DecorIcon position="bottom-left" size="lg" weight="medium" offset="sm" />
      <DecorIcon
        position="bottom-right"
        size="lg"
        weight="medium"
        offset="sm"
      />

      <CardHeader className="flex flex-col items-center text-center">
        {/* Tambahkan Logo di sini */}
        <div className="mb-2">
          <Image
            src="/logo.png"
            alt="Logo Tirta"
            width={60}
            height={60}
            priority
          />
        </div>
        <CardTitle className="text-2xl font-bold">Buat Akun</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          {/* Pesan error global */}
          {state?.message && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {/* Nama */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Wiska Prayoga"
              disabled={isPending}
            />
            {state?.error?.name && (
              <p className="text-sm text-destructive">{state.error.name[0]}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="contoh@email.com"
              disabled={isPending}
            />
            {state?.error?.email && (
              <p className="text-sm text-destructive">{state.error.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                disabled={isPending}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {state?.error?.password && (
              <p className="text-sm text-destructive">
                {state.error.password[0]}
              </p>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div className="space-y-2">
            <Label htmlFor="ConfirmPassword">Konfirmasi Password</Label>
            <div className="relative">
              <Input
                id="ConfirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="ConfirmPassword"
                placeholder="********"
                disabled={isPending}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {state?.error?.ConfirmPassword && (
              <p className="text-sm text-destructive">
                {state.error.ConfirmPassword[0]}
              </p>
            )}
          </div>

          {/* Tombol Submit */}
          <SubmitButton label="Daftar" pendingLabel="Mendaftar..." />
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Masuk
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
