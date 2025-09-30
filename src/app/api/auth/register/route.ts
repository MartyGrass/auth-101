import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const runtime = 'nodejs';

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { name, email, password } = RegisterSchema.parse(json);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: false, error: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err: any) {
    const message = err?.issues?.[0]?.message ?? 'Unexpected error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
