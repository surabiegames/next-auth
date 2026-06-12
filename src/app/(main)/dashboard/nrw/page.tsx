import { auth } from "@/auth/auth"
import { canAccess } from "@/lib/permissions/permissions"
import { redirect } from "next/navigation"

export default async function NrwPage() {
  const session = await auth()

  // Karena pintu masuk sudah dijaga Middleware,
  // di sini Anda cukup fokus pada render data
  return (
    <main>
      <h1>Halaman NRW</h1>
      {canAccess(session?.user?.role || "", "/dashboard/nrw") ? (
        <div className="rounded border p-4 shadow">
          <h2 className="text-lg">Tabel Data NRW</h2>
          <p>Komponen DataTable akan segera hadir di sini.</p>
        </div>
      ) : (
        <p>Anda tidak berhak melihat data ini.</p>
      )}
    </main>
  )
}
