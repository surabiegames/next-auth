// src/lib/permissions.ts
export const rolePermissions: Record<string, string[]> = {
  "/dashboard/distribusi": ["ADMIN_DISTRIBUSI"],
  "/dashboard/meter": ["ADMIN_PENCATAT_METER"],
  "/dashboard/langganan": ["ADMIN_LANGGANAN"],
  "/dashboard/nrw": ["ADMIN_NRW"],
  "/dashboard": [
    "ADMIN_DISTRIBUSI",
    "ADMIN_PENCATAT_METER",
    "ADMIN_LANGGANAN",
    "ADMIN_NRW",
  ],
}

export const canAccess = (role: string, path: string) => {
  const allowedRoles = rolePermissions[path]
  return allowedRoles ? allowedRoles.includes(role) : false
}
