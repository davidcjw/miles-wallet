'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsQR from 'jsqr';
import { Surface, Text, Button, IconButton } from 'rawhouse-ds';
import { BankAccount, LoyaltyAccount } from '@/types';

interface Props {
  banks: BankAccount[];
  loyalty: LoyaltyAccount[];
  onImport: (banks: BankAccount[], loyalty: LoyaltyAccount[]) => void;
  onClose: () => void;
}

type Tab = 'share' | 'scan';
type ScanState = 'idle' | 'requesting' | 'scanning' | 'found' | 'error';

interface Parsed {
  banks: BankAccount[];
  loyalty: LoyaltyAccount[];
}

function encode(data: Parsed): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  const bin = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  return 'mw1:' + btoa(bin);
}

function decode(raw: string): Parsed {
  if (!raw.startsWith('mw1:')) throw new Error('Not a Miles Wallet QR code');
  const bin = atob(raw.slice(4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  const data = JSON.parse(new TextDecoder().decode(bytes));
  if (!Array.isArray(data.banks) || !Array.isArray(data.loyalty))
    throw new Error('Invalid wallet data');
  return data as Parsed;
}

export default function SyncModal({ banks, loyalty, onImport, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('share');
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [found, setFound] = useState<Parsed | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const scanLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(scanLoop);
      return;
    }
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
    if (code) {
      try {
        const parsed = decode(code.data);
        stopCamera();
        setFound(parsed);
        setScanState('found');
        return;
      } catch {
        // not a miles wallet QR — keep scanning
      }
    }
    rafRef.current = requestAnimationFrame(scanLoop);
  }, [stopCamera]);

  // Attach the stream once the video element is in the DOM (scanState just became 'scanning')
  useEffect(() => {
    const video = videoRef.current;
    if (scanState !== 'scanning' || !video || !streamRef.current) return;
    video.srcObject = streamRef.current;
    video.play().catch(() => {});
    rafRef.current = requestAnimationFrame(scanLoop);
    return () => { cancelAnimationFrame(rafRef.current); };
  }, [scanState, scanLoop]);

  const startCamera = async () => {
    setScanState('requesting');
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      streamRef.current = stream;
      setScanState('scanning'); // video element now renders → useEffect attaches the stream
    } catch {
      setScanState('error');
      setErrorMsg('Camera access was denied. Please allow camera access and try again.');
    }
  };

  const handleTabChange = (t: Tab) => {
    if (t !== 'scan') {
      stopCamera();
      setScanState('idle');
      setFound(null);
    }
    setTab(t);
  };

  const handleImport = () => {
    if (found) {
      onImport(found.banks, found.loyalty);
      onClose();
    }
  };

  const qrValue = encode({ banks, loyalty });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Surface tone="white" radius="xl" bordered sticker className="w-full max-w-sm" style={{ padding: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between" style={{ padding: '18px 20px', borderBottom: 'var(--rh-border-width) solid var(--rh-black)' }}>
          <Text as="h2" size="title" weight="extrabold">Sync Wallet</Text>
          <IconButton aria-label="Close" variant="outline" size={36} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </IconButton>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: 'var(--rh-border-width) solid var(--rh-black)' }}>
          {(['share', 'scan'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className="flex-1"
              style={{
                padding: '12px 0',
                fontFamily: 'var(--rh-font)',
                fontSize: 'var(--rh-fs-label)',
                fontWeight: 'var(--rh-weight-bold)',
                letterSpacing: 'var(--rh-track-label)',
                textTransform: 'uppercase',
                cursor: 'pointer',
                background: tab === t ? 'var(--rh-coral)' : 'transparent',
                color: tab === t ? 'var(--rh-white)' : 'var(--rh-stone)',
              }}
            >
              {t === 'share' ? 'Show QR' : 'Scan QR'}
            </button>
          ))}
        </div>

        {/* Share tab */}
        {tab === 'share' && (
          <div className="flex flex-col items-center gap-4" style={{ padding: 24 }}>
            <Surface tone="white" radius="lg" bordered style={{ padding: 12 }}>
              <QRCodeSVG value={qrValue} size={220} level="M" bgColor="#ffffff" fgColor="#000000" />
            </Surface>
            <Text size="small" tone="muted" center>
              Open Miles Wallet on your other device, tap{' '}
              <Text as="span" size="small" weight="extrabold">Scan QR</Text>, and point it at this screen.
            </Text>
            <Text size="label" tone="muted" caps>
              {banks.length} bank {banks.length === 1 ? 'account' : 'accounts'} · {loyalty.length} loyalty {loyalty.length === 1 ? 'programme' : 'programmes'}
            </Text>
          </div>
        )}

        {/* Scan tab */}
        {tab === 'scan' && (
          <div className="flex flex-col gap-4" style={{ padding: 20 }}>
            {scanState === 'idle' && (
              <div className="flex flex-col items-center gap-4 py-4">
                <Surface tone="green" radius="lg" bordered className="flex items-center justify-center" style={{ width: 56, height: 56 }}>
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <rect x="2" y="2" width="8" height="8" rx="1.5" stroke="black" strokeWidth="2" />
                    <rect x="16" y="2" width="8" height="8" rx="1.5" stroke="black" strokeWidth="2" />
                    <rect x="2" y="16" width="8" height="8" rx="1.5" stroke="black" strokeWidth="2" />
                    <path d="M16 16h2M16 20h4M20 16v2M18 22h4M22 18v4" stroke="black" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </Surface>
                <div className="text-center">
                  <Text size="lead" weight="extrabold" center>Ready to scan</Text>
                  <Text size="small" tone="muted" center style={{ marginTop: 4 }}>
                    Point your camera at the QR code shown on the other device.
                  </Text>
                </div>
                <Button variant="coral" className="w-full" onClick={startCamera}>Open Camera</Button>
              </div>
            )}

            {scanState === 'requesting' && (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '3px solid var(--rh-coral)', borderTopColor: 'transparent' }} />
                <Text size="small" tone="muted">Requesting camera…</Text>
              </div>
            )}

            {scanState === 'scanning' && (
              <div className="flex flex-col gap-3">
                <div className="relative overflow-hidden bg-black aspect-square" style={{ borderRadius: 'var(--rh-r-lg)', border: 'var(--rh-border-width) solid var(--rh-black)' }}>
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline autoPlay muted />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 relative">
                      {[
                        'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
                        'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
                        'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
                        'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
                      ].map((cls, i) => (
                        <span key={i} className={`absolute w-6 h-6 ${cls}`} style={{ borderColor: 'var(--rh-green)' }} />
                      ))}
                    </div>
                  </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <Text size="label" tone="muted" caps center>Align the QR code within the frame</Text>
                <Button variant="outline" className="w-full" onClick={() => { stopCamera(); setScanState('idle'); }}>
                  Cancel
                </Button>
              </div>
            )}

            {scanState === 'found' && found && (
              <div className="flex flex-col gap-4 py-2">
                <Surface tone="green" radius="lg" bordered className="flex items-center gap-3" style={{ padding: 16 }}>
                  <span className="flex items-center justify-center shrink-0" style={{ width: 32, height: 32, borderRadius: '9999px', background: 'var(--rh-black)' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <Text size="small" weight="extrabold">QR code detected</Text>
                    <Text size="label" caps style={{ marginTop: 2 }}>
                      {found.banks.length} bank {found.banks.length === 1 ? 'account' : 'accounts'} · {found.loyalty.length} loyalty {found.loyalty.length === 1 ? 'programme' : 'programmes'}
                    </Text>
                  </div>
                </Surface>
                {(banks.length > 0 || loyalty.length > 0) && (
                  <Text size="small" tone="coral" weight="bold" center>
                    This will replace your current wallet data.
                  </Text>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => { setFound(null); setScanState('idle'); }}>
                    Cancel
                  </Button>
                  <Button variant="coral" className="flex-1" onClick={handleImport}>Import</Button>
                </div>
              </div>
            )}

            {scanState === 'error' && (
              <div className="flex flex-col items-center gap-4 py-4">
                <Text size="small" tone="coral" weight="bold" center>{errorMsg}</Text>
                <Button variant="outline" onClick={() => setScanState('idle')}>Try Again</Button>
              </div>
            )}
          </div>
        )}
      </Surface>
    </div>
  );
}
