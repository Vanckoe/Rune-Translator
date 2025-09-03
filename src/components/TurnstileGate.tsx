'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement | string, opts: any) => void;
      reset?: (widgetId?: string) => void;
      remove?: (widgetId?: string) => void;
      getResponse?: (widgetId?: string) => string | null;
    };
  }
}

type Props = {
  children: React.ReactNode;
  action?: string;
  brand?: string;
  subtitle?: string;
};

export default function TurnstileGate({
  children,
  action = 'page_load',
  brand = 'Rune Translate',
  subtitle = 'Проверяем, что вы человек',
}: Props) {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;

  useEffect(() => {
    const hasCookie =
      typeof document !== 'undefined' &&
      document.cookie.includes('cf_turnstile_ok=1');
    if (hasCookie) setVerified(true);
  }, []);

  const onWidgetReady = () => {
    if (!containerRef.current || !window.turnstile) return;

    window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: 'page_load',
      cData: 'gtm-landing',
      retry: 'auto',
      refreshExpired: 'auto',
      appearance: 'execute',
      callback: async (token: string) => {
        try {
          const res = await fetch('/api/turnstile/verify', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ token }),
          });
          const data = await res.json();
          if (data.ok) setVerified(true);
          else setError('Verification failed');
        } catch {
          setError('Network error');
        }
      },
      'error-callback': () => setError('Widget error'),
      'timeout-callback': () => setError('Challenge timeout'),
    });
  };

  if (verified) return <>{children}</>;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onReady={onWidgetReady}
        onError={() => setError('Failed to load Turnstile script')}
      />
      <div ref={containerRef} className="hidden" />

      <div className="relative min-h-dvh w-full overflow-hidden bg-black text-neutral-200">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)]"
        />
        <div className="relative mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6">
          <div className="mb-8 grid h-12 w-12 place-items-center rounded-2xl border border-neutral-700/60 bg-neutral-900 shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_10px_30px_-10px_rgba(0,0,0,0.6)]">
            <div className="h-5 w-5 rounded-sm bg-neutral-300" />
          </div>

          <h1 className="text-center text-3xl font-semibold tracking-tight text-neutral-100">
            Проверяем доступ
          </h1>
          <p className="mt-2 text-center text-xl text-neutral-400">
            {subtitle}
          </p>

          <div className="mt-8 h-1 w-64 overflow-hidden rounded bg-neutral-800">
            <div className="h-full w-1/3 animate-[progress_2.4s_ease-in-out_infinite] bg-neutral-200 motion-reduce:animate-none" />
          </div>

          {!error ? (
            <p className="mt-6 text-center text-xs text-neutral-500">
              Это займёт пару секунд. Ваш браузер не выполняет никаких лишних
              действий.
            </p>
          ) : (
            <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
              <button
                onClick={() => location.reload()}
                className="ml-3 inline-flex items-center rounded-md border border-red-400/30 px-2 py-1 text-xs text-red-100 hover:bg-red-500/20"
              >
                Повторить
              </button>
            </div>
          )}

          <footer className="pointer-events-none absolute bottom-6 left-0 right-0 mx-auto flex max-w-5xl items-center justify-between px-6 text-[11px] text-neutral-500">
            <span>
              © {new Date().getFullYear()} {brand}
            </span>
            <span className="pointer-events-auto">
              Protected by Cloudflare Turnstile ·{' '}
              <a
                className="underline"
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noreferrer"
              >
                Privacy
              </a>{' '}
              ·{' '}
              <a
                className="underline"
                href="https://www.cloudflare.com/website-terms/"
                target="_blank"
                rel="noreferrer"
              >
                Terms
              </a>
            </span>
          </footer>
        </div>
      </div>

      <style jsx global>{`
        @keyframes progress {
          0% {
            transform: translateX(-66%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </>
  );
}
