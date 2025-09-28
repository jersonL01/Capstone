'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

type Form = {
  nombre: string;
  email: string;
  telefono: string;
  tipo: 'usuario' | 'administrador' | string;
  pass: string;
};

export default function EditarUsuarioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<Form>({
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'usuario',
    pass: '',
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/usuarios/${id}`, { cache: 'no-store', credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'No se pudo cargar el usuario');
        setForm({
          nombre: data.nombre ?? '',
          email: data.email ?? '',
          telefono: data.telefono ?? '',
          tipo: data.tipo ?? 'usuario',
          pass: '',
        });
      } catch (e: any) {
        setErr(e.message ?? 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  };

 const save = async (e: React.FormEvent) => {
  e.preventDefault();
  setErr(null);

  const result = await Swal.fire({
    title: '¿Guardar cambios?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, guardar',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: () => !Swal.isLoading(),
    preConfirm: async () => {
      setSaving(true);
      try {
        const res = await fetch(`/api/usuarios/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'No se pudo guardar');
      } catch (err: any) {
        Swal.showValidationMessage(err?.message || 'No se pudo guardar');
        throw err;
      } finally {
        setSaving(false);
      }
    }
  });

  if (result.isConfirmed) {
    await Swal.fire('Guardado', '✅ Cambios guardados correctamente', 'success');
    router.push('/admin/gestion-user');
    router.refresh();
  }
};


  if (loading) return <div className="p-6 text-gray-800">Cargando usuario…</div>;

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

      {/* Columna derecha */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-[#e6b352] px-6 py-3 flex justify-between items-center border-b border-black/10">
          <h1 className="text-xl font-extrabold text-gray-900">Editar Usuario #{id}</h1>
          <Link
            href="/admin/gestion-user"
            className="px-5 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            Volver
          </Link>
        </header>

        {/* Formulario */}
        <main className="flex-1 p-6">
          <div className="mx-auto w-full max-w-3xl rounded-xl bg-white shadow-lg ring-1 ring-black/5">
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="text-sm text-gray-600">
                Actualiza los datos del usuario. Los campos con <span className="font-semibold text-gray-900">* </span>son obligatorios.
              </p>
            </div>

            <div className="px-6 py-6">
              {err && (
                <div className="mb-4 rounded-md border border-red-300 bg-red-50 text-red-800 px-3 py-2">
                  {err}
                </div>
              )}

              <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-900">
                {/* Nombre */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-800">Nombre *</span>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={onChange}
                    className="h-11 rounded-md border border-gray-300 bg-white px-3 text-gray-900 placeholder:text-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre completo"
                    required
                  />
                </label>

                {/* Correo */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-800">Correo *</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    className="h-11 rounded-md border border-gray-300 bg-white px-3 text-gray-900 placeholder:text-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </label>

                {/* Teléfono */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-800">Teléfono</span>
                  <input
                    name="telefono"
                    value={form.telefono}
                    onChange={onChange}
                    className="h-11 rounded-md border border-gray-300 bg-white px-3 text-gray-900 placeholder:text-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 912345678"
                  />
                </label>

                {/* Rol */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-800">Rol</span>
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={onChange}
                    className="h-11 rounded-md border border-gray-300 bg-white px-3 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="usuario">Usuario</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </label>

                {/* Password */}
                <label className="md:col-span-2 flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-800">Nueva contraseña (opcional)</span>
                  <input
                    name="pass"
                    type="password"
                    value={form.pass}
                    onChange={onChange}
                    placeholder="Déjala vacía para no cambiarla"
                    className="h-11 rounded-md border border-gray-300 bg-white px-3 text-gray-900 placeholder:text-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>

                {/* Botones */}
                <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 h-11 inline-flex items-center rounded-md bg-blue-600 text-white font-semibold
                               hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600
                               disabled:opacity-60"
                  >
                    {saving ? 'Guardando…' : 'Guardar cambios'}
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
