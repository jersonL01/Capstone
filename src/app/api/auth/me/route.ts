// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const jar = await cookies();
    const raw = jar.get('token')?.value;
    if (!raw) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: 'Falta JWT_SECRET' }, { status: 500 });
    }

    const payload = jwt.verify(raw, process.env.JWT_SECRET!) as any; // { id, email, tipo }
    return NextResponse.json({
      id: payload.id,
      email: payload.email,
      tipo: payload.tipo,   // ej: 'administrador' | 'usuario'
    });
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
