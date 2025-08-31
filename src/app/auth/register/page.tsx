'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
    pass: '',
    pass2: '',
    tyc: false,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.pass !== form.pass2) {
      alert('❌ Las contraseñas no coinciden');
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        pass: form.pass,
        tipo: 'usuario',
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('✅ Usuario creado en Neon!');
      router.push('/auth/login'); // redirige al login
    } else {
      alert(`❌ Error: ${data.error}`);
    }
  };

  return (
	
    <div className="relative min-h-svh w-full">
		<Navbar />
      {/* Fondo agua */}
      <Image
        src="/img/fondo_auth.png"
        alt="Fondo"
        fill
        priority
        className="object-cover"
      />

      {/* Contenedor central */}
      <div className="relative z-10 flex items-center justify-center min-h-svh">
        <div
          className="
          w-[92%] max-w-[720px]
          rounded-xl border border-white/15
          bg-gradient-to-b from-white/15 to-white/10
          backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.35)]
          px-8 py-10
        "
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
                className="w-full h-12 pl-12 pr-3 rounded-md
                  bg-white/35 text-white placeholder-white/70
                  border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
              />
            </div>

            {/* Teléfono */}
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
                className="w-full h-12 pl-12 pr-3 rounded-md
                  bg-white/35 text-white placeholder-white/70
                  border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
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
                className="w-full h-12 pl-12 pr-3 rounded-md
                  bg-white/35 text-white placeholder-white/70
                  border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
              />
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
                className="w-full h-12 pl-12 pr-3 rounded-md
                  bg-white/35 text-white placeholder-white/70
                  border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
              />
            </div>

            {/* Confirmar */}
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
                className="w-full h-12 pl-12 pr-3 rounded-md
                  bg-white/35 text-white placeholder-white/70
                  border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
              />
            </div>

            {/* TyC */}
            <label className="flex items-center gap-2 text-white/90 text-sm">
              <input
                type="checkbox"
                name="tyc"
                checked={form.tyc}
                onChange={onChange}
                className="accent-white/90"
              />
              <span>
                Acepto los <span className="font-semibold">Términos y Condiciones</span>
              </span>
            </label>

            {/* Botón dorado */}
            <button
              className="mx-auto block w-[60%] md:w-[48%] h-11 rounded-lg
                bg-[#c79a3c] hover:bg-[#b98e35] text-white font-semibold
                shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition"
              type="submit"
              disabled={!form.tyc}
            >
              Crear Cuenta
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
