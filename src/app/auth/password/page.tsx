'use client';

import { useState } from 'react';

export default function RequestResetPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');

    const res = await fetch('/api/auth/reset/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setMsg('✅ Revisa tu correo para continuar');
    } else {
      setMsg(`❌ ${data.error}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h1 className="text-xl font-bold mb-4">Recuperar contraseña</h1>
        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded w-full py-2 px-3 mb-4"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Enviar enlace
        </button>
        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </form>
    </div>
  );
}
