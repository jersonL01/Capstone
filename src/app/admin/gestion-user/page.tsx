'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Btnpdf from '@/app/components/Btnpdf';
import AlertDelete from '@/app/components/AlertDelete';
import AlertEdit from "@/app/components/AlertEdit";
type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
};

export default function GestionUsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // Contenedor a exportar (DIV)
  const exportRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error('Error al cerrar sesión', e);
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/usuarios', {
          cache: 'no-store',
          credentials: 'include',
        });
        const data = await res.json().catch(() => null);

        if (res.status === 401) {
          router.push('/auth/login');
          return;
        }
        if (!res.ok) throw new Error(data?.error || 'Error');

        setUsuarios(data as Usuario[]);
      } catch (e: any) {
        setErr(e.message ?? 'No se pudo cargar');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#e5e5e5]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b6b81] text-white flex flex-col">
        <div className="px-6 py-5 text-center text-2xl font-bold bg-[#0a5a6d]">
          Panel<br />Administrativo
        </div>

        <Link href="/admin/panel" className="block px-6 py-4 hover:bg-[#0a5a6d]">
          Dashboard
        </Link>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-2 bg-[#16a2a8]" />
          <Link
            href="/admin/gestion-user"
            className="block px-6 py-4 mt-4 rounded-r-lg bg-[#3a2fd4] text-white font-medium shadow-inner"
          >
            Gestión usuarios
          </Link>
        </div>

        <Link href="/admin/perfil-user" className="block px-6 py-4 hover:bg-[#0a5a6d]">
          Perfil usuario
        </Link>
        <Link href="/admin/configuracion" className="block px-6 py-4 hover:bg-[#0a5a6d]">
          Configuración
        </Link>

        <div className="mt-auto px-6 py-4 text-sm opacity-80">@AquaSave 2025</div>
      </aside>

      {/* Columna derecha */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-[#e6b352] px-6 py-3 flex justify-between items-center border-b border-black/10">
          <h1 className="text-xl font-bold text-black">Gestión Usuarios</h1>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-5 py-2 rounded bg-[#e63929] text-white font-semibold hover:brightness-95 disabled:opacity-60"
          >
            {loggingOut ? 'Cerrando…' : 'Cerrar Sesión'}
          </button>
        </header>

        {/* Contenido */}
        <main className="flex-1 p-6">
          {/* Encabezado superior */}
          <div className="bg-[#d9d9d9] rounded-md p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center border-8 border-black/80">
                <svg viewBox="0 0 24 24" className="w-14 h-14">
                  <circle cx="12" cy="8" r="3.5" fill="#8fb2ff" stroke="black" strokeWidth="1.5" />
                  <path d="M4.5 19.5c1.2-4.2 5.1-5.8 7.5-5.8s6.3 1.6 7.5 5.8" fill="#8fb2ff" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="10" fill="none" stroke="black" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Botones generales (incluye exportar) */}
              <div className="flex flex-wrap gap-3">
                <Btnpdf
                  targetRef={exportRef}
                  filename="usuarios.pdf"
                  orientation="landscape"
                  className="px-4 py-2 rounded-full bg-black text-white font-semibold hover:brightness-95"
                />
                <Link
                  href="/admin/crud/agregar"
                  className="px-4 py-2 rounded-full bg-[#8bc27a] text-black font-semibold hover:brightness-95"
                >
                  Agregar Usuario
                </Link>
              </div>
            </div>
          </div>

          {/* Contenedor que se exporta a PDF */}
          <div
            ref={exportRef}
            className="mt-4 rounded-md overflow-hidden border bg-[#8bc27a]"
          >
            {/* Tabla */}
            <div className="grid grid-cols-5 bg-[#dcc392] text-black font-semibold">
              <div className="border-r border-black/30 px-4 py-3">Nombres</div>
              <div className="border-r border-black/30 px-4 py-3">Correo Electrónico</div>
              <div className="border-r border-black/30 px-4 py-3">Rol</div>
              <div className="border-r border-black/30 px-4 py-3">Estado</div>
            </div>

            <div className="bg-[#dac191]">
              {loading && <div className="px-4 py-6 text-black/70">Cargando usuarios…</div>}
              {err && !loading && <div className="px-4 py-6 text-red-700">Error: {err}</div>}
              {!loading && !err && usuarios.length === 0 && (
                <div className="px-4 py-6 text-black/70">No hay usuarios registrados.</div>
              )}

              {!loading && !err && usuarios.map(u => (
                <div key={u.id} className="grid grid-cols-5 border-t border-black/20">
                  <div className="px-4 py-4 border-r border-black/20">{u.nombre}</div>
                  <div className="px-4 py-4 border-r border-black/20">{u.email}</div>
                  <div className="px-4 py-4 border-r border-black/20 capitalize">{u.rol}</div>
                  <div className="px-4 py-4">{u.estado}</div>
                  <div className="px-4 py-2 flex items-center gap-2">
                    
                    <button
                      onClick={() => router.push(`/admin/crud/editar/${u.id}`)}
                      className="px-3 py-1 rounded-full bg-[#8bc27a] text-black font-semibold hover:brightness-95"
                    >
                      Editar
                    </button>

                    {/* Botón Eliminar con SweetAlert2 */}
                    <AlertDelete id={u.id} onDelete={eliminar} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  // Lógica real de eliminación (sin confirm/alert; lo maneja el componente)
  async function eliminar(id: number) {
    const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || res.statusText);
    }
    setUsuarios(prev => prev.filter(u => u.id !== id));
  }
}
