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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { DecorIcon } from "@/components/ui/decor"
import Image from "next/image"

const initialState = { error: {} }

export const FormLogin = () => {
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
        <CardTitle className="text-2xl font-bold">Masuk ke Tirta</CardTitle>
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

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Nama pengguna atau email</Label>
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

          {/* Tombol Login */}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Mendaftar..." : "Daftar"}
          </Button>
        </form>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Mendaftar
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
