'use client';

import Link from 'next/link';

export default function AdminPanel() {
  return (
    <div className="flex min-h-screen bg-[#e5e5e5]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b6b81] text-white flex flex-col">
        <div className="px-6 py-5 text-center text-2xl font-bold bg-[#0a5a6d]">
          Panel<br/>Administrativo
        </div>

        {/* item activo */}
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
            Gestion usuarios
          </Link>
          <Link href="/admin/perfil-user" className="block px-4 py-3 rounded hover:bg-[#0a5a6d]">
            Perfil usuario
          </Link>
          <Link href="/admin/configuracion" className="block px-4 py-3 rounded hover:bg-[#0a5a6d]">
            Configuracion
          </Link>
        </nav>

        <div className="px-6 py-4 text-sm opacity-80">@AquaSave 2025</div>
      </aside>

      {/* Columna derecha */}
      <div className="flex-1 flex flex-col">
        {/* Topbar dorado */}
        <header className="bg-[#e6b352] px-6 py-3 flex justify-between items-center border-b border-black/10">
          <h1 className="text-xl font-bold text-black">Dashboard</h1>
          <button className="px-5 py-2 rounded bg-[#e63929] text-white font-semibold hover:brightness-95">
            Cerrar Sesión
          </button>
        </header>

        {/* Contenido */}
        <main className="flex-1 p-6 space-y-6">
          {/* fila superior: usuarios activos + notificaciones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Usuarios activos */}
            <div className="md:col-span-1">
              <div className="rounded-lg bg-[#7fbf7b] text-black font-semibold px-4 py-3 shadow">
                Usuarios Activos: 20
              </div>

              {/* Últimos registrados (tarjeta alta) */}
              <div className="mt-4 rounded-xl bg-[#f0b34f] text-black p-4 shadow min-h-[260px]">
                <h3 className="text-xl font-semibold mb-3">
                  Ultimos usuarios<br/>Registrados:
                </h3>
                <ul className="space-y-2 text-lg">
                  <li>juanito</li>
                  <li>pedrito</li>
                  <li>dieguito</li>
                </ul>
              </div>
            </div>

            {/* Notificaciones */}
            <div className="md:col-span-2">
              <div className="rounded-xl bg-[#f0b34f] text-black p-4 shadow">
                <h3 className="text-xl font-semibold mb-3">Notificaciones</h3>
                <ul className="space-y-3 text-sm md:text-base">
                  <li>• Pedrito a realizado cambios en su perfil</li>
                  <li>• Juanito Inicio Sesión por ultima vez el 31/08/2025</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Roles distribuidos (gráfico simple) */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-black">Roles Distribuidos</h3>
            <div className="rounded bg-[#1f1f1f] p-4 shadow text-white">
              {/* “gráfico” de ejemplo con barras usando divs */}
              <div className="h-64 flex items-end gap-6 px-6 pb-6 border-b border-white/20">
                {/* Admin (5) */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 bg-[#3b82f6]" style={{ height: '25%' }} />
                  <span className="text-xs opacity-80">Admin</span>
                </div>
                {/* Usuario Normal (15) */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 bg-[#3b82f6]" style={{ height: '75%' }} />
                  <span className="text-xs opacity-80 text-center">Usuario Normal</span>
                </div>
                {/* Invitado (3) */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 bg-[#3b82f6]" style={{ height: '15%' }} />
                  <span className="text-xs opacity-80">Invitado</span>
                </div>
              </div>
              <div className="px-6 pt-2 text-xs opacity-70">Cantidad</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
