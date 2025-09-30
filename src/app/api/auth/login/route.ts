import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z, ZodError } from 'zod';

export const runtime = 'nodejs';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { email, password } = LoginSchema.parse(payload);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ ok: false, error: 'Server config error' }, { status: 500 });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      secret,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      ok: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json({ ok: false, error: err.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: 'Unexpected error' }, { status: 500 });
  }
}
