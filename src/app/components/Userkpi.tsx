'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

type Row = { role: string; count: number };

export default function UsersByRoleBar() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/stats/users-daily', { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'No se pudo cargar');
        // Etiquetas bonitas en X
        const formatted = json.map((r: Row) => ({
          ...r,
          label: r.role === 'administrador' ? 'Admin' : 'Usuario',
        }));
        setData(formatted);
      } catch (e: any) {
        setErr(e.message ?? 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-gray-800">Cargando gráfico…</div>;
  if (err) return <div className="text-red-700">Error: {err}</div>;

  return (
    <div className="w-full h-[300px] rounded-md shadow border border-gray-200 p-3"
        style={{ backgroundColor: '#000000' }}> {/* Fondo negro */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" /> {/* grilla gris */}
          <XAxis dataKey="label" stroke="#fff" /> {/* texto blanco */}
          <YAxis allowDecimals={false} stroke="#fff" /> {/* texto blanco */}
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
            itemStyle={{ color: '#38bdf8' }}
          />
          <Bar dataKey="count" fill="#38bdf8" /> {/* celeste Tailwind cyan-400 */}
        </BarChart>
      </ResponsiveContainer>
    </div>

  );
}
