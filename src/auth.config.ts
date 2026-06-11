import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        // Logika login kamu (biarkan kosong atau sesuaikan isi sebelumnya)
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
