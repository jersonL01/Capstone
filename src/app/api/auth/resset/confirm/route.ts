import { NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // 1) Validar token
    const tokenRes = await pool.query(
      "SELECT * FROM reset_tokens WHERE token=$1 AND usado=false AND expiracion > NOW()",
      [token]
    );

    if (tokenRes.rowCount === 0) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 });
    }

    const resetData = tokenRes.rows[0];

    // 2) Encriptar nueva contraseña
    const hashed = await bcrypt.hash(newPassword, 10);

    // 3) Actualizar usuario
    await pool.query("UPDATE usuarios SET pass=$1 WHERE id=$2", [hashed, resetData.user_id]);

    // 4) Marcar token como usado
    await pool.query("UPDATE reset_tokens SET usado=true WHERE id=$1", [resetData.id]);

    return NextResponse.json({ message: "Contraseña actualizada correctamente" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
