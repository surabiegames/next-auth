import { auth } from "@/auth/auth"
import { canAccess } from "@/lib/permissions/permissions"
import { redirect } from "next/navigation"

export default async function NrwPage() {
  const session = await auth()
  const role = session?.user?.role || ""

  // Gunakan pengecekan akses
  if (!canAccess(role, "/dashboard/nrw")) {
    // Lebih baik gunakan redirect daripada throw error agar UI tidak "meledak"
    // redirect("/unauthorized");
    throw new Error("Anda tidak memiliki akses ke halaman ini!")
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-bold">Halaman NRW</h1>
      <p>Selamat datang, {session?.user?.name}</p>
    </main>
  )
}
