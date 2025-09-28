import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/stats/users-by-role
export async function GET() {
  try {
    const rows = await sql/*sql*/`
      SELECT COALESCE(tipo, 'usuario') AS role, COUNT(*)::int AS count
      FROM usuarios
      GROUP BY COALESCE(tipo, 'usuario')
    `;

    // Normaliza para siempre devolver ambas barras (aunque una sea 0)
    const map = new Map<string, number>();
    for (const r of rows as any[]) map.set(String(r.role), Number(r.count));

    const result = [
      { role: 'administrador', count: map.get('administrador') ?? 0 },
      { role: 'usuario',       count: map.get('usuario') ?? 0 },
    ];

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Error' }, { status: 500 });
  }
}
