// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';
const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email: string = body?.email?.trim?.() ?? '';
    const password: string = body?.password ?? body?.pass ?? '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: 'Falta JWT_SECRET' }, { status: 500 });
    }

    const rows = await sql/* sql */`
      SELECT id, nombre, email, pass, tipo
      FROM usuarios
      WHERE email = ${email}
      LIMIT 1
    ` as any[];

    const user = rows[0];
    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.pass ?? '');
    if (!ok) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, tipo: user.tipo },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, tipo: user.tipo },
    });

    // ⚠️ secure solo en producción para que se guarde en http://localhost
    res.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}
