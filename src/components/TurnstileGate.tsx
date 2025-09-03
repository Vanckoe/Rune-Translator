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
  action?: string; // произвольное имя действия для аналитики/шерлокинга в Cloudflare
};

export default function TurnstileGate({
  children,
  action = 'page_load',
}: Props) {
  const [verified, setVerified] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;

  useEffect(() => {
    // если уже есть cookie от предыдущей проверки — можно сразу пустить
    // лёгкая оптимизация: попробуем прочитать document.cookie без парсера
    const hasCookie =
      typeof document !== 'undefined' &&
      document.cookie.includes('cf_turnstile_ok=1');
    if (hasCookie) {
      setVerified(true);
    }
  }, []);

  const onWidgetReady = () => {
    if (!containerRef.current || !window.turnstile) return;

    // Рендерим «невидимый» виджет (mode: 'invisible'), он сам выдаст токен, как только сможет
    window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action,
      cData: 'gtm-landing', // опционально: метка
      retry: 'auto',
      refreshExpired: 'auto',
      callback: async (token: string) => {
        try {
          const res = await fetch('/api/turnstile/verify', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ token }),
          });
          const data = await res.json();
          if (data.ok) {
            setVerified(true);
          } else {
            setError('Verification failed');
          }
        } catch {
          setError('Network error');
        }
      },
      'error-callback': () => setError('Widget error'),
      'timeout-callback': () => setError('Challenge timeout'),
    });
  };

  return (
    <>
      {/* Официальный скрипт Turnstile */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?compat=recaptcha"
        async
        defer
        onReady={onWidgetReady}
        onError={() => setError('Failed to load Turnstile script')}
      />

      {/* контейнер для невидимого виджета (можно спрятать) */}
      <div ref={containerRef} className="hidden" />

      {/* Гейт: пока не верифицировано — показываем скелетон/сплэш */}
      {verified ? (
        <>{children}</>
      ) : (
        <div className="min-h-screen grid place-items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-72 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            {!error && (
              <p className="text-sm text-gray-500">Проверяем, что вы не бот…</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
