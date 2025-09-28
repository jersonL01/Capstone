// src/app/auth/login/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // 👈 nuevo
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un correo válido.');
      return;
    }
    if (password.trim().length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true); // 👈 activa spinner

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión');
        setLoading(false); // apaga spinner si hay error
        return;
      }

      router.push('/admin/panel');
      router.refresh();
    } catch {
      setError('Error de conexión');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-svh w-full">
      <Navbar />
      <Image src="/img/fondo_auth.png" alt="Fondo" fill priority className="object-cover" />

      {/* Overlay con spinner */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <svg
            className="w-14 h-14 animate-spin text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      )}

      <div className="relative z-10 flex items-center justify-center min-h-svh">
        <div className="w-[92%] max-w-[420px] rounded-xl border border-white/15
                        bg-gradient-to-b from-white/15 to-white/10 backdrop-blur-md
                        shadow-[0_8px_40px_rgba(0,0,0,0.35)] px-8 py-10 flex flex-col items-center">

          <div className="w-28 h-28 mb-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg overflow-hidden">
            <Image src="/img/iconoUser.png" alt="Usuario" width={80} height={80} className="object-contain" priority />
          </div>

          <h1 className="text-white text-3xl font-bold text-center mb-6">Iniciar Sesión</h1>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Email */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-2 bg-black/30">
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-white/90">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo Electrónico"
                className="w-full h-12 pl-12 pr-3 rounded-md bg-white/35 text-white placeholder-white/70
                           border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-2 bg-black/30">
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-white/90">
                  <path d="M17 8h-1V6a4 4 0 10-8 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2zm-6 6.7V17h2v-2.3a2 2 0 10-2 0zM9 8V6a3 3 0 016 0v2H9z" />
                </svg>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full h-12 pl-12 pr-3 rounded-md bg-white/35 text-white placeholder-white/70
                           border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm font-semibold text-center">{error}</p>}

            <div className="flex items-center justify-between text-sm text-white/90">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-white/90" />
                Remember me
              </label>
              <Link href="#" className="underline hover:text-blue-200">Recuperar Contraseña</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-[#c79a3c] hover:bg-[#b98e35] text-white font-semibold
                         shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition disabled:opacity-60"
            >
              {loading ? 'Ingresando…' : 'Iniciar Sesión'}
            </button>

            <p className="text-center text-white/90 mt-3">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/register" className="font-semibold underline">Regístrate</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
