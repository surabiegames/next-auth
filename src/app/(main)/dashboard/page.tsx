// page.tsx
export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Tambahkan elemen ini untuk memaksa halaman jadi panjang */}
      <div className="mt-10 space-y-4">
        {Array.from({ length: 50 }).map((_, i) => (
          <p key={i}>
            Ini adalah baris teks contoh ke-{i + 1} untuk menguji scroll.
          </p>
        ))}
      </div>
    </main>
  )
}
