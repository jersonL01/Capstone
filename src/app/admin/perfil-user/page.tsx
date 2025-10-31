// src/app/admin/perfil-user/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { signOut } from 'next-auth/react';

/** Parseo seguro: intenta leer JSON solo si el response realmente lo trae
 *  y evita romper con "Unexpected end of JSON input".
 */
async function readJsonSafe(res: Response) {
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function PerfilUsuarioPage() {
  const [form, setForm] = useState({
    nombres: '',
    telefono: '',
    email: '',
    pass: '', // opcional en UI; no se actualiza en OAuth
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Carga de datos del usuario autenticado
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch('/api/perfil', { method: 'GET', cache: 'no-store' });

        if (res.status === 401) {
          setErr('No autenticado');
          router.push('/auth/login');
          return;
        }

        const data = await readJsonSafe(res);
        if (!res.ok) {
          const msg = (data && (data.error || data.message)) || `Error HTTP ${res.status}`;
          throw new Error(msg);
        }
        if (!data) throw new Error('Respuesta vacía del servidor');

        if (!alive) return;
        setForm({
          nombres: data.nombres ?? '',
          telefono: data.telefono ?? '',
          email: data.email ?? '',
          pass: '',
        });
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? 'Error al cargar el perfil');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  // Cerrar sesión con NextAuth
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await signOut({ callbackUrl: '/' });
    } finally {
      setLoggingOut(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // Guardar cambios del perfil
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    const { isConfirmed } = await Swal.fire({
      title: '¿Guardar cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;

    setSaving(true);
    try {
      // Solo actualizamos nombre y teléfono; el password no aplica para OAuth
      const payload = { nombres: form.nombres, telefono: form.telefono };

      const res = await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setErr('No autenticado');
        router.push('/auth/login');
        return;
      }

      const data = await readJsonSafe(res);
      if (!res.ok) {
        const msg = (data && (data.error || data.message)) || `Error HTTP ${res.status}`;
        throw new Error(msg);
      }
      if (!data) throw new Error('Respuesta vacía del servidor');

      await Swal.fire('Guardado', 'Cambios guardados correctamente', 'success');
      setForm((s) => ({ ...s, pass: '' }));
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? 'Error al guardar');
      await Swal.fire('Error', e?.message || 'No se pudo guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const onReset = () => setForm({ nombres: '', telefono: '', email: '', pass: '' });

  return (
    <div className="flex min-h-screen bg-[#e5e5e5]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b6b81] text-white flex flex-col">
        <div className="px-6 py-5 text-center text-2xl font-bold bg-[#0a5a6d]">
          Panel<br />Administrativo
        </div>

        <Link href="/admin/panel" className="block px-6 py-4 hover:bg-[#0a5a6d]">Dashboard</Link>
        <Link href="/admin/gestion-user" className="block px-6 py-4 hover:bg-[#0a5a6d]">Gestion usuarios</Link>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-2 bg-[#16a2a8]" />
          <Link href="/admin/perfil-user" className="block px-6 py-4 mt-4 rounded-r-lg bg-[#3a2fd4] text-white font-medium shadow-inner">
            Perfil usuario
          </Link>
        </div>

        <Link href="/admin/configuracion" className="block px-6 py-4 hover:bg-[#0a5a6d]">Configuracion</Link>
        <div className="mt-auto px-6 py-4 text-sm opacity-80">@AquaSave 2025</div>
      </aside>

      {/* Columna derecha */}
      <div className="flex-1 flex flex-col">
        <header className="bg-[#e6b352] px-6 py-3 flex justify-between items-center border-b border-black/10">
          <h1 className="text-xl font-bold text-black">Perfil Usuario</h1>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-5 py-2 rounded bg-[#e63929] text-white font-semibold hover:brightness-95 disabled:opacity-60"
          >
            {loggingOut ? 'Cerrando…' : 'Cerrar Sesión'}
          </button>
        </header>

        <main className="flex-1 p-6">
          <div className="bg-[#d9d9d9] rounded-md p-6">
            {loading ? (
              <p className="text-sm">Cargando perfil…</p>
            ) : err ? (
              <p className="text-sm text-red-700">Error: {err}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Avatar */}
                <div className="flex justify-center md:justify-start">
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center border-8 border-black/80">
                    <svg viewBox="0 0 24 24" className="w-16 h-16" aria-hidden="true">
                      <circle cx="12" cy="8" r="3.5" fill="#8fb2ff" stroke="black" strokeWidth="1.5" />
                      <path d="M4.5 19.5c1.2-4.2 5.1-5.8 7.5-5.8s6.3 1.6 7.5 5.8" fill="#8fb2ff" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="12" cy="12" r="10" fill="none" stroke="black" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

                {/* Formulario */}
                <div className="md:col-span-2">
                  <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                    <div>
                      <label className="block text-black font-semibold mb-2">Nombre Completo</label>
                      <input
                        name="nombres"
                        value={form.nombres}
                        onChange={onChange}
                        className="w-full h-10 rounded-lg bg-[#dcc392] px-4 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-black font-semibold mb-2">Telefono</label>
                      <input
                        name="telefono"
                        value={form.telefono}
                        onChange={onChange}
                        className="w-full h-10 rounded-lg bg-[#dcc392] px-4 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-black font-semibold mb-2">Correo Electronico</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        readOnly
                        className="w-full h-10 rounded-lg bg-[#dcc392] px-4 outline-none"
                      />
                    </div>

                    {/* Campo de contraseña opcional en UI, pero no se actualiza en OAuth */}
                    <div className="md:col-span-2">
                      <label className="block text-black font-semibold mb-2">Contraseña</label>
                      <input
                        name="pass"
                        type="password"
                        value={form.pass}
                        onChange={onChange}
                        placeholder="********"
                        className="w-full h-10 rounded-lg bg-[#dcc392] px-4 outline-none"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 rounded-full bg-[#8bc27a] text-black font-semibold hover:brightness-95 disabled:opacity-60"
                      >
                        {saving ? 'Guardando…' : 'Guardar'}
                      </button>
                      <button
                        type="button"
                        onClick={onReset}
                        className="px-6 py-2 rounded-full bg-[#e63929] text-white font-semibold hover:brightness-95"
                      >
                        Limpiar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
