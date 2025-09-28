'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Swal from 'sweetalert2';

type Form = {
  nombre: string;
  telefono: string;
  email: string;
  pass: string;
  pass2: string;
  tyc: boolean;
};

type Errors = Partial<Record<keyof Form, string>>;

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<Form>({
    nombre: '',
    telefono: '',
    email: '',
    pass: '',
    pass2: '',
    tyc: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setFieldError = (name: keyof Form, msg?: string) =>
    setErrors((e) => ({ ...e, [name]: msg }));

  const validate = (values: Form): Errors => {
    const e: Errors = {};
    if (!values.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!values.email.trim()) e.email = 'El correo es obligatorio';
    else if (!emailRegex.test(values.email)) e.email = 'Correo inválido';
    if (!values.pass) e.pass = 'La contraseña es obligatoria';
    else if (values.pass.length < 6) e.pass = 'Mínimo 6 caracteres';
    if (!values.pass2) e.pass2 = 'Confirma la contraseña';
    else if (values.pass2 !== values.pass) e.pass2 = 'Las contraseñas no coinciden';
    if (!values.tyc) e.tyc = 'Debes aceptar TyC';
    // Teléfono es opcional; si quieres validar formato, agrega acá
    return e;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const v = type === 'checkbox' ? checked : value;
    setForm((s) => ({ ...s, [name]: v }));

    // validación “en vivo” por campo
    switch (name as keyof Form) {
      case 'nombre':
        setFieldError('nombre', v ? undefined : 'El nombre es obligatorio');
        break;
      case 'email':
        setFieldError('email', !v ? 'El correo es obligatorio' : emailRegex.test(String(v)) ? undefined : 'Correo inválido');
        break;
      case 'pass':
        setFieldError('pass', !v ? 'La contraseña es obligatoria' : String(v).length < 6 ? 'Mínimo 6 caracteres' : undefined);
        // si ya hay pass2, revalida coincidencia
        if (form.pass2) setFieldError('pass2', form.pass2 === String(v) ? undefined : 'Las contraseñas no coinciden');
        break;
      case 'pass2':
        setFieldError('pass2', String(v) === form.pass ? undefined : 'Las contraseñas no coinciden');
        break;
      case 'tyc':
        setFieldError('tyc', checked ? undefined : 'Debes aceptar TyC');
        break;
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const v = validate(form);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      // focus al primer error
      const firstKey = Object.keys(v)[0] as keyof Form;
      const el = document.querySelector<HTMLInputElement>(`[name="${firstKey}"]`);
      el?.focus();
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono || null,
          pass: form.pass,
          tipo: 'usuario',
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        await Swal.fire('Éxito', '✅ Usuario creado en Neon!', 'success');
        router.push('/auth/login');
        router.refresh();
      } else {
        await Swal.fire('Error', `❌ ${data?.error || 'No se pudo crear el usuario'}`, 'error');
      }
    } catch (error: any) {
      await Swal.fire('Error', '❌ Error de conexión con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof Form) =>
    `w-full h-12 pl-12 pr-3 rounded-md bg-white/35 text-white placeholder-white/70
     border ${errors[field] ? 'border-red-400 ring-2 ring-red-400/60' : 'border-white/30'}
     focus:outline-none focus:ring-2 ${errors[field] ? 'focus:ring-red-400' : 'focus:ring-white/60'}`;

  return (
    <div className="relative min-h-svh w-full">
      <Navbar />
      <Image src="/img/fondo_auth.png" alt="Fondo" fill priority className="object-cover" />

      {/* Overlay loading */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <svg className="w-14 h-14 animate-spin text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}

      <div className="relative z-10 flex items-center justify-center min-h-svh">
        <div
          className="w-[92%] max-w-[720px] rounded-xl border border-white/15
                     bg-gradient-to-b from-white/15 to-white/10 backdrop-blur-md
                     shadow-[0_8px_40px_rgba(0,0,0,0.35)] px-8 py-10"
        >
          <h1 className="text-white text-4xl md:text-5xl font-extrabold text-center mb-8 drop-shadow">
            Registrarse
          </h1>

          <form onSubmit={submit} className="space-y-5">
            {/* Nombre */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-2 bg-black/25">
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-white/90">
                  <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Zm0 2c-3.866 0-7 3.134-7 7 0 .553.447 1 1 1h12c.553 0 1-.447 1-1 0-3.866-3.134-7-7-7Z"/>
                </svg>
              </div>
              <input
                name="nombre"
                value={form.nombre}
                onChange={onChange}
                placeholder="Nombre Completo"
                className={inputClass('nombre')}
                aria-invalid={!!errors.nombre}
                aria-describedby={errors.nombre ? 'err-nombre' : undefined}
              />
              {errors.nombre && <p id="err-nombre" className="mt-1 text-sm text-red-300">{errors.nombre}</p>}
            </div>

            {/* Teléfono (opcional) */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-2 bg-black/25">
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-white/90">
                  <path d="M6.6 10.8a15.053 15.053 0 006.6 6.6l2.2-2.2c.2-.2.5-.3.8-.2 1 .3 2 .5 3 .5.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1 .2 2 .5 3 .1.3 0 .6-.2.8l-2.2 2.2z"/>
                </svg>
              </div>
              <input
                name="telefono"
                value={form.telefono}
                onChange={onChange}
                placeholder="Teléfono"
                className="w-full h-12 pl-12 pr-3 rounded-md bg-white/35 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-2 bg-black/25">
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-white/90">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="Correo Electrónico"
                className={inputClass('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'err-email' : undefined}
              />
              {errors.email && <p id="err-email" className="mt-1 text-sm text-red-300">{errors.email}</p>}
            </div>

            {/* Contraseña */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-2 bg-black/25">
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-white/90">
                  <path d="M17 8h-1V6a4 4 0 10-8 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2zm-6 6.73V17h2v-2.27a2 2 0 10-2 0zM9 8V6a3 3 0 116 0v2H9z"/>
                </svg>
              </div>
              <input
                name="pass"
                type="password"
                value={form.pass}
                onChange={onChange}
                placeholder="Contraseña"
                className={inputClass('pass')}
                aria-invalid={!!errors.pass}
                aria-describedby={errors.pass ? 'err-pass' : undefined}
              />
              {errors.pass && <p id="err-pass" className="mt-1 text-sm text-red-300">{errors.pass}</p>}
            </div>

            {/* Confirmar Contraseña */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-2 bg-black/25">
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-white/90">
                  <path d="M17 8h-1V6a4 4 0 10-8 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2zm-6 6.73V17h2v-2.27a2 2 0 10-2 0zM9 8V6a3 3 0 116 0v2H9z"/>
                </svg>
              </div>
              <input
                name="pass2"
                type="password"
                value={form.pass2}
                onChange={onChange}
                placeholder="Confirmar Contraseña"
                className={inputClass('pass2')}
                aria-invalid={!!errors.pass2}
                aria-describedby={errors.pass2 ? 'err-pass2' : undefined}
              />
              {errors.pass2 && <p id="err-pass2" className="mt-1 text-sm text-red-300">{errors.pass2}</p>}
            </div>

            {/* TyC */}
            <div>
              <label className="flex items-center gap-2 text-white/90 text-sm">
                <input
                  type="checkbox"
                  name="tyc"
                  checked={form.tyc}
                  onChange={onChange}
                  className="accent-white/90"
                  aria-invalid={!!errors.tyc}
                />
                <span>
                  Acepto los <span className="font-semibold">Términos y Condiciones</span>
                </span>
              </label>
              {errors.tyc && <p className="mt-1 text-sm text-red-300">{errors.tyc}</p>}
            </div>

            {/* Botón */}
            <button
              className="mx-auto block w-[60%] md:w-[48%] h-11 rounded-lg
                         bg-[#c79a3c] hover:bg-[#b98e35] text-white font-semibold
                         shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creando…' : 'Crear Cuenta'}
            </button>

            {/* Enlace inferior */}
            <p className="text-center text-white/90 mt-2">
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/login" className="font-semibold underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
