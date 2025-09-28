'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';

type Form = {
  nombre: string;
  email: string;
  telefono: string;
  tipo: 'usuario' | 'administrador' | string;
  pass: string;
  pass2: string;
};

export default function AgregarUsuarioPage() {
  const router = useRouter();
  const [form, setForm] = useState<Form>({
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'usuario',
    pass: '',
    pass2: '',
  });
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  };

  const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErr(null);

  if (!form.nombre || !form.email || !form.pass) {
    setErr('Nombre, correo y contraseña son obligatorios');
    return;
  }
  if (form.pass !== form.pass2) {
    setErr('Las contraseñas no coinciden');
    return;
  }

  // Confirmación previa
  const { isConfirmed } = await Swal.fire({
    title: '¿Crear usuario?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, crear',
    cancelButtonText: 'Cancelar',
  });

  if (!isConfirmed) return;

  setSaving(true);
  try {
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono || null,
        tipo: form.tipo,
        pass: form.pass,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || 'No se pudo crear');

    // SweetAlert de éxito
    await Swal.fire('Creado', '✅ Usuario agregado correctamente', 'success');

    router.push('/admin/gestion-user');
    router.refresh();
  } catch (e: any) {
    setErr(e.message ?? 'Error al crear usuario');
    await Swal.fire('Error', e?.message || 'No se pudo crear el usuario', 'error');
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b6b81] text-white flex flex-col">
        <div className="px-6 py-5 text-center text-2xl font-bold bg-[#0a5a6d]">
          Panel<br />Administrativo
        </div>
        <Link href="/admin/panel" className="block px-6 py-4 hover:bg-[#0a5a6d]">Dashboard</Link>
        <Link href="/admin/gestion-user" className="block px-6 py-4 hover:bg-[#0a5a6d]">Gestión usuarios</Link>
        <Link href="/admin/perfil-user" className="block px-6 py-4 hover:bg-[#0a5a6d]">Perfil usuario</Link>
        <Link href="/admin/configuracion" className="block px-6 py-4 hover:bg-[#0a5a6d]">Configuración</Link>
        <div className="mt-auto px-6 py-4 text-sm opacity-80">@AquaSave 2025</div>
      </aside>

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        <header className="bg-[#e6b352] px-6 py-3 flex justify-between items-center border-b border-black/10">
          <h1 className="text-xl font-extrabold text-gray-900">Agregar Usuario</h1>
          <Link href="/admin/gestion-user" className="px-5 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-800">
            Volver
          </Link>
        </header>

        <main className="flex-1 p-6">
          <div className="mx-auto w-full max-w-3xl rounded-xl bg-white shadow-lg ring-1 ring-black/5">
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="text-sm text-gray-600">
                Completa los datos del nuevo usuario. Los campos con <span className="font-semibold text-gray-900">*</span> son obligatorios.
              </p>
            </div>

            <div className="px-6 py-6">
              {err && (
                <div className="mb-4 rounded-md border border-red-300 bg-red-50 text-red-800 px-3 py-2">
                  {err}
                </div>
              )}

              <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-900">
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-800">Nombre *</span>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={onChange}
                    className="h-11 rounded-md border border-gray-300 bg-white px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre completo"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-800">Correo *</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    className="h-11 rounded-md border border-gray-300 bg-white px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-800">Teléfono</span>
                  <input
                    name="telefono"
                    value={form.telefono}
                    onChange={onChange}
                    className="h-11 rounded-md border border-gray-300 bg-white px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 912345678"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-800">Rol</span>
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={onChange}
                    className="h-11 rounded-md border border-gray-300 bg-white px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="usuario">Usuario</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-800">Contraseña *</span>
                  <input
                    name="pass"
                    type="password"
                    value={form.pass}
                    onChange={onChange}
                    className="h-11 rounded-md border border-gray-300 bg-white px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-800">Confirmar contraseña *</span>
                  <input
                    name="pass2"
                    type="password"
                    value={form.pass2}
                    onChange={onChange}
                    className="h-11 rounded-md border border-gray-300 bg-white px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </label>

                <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                  <Link href="/admin/gestion-user" className="px-4 h-11 inline-flex items-center rounded-md border border-gray-300 bg-white text-gray-900 hover:bg-gray-50">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 h-11 inline-flex items-center rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                  >
                    {saving ? 'Creando…' : 'Crear usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
