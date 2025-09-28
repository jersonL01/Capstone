'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ConfiguracionPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Error al cerrar sesión', err);
    } finally {
      setLoggingOut(false);
    }
  };

  // Tarjeta reutilizable
  const Card = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="rounded-xl bg-[#e6b352] p-4 shadow-sm border border-black/10">
      <div className="font-bold text-black mb-2">{title}</div>
      <div className="space-y-2 text-sm text-black/80">{children}</div>
    </div>
  );

  const Btn = ({
    children,
    onClick,
    variant = 'primary',
    type = 'button',
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'ghost';
    type?: 'button' | 'submit' | 'reset';
  }) => (
    <button
      type={type}
      onClick={onClick}
      className={
        variant === 'primary'
          ? 'px-3 py-1 rounded-full bg-black/80 text-white text-xs hover:brightness-95'
          : 'px-3 py-1 rounded-full bg-white/40 text-black/80 text-xs border border-black/20 hover:bg-white/60'
      }
    >
      {children}
    </button>
  );

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

        <Link href="/admin/gestion-user" className="block px-6 py-4 hover:bg-[#0a5a6d]">
          Gestion usuarios
        </Link>

        <Link href="/admin/perfil-user" className="block px-6 py-4 hover:bg-[#0a5a6d]">
          Perfil usuario
        </Link>

        {/* Configuración (activo) */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-2 bg-[#16a2a8]" />
          <Link
            href="/admin/configuracion"
            className="block px-6 py-4 mt-4 rounded-r-lg bg-[#3a2fd4] text-white font-medium shadow-inner"
          >
            Configuracion
          </Link>
        </div>

        <div className="mt-auto px-6 py-4 text-sm opacity-80">@AquaSave 2025</div>
      </aside>

      {/* Columna derecha */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-[#e6b352] px-6 py-3 flex justify-between items-center border-b border-black/10">
          <h1 className="text-xl font-bold text-black">Configuracion</h1>
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
          <div className="bg-[#d9d9d9] rounded-md p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Configuraciones Generales */}
              <Card title="Configuraciones Generales">
                <ul className="list-disc pl-5">
                  <li>Nombre de la aplicación</li>
                  <li>Logo</li>
                  <li>Idioma</li>
                  <li>Zona horaria</li>
                </ul>
                <div className="pt-2 flex gap-2">
                  <Btn onClick={() => alert('Abrir formulario: Nombre/Logo/Idioma/TimeZone')}>Editar</Btn>
                  <Btn variant="ghost" onClick={() => alert('Vista previa')}>Vista previa</Btn>
                </div>
              </Card>

              {/* Roles y Permisos */}
              <Card title="Roles y Permisos">
                <ul className="list-disc pl-5">
                  <li>Crear nuevos roles</li>
                  <li>Editar permisos</li>
                </ul>
                <div className="pt-2 flex gap-2">
                  <Btn onClick={() => alert('Crear rol')}>Nuevo rol</Btn>
                  <Btn variant="ghost" onClick={() => alert('Gestionar permisos')}>Permisos</Btn>
                </div>
              </Card>

              {/* Seguridad */}
              <Card title="Seguridad">
                <ul className="list-disc pl-5">
                  <li>Cambiar políticas de contraseña</li>
                  <li>Autenticación de dos pasos</li>
                </ul>
                <div className="pt-2 flex gap-2">
                  <Btn onClick={() => alert('Políticas de contraseña')}>Políticas</Btn>
                  <Btn variant="ghost" onClick={() => alert('Configurar 2FA')}>Configurar 2FA</Btn>
                </div>
              </Card>

              {/* Notificaciones */}
              <Card title="Notificaciones">
                <ul className="list-disc pl-5">
                  <li>Notificaciones por correo</li>
                  <li>Alertas internas</li>
                </ul>
                <div className="pt-2 flex gap-2">
                  <Btn onClick={() => alert('SMTP/plantillas email')}>Configurar correo</Btn>
                  <Btn variant="ghost" onClick={() => alert('Alertas internas')}>Alertas</Btn>
                </div>
              </Card>

              {/* Integraciones */}
              <Card title="Integraciones">
                <ul className="list-disc pl-5">
                  <li>Correo SMTP</li>
                  <li>API Keys</li>
                </ul>
                <div className="pt-2 flex gap-2">
                  <Btn onClick={() => alert('Configurar SMTP')}>SMTP</Btn>
                  <Btn variant="ghost" onClick={() => alert('Gestionar API Keys')}>API Keys</Btn>
                </div>
              </Card>

              {/* Copias de Seguridad */}
              <Card title="Copias De Seguridad">
                <ul className="list-disc pl-5">
                  <li>Generar copia de seguridad</li>
                  <li>Lista de copias recientes</li>
                </ul>
                <div className="pt-2 flex gap-2">
                  <Btn onClick={() => alert('Generar backup ahora')}>Generar</Btn>
                  <Btn variant="ghost" onClick={() => alert('Ver copias recientes')}>Ver copias</Btn>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
