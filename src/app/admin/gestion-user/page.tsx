'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
};

export default function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/usuarios', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Error');
        setUsuarios(data as Usuario[]);
      } catch (e: any) {
        setErr(e.message ?? 'No se pudo cargar');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#e5e5e5]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b6b81] text-white flex flex-col">
        <div className="px-6 py-5 text-center text-2xl font-bold bg-[#0a5a6d]">
          Panel<br/>Administrativo
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
            Gestion usuarios
          </Link>
        </div>

        <Link href="/admin/perfil-user" className="block px-6 py-4 hover:bg-[#0a5a6d]">
          Perfil usuario
        </Link>
        <Link href="/admin/configuracion" className="block px-6 py-4 hover:bg-[#0a5a6d]">
          Configuracion
        </Link>

        <div className="mt-auto px-6 py-4 text-sm opacity-80">@AquaSave 2025</div>
      </aside>

      {/* Columna derecha */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-[#e6b352] px-6 py-3 flex justify-between items-center border-b border-black/10">
          <h1 className="text-xl font-bold text-black">Gestion Usuarios</h1>
          <button className="px-5 py-2 rounded bg-[#e63929] text-white font-semibold hover:brightness-95">
            Cerrar Sesión
          </button>
        </header>

        {/* Contenido */}
        <main className="flex-1 p-6">
          <div className="bg-[#d9d9d9] rounded-md p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Avatar grande */}
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center border-8 border-black/80">
                <svg viewBox="0 0 24 24" className="w-14 h-14">
                  <circle cx="12" cy="8" r="3.5" fill="#8fb2ff" stroke="black" strokeWidth="1.5" />
                  <path d="M4.5 19.5c1.2-4.2 5.1-5.8 7.5-5.8s6.3 1.6 7.5 5.8" fill="#8fb2ff" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="10" fill="none" stroke="black" strokeWidth="1.5"/>
                </svg>
              </div>

              {/* Botones verdes (acciones futuras) */}
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 rounded-full bg-[#8bc27a] text-black font-semibold hover:brightness-95">
                  Exportar PDF
                </button>
                <button className="px-4 py-2 rounded-full bg-[#8bc27a] text-black font-semibold hover:brightness-95">
                  Agregar Usuario
                </button>
                <button className="px-4 py-2 rounded-full bg-[#8bc27a] text-black font-semibold hover:brightness-95">
                  Editar
                </button>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="mt-4 rounded-md overflow-hidden border border-black/20">
            <div className="grid grid-cols-4 bg-[#dcc392] text-black font-semibold">
              <div className="border-r border-black/30 px-4 py-3">Nombres</div>
              <div className="border-r border-black/30 px-4 py-3">Correo Electronico</div>
              <div className="border-r border-black/30 px-4 py-3">Rol</div>
              <div className="px-4 py-3">Estado</div>
            </div>

            <div className="bg-[#dac191]">
              {loading && (
                <div className="px-4 py-6 text-black/70">Cargando usuarios…</div>
              )}

              {err && !loading && (
                <div className="px-4 py-6 text-red-700">Error: {err}</div>
              )}

              {!loading && !err && usuarios.length === 0 && (
                <div className="px-4 py-6 text-black/70">No hay usuarios registrados.</div>
              )}

              {!loading && !err && usuarios.map(u => (
                <div key={u.id} className="grid grid-cols-4 border-t border-black/20">
                  <div className="px-4 py-4 border-r border-black/20">{u.nombre}</div>
                  <div className="px-4 py-4 border-r border-black/20">{u.email}</div>
                  <div className="px-4 py-4 border-r border-black/20 capitalize">{u.rol}</div>
                  <div className="px-4 py-4">{u.estado}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
