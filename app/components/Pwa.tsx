'use client';

import { useEffect, useState } from 'react';
import { Surface, Text, Button, IconButton } from 'rawhouse-ds';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'mw-install-dismissed';

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5v8M8 1.5L5.5 4M8 1.5L10.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 7H2.5v6.5h11V7h-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Pwa() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [updateReady, setUpdateReady] = useState<ServiceWorkerRegistration | null>(null);

  // Register the service worker (production only — avoids dev HMR conflicts).
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then((reg) => {
        if (reg.waiting) setUpdateReady(reg);
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateReady(reg);
            }
          });
        });
      })
      .catch(() => {
        /* registration failures are non-fatal — app still works online */
      });
  }, []);

  // Install-prompt wiring.
  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error iOS Safari non-standard flag
      navigator.standalone === true;
    if (isStandalone) return;

    if (localStorage.getItem(DISMISS_KEY) === '1') return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    const onInstalled = () => {
      setDeferredPrompt(null);
      setShowIosHint(false);
    };
    window.addEventListener('appinstalled', onInstalled);

    // iOS Safari has no beforeinstallprompt — show a manual hint instead.
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
    // navigator is only available on the client, so this mount-time check must
    // set state from within the effect (rule is a false positive here).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isIOS && isSafari) setShowIosHint(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  function dismiss() {
    setDeferredPrompt(null);
    setShowIosHint(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  function applyUpdate() {
    updateReady?.waiting?.postMessage('SKIP_WAITING');
    setUpdateReady(null);
  }

  const showInstall = !!deferredPrompt || showIosHint;
  if (!showInstall && !updateReady) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4"
      style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}
    >
      {updateReady ? (
        <Surface
          tone="black"
          radius="lg"
          sticker
          className="flex items-center gap-3 w-full max-w-md"
          style={{ padding: '12px 14px' }}
        >
          <Text as="span" size="small" weight="semibold" tone="inherit" style={{ color: 'var(--rh-white)', flex: 1 }}>
            A new version is available.
          </Text>
          <Button variant="coral" size="sm" onClick={applyUpdate}>
            Refresh
          </Button>
        </Surface>
      ) : (
        <Surface
          tone="white"
          radius="lg"
          sticker
          bordered
          className="flex items-center gap-3 w-full max-w-md"
          style={{ padding: '12px 14px' }}
        >
          <Surface
            tone="coral"
            radius="md"
            bordered
            className="flex items-center justify-center shrink-0"
            style={{ width: 36, height: 36 }}
          >
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2 4.5C2 3.4 2.9 2.5 4 2.5h6c1.1 0 2 .9 2 2V9c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4.5z"
                fill="white"
                opacity="0.95"
              />
              <path d="M2 5.5h10" stroke="var(--rh-coral)" strokeWidth="1.2" />
            </svg>
          </Surface>

          <div style={{ flex: 1, minWidth: 0 }}>
            <Text as="p" size="small" weight="bold">
              Install Miles Wallet
            </Text>
            {showIosHint && !deferredPrompt ? (
              <Text as="p" size="label" tone="muted" className="flex items-center gap-1" style={{ marginTop: 2 }}>
                Tap <ShareIcon /> then “Add to Home Screen”.
              </Text>
            ) : (
              <Text as="p" size="label" tone="muted" style={{ marginTop: 2 }}>
                Add it to your home screen for offline access.
              </Text>
            )}
          </div>

          {deferredPrompt && (
            <Button variant="coral" size="sm" onClick={install}>
              Install
            </Button>
          )}
          <IconButton aria-label="Dismiss install prompt" variant="outline" size={32} onClick={dismiss}>
            <CloseIcon />
          </IconButton>
        </Surface>
      )}
    </div>
  );
}
