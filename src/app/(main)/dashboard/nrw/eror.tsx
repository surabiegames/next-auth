// app/(main)/dashboard/nrw/error.tsx
"use client"

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <h2 className="text-xl font-bold text-destructive">{error.message}</h2>
    </div>
  )
}
