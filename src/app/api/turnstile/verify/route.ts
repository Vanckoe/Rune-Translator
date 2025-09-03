import { NextRequest, NextResponse } from 'next/server';

type TurnstileVerifyResponse = {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json(
        { ok: false, reason: 'missing token' },
        { status: 400 }
      );
    }

    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { ok: false, reason: 'missing server secret' },
        { status: 500 }
      );
    }

    const ip = req.headers.get('x-forwarded-for') ?? undefined;

    const formData = new URLSearchParams();
    formData.append('secret', secret);
    formData.append('response', token);
    if (ip) formData.append('remoteip', ip);

    const r = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        // (опционально) можно добавить next: { revalidate: 0 } если нужно
      }
    );

    const data = (await r.json()) as TurnstileVerifyResponse;

    if (!data.success) {
      return NextResponse.json(
        { ok: false, reason: data['error-codes'] ?? [] },
        { status: 403 }
      );
    }

    // Для простого POC выставим cookie-флаг на 10 минут — чтобы не гонять проверку на каждом переходе
    const res = NextResponse.json({ ok: true });
    res.cookies.set('cf_turnstile_ok', '1', {
      httpOnly: true,
      path: '/',
      maxAge: 600,
      sameSite: 'lax',
      secure: true,
    });
    return res;
  } catch (e) {
    return NextResponse.json(
      { ok: false, reason: 'server error' },
      { status: 500 }
    );
  }
}
