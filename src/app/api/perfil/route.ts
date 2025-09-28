import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';

export const runtime = 'nodejs'; // jsonwebtoken no va en Edge

const sql = neon(process.env.DATABASE_URL!);

// GET /api/perfil
export async function GET() {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json({ error: 'Falta JWT_SECRET' }, { status: 500 });
    }

    const cookieStore = await cookies();            // 👈 ahora con await
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);      // { id, email, rol }
    } catch {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const [user] = await sql/*sql*/`
      SELECT id, nombre AS nombres, telefono, email
      FROM usuarios
      WHERE id = ${payload.id}
      LIMIT 1
    ` as any[];

    if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    return NextResponse.json({
      id: user.id,
      nombres: user.nombres ?? '',
      telefono: user.telefono ?? '',
      email: user.email ?? '',
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}

// PUT /api/perfil
export async function PUT(req: Request) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json({ error: 'Falta JWT_SECRET' }, { status: 500 });
    }

    const cookieStore = await cookies();            // 👈 también con await
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const body = await req.json();
    const nombres = (body?.nombres as string) ?? '';
    const telefono = (body?.telefono as string) ?? '';

    const [updated] = await sql/*sql*/`
      UPDATE usuarios
      SET nombre = ${nombres}, telefono = ${telefono}
      WHERE id = ${payload.id}
      RETURNING id, nombre AS nombres, telefono, email
    ` as any[];

    return NextResponse.json(updated, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
