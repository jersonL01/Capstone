// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs'; // jsonwebtoken no funciona en Edge

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: 'Falta JWT_SECRET en .env.local' },
        { status: 500 }
      );
    }

    const { email, password } = await req.json();

    // 1) Buscar usuario
    const [user] = await sql/*sql*/`
      SELECT id, nombre, email, pass, tipo
      FROM usuarios
      WHERE email = ${email}
      LIMIT 1
    ` as any[];

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // 2) Comparar contraseña
    const ok = await bcrypt.compare(password, user.pass);
    if (!ok) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    // 3) Firmar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.tipo },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4) Respuesta + cookie HttpOnly
    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, nombre: user.nombre, email: user.email, tipo: user.tipo }
    });

    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // en dev debe ser false
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1h
    });

    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Error' }, { status: 500 });
  }
}
