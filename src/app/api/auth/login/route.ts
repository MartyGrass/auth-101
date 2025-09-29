// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1) Basit doğrulama
    if (!email || !password) {
      return NextResponse.json(
        { error: "email ve password zorunlu" },
        { status: 400 }
      );
    }

    // 2) Kullanıcı var mı?
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Geçersiz kimlik bilgileri" },
        { status: 401 }
      );
    }

    // 3) Şifre kontrolü
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Geçersiz kimlik bilgileri" },
        { status: 401 }
      );
    }

    // 4) Başarılı (şimdilik yalnızca sade yanıt)
    return NextResponse.json(
      { ok: true, user: { id: user.id, email: user.email, name: user.name } },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Beklenmeyen hata" }, { status: 500 });
  }
}
