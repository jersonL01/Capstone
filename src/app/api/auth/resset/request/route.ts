import { NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";
import nodemailer from "nodemailer";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "El correo es requerido" }, { status: 400 });
    }

    // 1) Buscar usuario
    const userRes = await pool.query("SELECT id FROM usuarios WHERE email=$1", [email]);
    if (userRes.rowCount === 0) {
      return NextResponse.json({ error: "No existe un usuario con ese correo" }, { status: 404 });
    }
    const userId = userRes.rows[0].id;

    // 2) Generar token
    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 1000 * 60 * 15); // 15 min

    // 3) Guardar token en tabla
    await pool.query(
      `INSERT INTO reset_tokens (user_id, token, expiracion) VALUES ($1, $2, $3)`,
      [userId, token, expiration]
    );

    // 4) Enviar correo con enlace
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // usa una App Password en Gmail
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset/${token}`;

    await transporter.sendMail({
      from: `"Soporte AquaSave" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Recuperar contraseña",
      html: `
        <p>Solicitaste recuperar tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para restablecerla (expira en 15 min):</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });

    return NextResponse.json({ message: "Correo enviado con instrucciones" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
