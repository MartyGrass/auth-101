// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "email ve password zorunlu" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "password en az 6 karakter" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "Bu email zaten kayıtlı" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, name: name ?? null, password: hashed },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Beklenmeyen hata" }, { status: 500 });
  }
}
