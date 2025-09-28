import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true, message: "Sesión cerrada" });

  // Borrar cookie 'token'
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // Expira inmediatamente
  });

  return res;
}
