"use client";

import { useEffect, useRef, useId } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit";

type Props = {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  /** bump this value to force a reset (e.g. after a failed submit) */
  resetSignal?: number;
};

export function Turnstile({ onVerify, onExpire, resetSignal }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);
  const containerId = useId().replace(/:/g, "");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    // No key configured yet: auto-pass so the form is usable in development.
    if (!siteKey) {
      onVerify("dev-no-captcha");
      return;
    }

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !ref.current || !window.turnstile) return;
      if (widgetId.current) return;
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token: string) => onVerify(token),
        "expired-callback": () => onExpire?.(),
        "error-callback": () => onExpire?.(),
        theme: "light",
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      window.onloadTurnstileCallback = renderWidget;
      if (!document.querySelector(`script[src^="https://challenges.cloudflare.com/turnstile"]`)) {
        const s = document.createElement("script");
        s.src = SCRIPT_SRC;
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // External reset trigger
  useEffect(() => {
    if (resetSignal === undefined) return;
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  if (!siteKey) {
    return (
      <p className="text-[11px] text-slate-400 italic">
        Captcha will appear here once Turnstile keys are configured.
      </p>
    );
  }

  return <div ref={ref} id={containerId} className="min-h-[65px]" />;
}
