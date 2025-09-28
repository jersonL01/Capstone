'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Userkpi from '@/app/components/Userkpi';
import Spinner from '@/app/components/Spinner';


type UltimoUsuario = {
  id: number;
  nombre: string;
  email: string;
  creado_en?: string;
};

function UltimosUsuarios({ limit = 5 }: { limit?: number }) {
  const [data, setData] = useState<UltimoUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/usuarios?limit=${limit}`, {
          cache: 'no-store',
          credentials: 'include',
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'No se pudo cargar');
        setData(json);
      } catch (e: any) {
        setErr(e.message ?? 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, [limit]);

  return (
    <div className="mt-4 rounded-xl bg-[#f0b34f] text-black p-4 shadow min-h-[260px]">
      <h3 className="text-xl font-semibold mb-3">
        Últimos usuarios<br />Registrados:
      </h3>

      {loading && <p className="text-black/70">Cargando…</p>}
      {err && !loading && <p className="text-red-700">{err}</p>}

      {!loading && !err && (
        <ul className="space-y-2 text-lg">
          {data.length === 0 ? (
            <li className="text-black/70">Aún no hay usuarios.</li>
          ) : (
            data.map(u => <li key={u.id}>{u.nombre}</li>)
          )}
        </ul>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      router.push('/');     // ir al inicio
      router.refresh();     // refrescar estado en el cliente
    } catch (_) {
      // opcional: mostrar toast/error
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#e5e5e5]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b6b81] text-white flex flex-col">
        <div className="px-6 py-5 text-center text-2xl font-bold bg-[#0a5a6d]">
          Panel<br />Administrativo
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-2 bg-[#16a2a8]" />
          <Link
            href="/admin/panel"
            className="block px-6 py-4 mt-4 rounded-r-lg bg-[#3a2fd4] text-white font-medium shadow-inner"
          >
            Dashboard
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/admin/gestion-user" className="block px-4 py-3 rounded hover:bg-[#0a5a6d]">
            Gestión usuarios
          </Link>
          <Link href="/admin/perfil-user" className="block px-4 py-3 rounded hover:bg-[#0a5a6d]">
            Perfil usuario
          </Link>
          <Link href="/admin/configuracion" className="block px-4 py-3 rounded hover:bg-[#0a5a6d]">
            Configuración
          </Link>
        </nav>

        <div className="px-6 py-4 text-sm opacity-80">@AquaSave 2025</div>
      </aside>

      {/* Columna derecha */}
      <div className="flex-1 flex flex-col">
        <header className="bg-[#e6b352] px-6 py-3 flex justify-between items-center border-b border-black/10">
          <h1 className="text-xl font-bold text-black">Administrador</h1>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-5 py-2 rounded bg-[#e63929] text-white font-semibold hover:brightness-95 disabled:opacity-60"
          >
            {loggingOut ? 'Cerrando…' : 'Cerrar Sesión'}
          </button>
        </header>

        <main className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <UltimosUsuarios limit={5} />
            </div>

            <div className="md:col-span-2">
              <div className="rounded-xl bg-[#f0b34f] text-black p-4 shadow">
                <h3 className="text-xl font-semibold mb-3">Notificaciones</h3>
                <ul className="space-y-3 text-sm md:text-base">
                  <li>• Pedrito ha realizado cambios en su perfil</li>
                  <li>• Juanito inició sesión por última vez el 31/08/2025</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Gráfico: usuarios por rol */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-black">Cantidad de usuarios por rol</h3>
            <Userkpi />
          </section>
        </main>
      </div>
    </div>
  );
}
