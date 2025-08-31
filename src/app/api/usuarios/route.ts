import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/usuarios  -> lista usuarios para tu tabla
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
