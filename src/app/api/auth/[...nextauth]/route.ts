// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Pool } from "pg";

export const runtime = "nodejs"; // 'pg' requiere runtime Node

// Pool hacia Neon (DATABASE_URL debe incluir ?sslmode=require)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    /**
     * Controla el acceso en el momento del sign-in con Google:
     * - Upsert del usuario (si no existe) con tipo por defecto 'usuario'
     * - Lee el tipo real desde la BD
     * - Solo permite continuar si tipo === 'administrador'
     */
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      const providerId = (account as any).providerAccountId ?? null;
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        // Crea/actualiza el usuario. Si no existía, queda como 'usuario'.
        await client.query(
          `
          INSERT INTO public.usuarios (nombre, email, telefono, pass, tipo, provider, provider_id)
          VALUES ($1, $2, NULL, DEFAULT, COALESCE((SELECT tipo FROM public.usuarios WHERE email=$2), 'usuario'), 'google', $3)
          ON CONFLICT (email) DO UPDATE
            SET nombre      = EXCLUDED.nombre,
                provider    = 'google',
                provider_id = COALESCE(public.usuarios.provider_id, EXCLUDED.provider_id)
          `,
          [user.name ?? "", user.email, providerId]
        );

        // Consulta el tipo actualizado
        const { rows } = await client.query(
          `SELECT tipo FROM public.usuarios WHERE email = $1 LIMIT 1`,
          [user.email]
        );

        await client.query("COMMIT");

        const tipo = String(rows[0]?.tipo ?? "usuario").toLowerCase();

        // 🔒 Solo administradores pueden iniciar sesión
        if (tipo !== "administrador") {
          // Redirige al login con un mensaje claro
          return "/auth/login?error=AccessDenied";
          // (Si prefieres la página estándar de error de NextAuth):
          // return false;
        }

        return true;
      } catch (e) {
        await client.query("ROLLBACK");
        console.error("Upsert/role check failed:", e);
        // Error de configuración → regresa al login con aviso
        return "/auth/login?error=Configuration";
      } finally {
        client.release();
      }
    },

    // Inyecta id y tipo en el JWT en cada request
    async jwt({ token }) {
      if (token?.email) {
        try {
          const { rows } = await pool.query(
            `SELECT id, nombre, tipo FROM public.usuarios WHERE email = $1 LIMIT 1`,
            [token.email]
          );
          const u = rows[0];
          if (u) {
            (token as any).userId = u.id;
            (token as any).tipo = u.tipo ?? "usuario";
            token.name = u.nombre ?? token.name;
          } else {
            (token as any).tipo = (token as any).tipo ?? "usuario";
          }
        } catch (e) {
          console.error("read user failed:", e);
          (token as any).tipo = (token as any).tipo ?? "usuario";
        }
      }
      return token;
    },

    // Expone id y tipo al cliente
    async session({ session, token }) {
      (session.user as any).id = (token as any).userId;
      (session.user as any).tipo = (token as any).tipo ?? "usuario";
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
