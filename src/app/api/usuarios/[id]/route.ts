import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/usuarios/:id -> obtener un usuario
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

  try {
    const [u] = await sql/*sql*/`
      SELECT id, nombre, email, telefono, COALESCE(tipo,'usuario') AS tipo
      FROM usuarios
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!u) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    return NextResponse.json(u, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Error' }, { status: 500 });
  }
}

// PUT /api/usuarios/:id -> actualizar usuario
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

  try {
    const { nombre, email, telefono, tipo = 'usuario', pass } = await req.json() as {
      nombre: string;
      email: string;
      telefono?: string | number | null;
      tipo?: string;
      pass?: string;
    };

    if (!nombre || !email) {
      return NextResponse.json({ error: 'nombre y email son requeridos' }, { status: 400 });
    }

    // Si viene contraseña, la hasheamos; si no, mantenemos la actual (COALESCE)
    const hash = pass && pass.trim() ? await bcrypt.hash(pass, 10) : null;

    const [u] = await sql/*sql*/`
      UPDATE usuarios
      SET nombre   = ${nombre},
          email    = ${email},
          telefono = ${telefono ?? null},
          tipo     = ${tipo},
          pass     = COALESCE(${hash}, pass)
      WHERE id = ${id}
      RETURNING id, nombre, email, telefono, tipo
    `;

    if (!u) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    return NextResponse.json(u, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

  try {
    await sql/*sql*/`DELETE FROM usuarios WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Error' }, { status: 500 });
  }
}
