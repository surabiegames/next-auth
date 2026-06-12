"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { signInCredentials, AuthState } from "@/lib/actions/auth.action"
import { SubmitButton } from "@/components/auth/submit-button"
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
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { DecorIcon } from "@/components/ui/decor"
import Image from "next/image"

const initialState: AuthState = {
  errors: {},
  message: "",
}

export const FormLogin = () => {
  const [state, formAction] = useActionState(signInCredentials, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Card className="relative w-full max-w-md overflow-hidden">
      {/* Dekorasi sudut tetap sama */}
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
          {state?.message && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Nama pengguna atau email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="contoh@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Tombol Login */}
          <SubmitButton label="Masuk" pendingLabel="Memverifikasi..." />
        </form>
      </CardContent>

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
