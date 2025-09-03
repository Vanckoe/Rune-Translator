import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const ok = req.cookies.get('cf_turnstile_ok')?.value === '1';
  // пропускаем статические ассеты и сам API-роут верификации
  const url = req.nextUrl.pathname;
  const isPublic =
    url.startsWith('/_next') ||
    url.startsWith('/api/turnstile/verify') ||
    url.startsWith('/favicon') ||
    url.startsWith('/robots.txt') ||
    url.startsWith('/sitemap.xml');

  if (ok || isPublic) return NextResponse.next();

  // нет куки — отправим на корневую, где сидит TurnstileGate
  // (или можешь сделать /verify страницу)
  return NextResponse.next(); // если Gate уже встраивается на всех страницах, пропускаем
}

export const config = {
  matcher: ['/((?!_next|images|public).*)'],
};
