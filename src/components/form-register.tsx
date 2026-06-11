"use client"

import { useActionState } from "react"
import Link from "next/link"
import { signUpCredentials } from "@/lib/actions"
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
import { AlertCircle, Loader2 } from "lucide-react"

const initialState = { error: {} }

export const FormRegister = () => {
  const [state, formAction, isPending] = useActionState(
    signUpCredentials,
    initialState
  )

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Buat Akun</CardTitle>
        <CardDescription>Isi formulir di bawah untuk mendaftar</CardDescription>
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
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="********"
              disabled={isPending}
            />
            {state?.error?.password && (
              <p className="text-sm text-destructive">
                {state.error.password[0]}
              </p>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div className="space-y-2">
            <Label htmlFor="ConfirmPassword">Konfirmasi Password</Label>
            <Input
              id="ConfirmPassword"
              type="password"
              name="ConfirmPassword"
              placeholder="********"
              disabled={isPending}
            />
            {state?.error?.ConfirmPassword && (
              <p className="text-sm text-destructive">
                {state.error.ConfirmPassword[0]}
              </p>
            )}
          </div>

          {/* Tombol Submit */}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Mendaftar..." : "Daftar"}
          </Button>
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
