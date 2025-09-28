// src/app/api/usuarios/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/usuarios -> lista usuarios para la tabla
export async function GET() {
  try {
    const rows = await sql/*sql*/`
      SELECT 
        id,
        nombre,
        email,
        COALESCE(tipo, 'usuario')  AS rol,
        'Activo'::text             AS estado
      FROM usuarios
      ORDER BY id DESC
    `;
    return NextResponse.json(rows, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Error' }, { status: 500 });
  }
}

// POST /api/usuarios -> crear usuario
export async function POST(req: Request) {
  try {
    const { nombre, email, telefono = null, tipo = 'usuario', pass } = await req.json();

    if (!nombre || !email || !pass) {
      return NextResponse.json(
        { error: 'nombre, email y pass son requeridos' },
        { status: 400 }
      );
    }

    // ¿email ya existe?
    const [exists] = await sql/*sql*/`
      SELECT 1 FROM usuarios WHERE email = ${email} LIMIT 1
    `;
    if (exists) {
      return NextResponse.json(
        { error: 'El correo ya está registrado' },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(pass, 10);

    const [u] = await sql/*sql*/`
      INSERT INTO usuarios (nombre, email, telefono, tipo, pass)
      VALUES (${nombre}, ${email}, ${telefono}, ${tipo}, ${hash})
      RETURNING id, nombre, email, telefono, tipo
    `;

    return NextResponse.json(u, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Error' }, { status: 500 });
  }
}
