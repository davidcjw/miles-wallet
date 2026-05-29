'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsQR from 'jsqr';
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

  const startCamera = async () => {
    setScanState('requesting');
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanState('scanning');
      rafRef.current = requestAnimationFrame(scanLoop);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Sync Wallet</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-100 dark:border-neutral-800">
          {(['share', 'scan'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === t
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
            >
              {t === 'share' ? 'Show QR Code' : 'Scan QR Code'}
            </button>
          ))}
        </div>

        {/* Share tab */}
        {tab === 'share' && (
          <div className="p-6 flex flex-col items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700">
              <QRCodeSVG
                value={qrValue}
                size={220}
                level="M"
                bgColor="#ffffff"
                fgColor="#0f172a"
              />
            </div>
            <p className="text-sm text-center text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Open Miles Wallet on your other device, tap{' '}
              <span className="font-medium text-neutral-700 dark:text-neutral-300">Scan QR Code</span>,
              and point it at this screen.
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
              {banks.length} bank {banks.length === 1 ? 'account' : 'accounts'} ·{' '}
              {loyalty.length} loyalty {loyalty.length === 1 ? 'programme' : 'programmes'}
            </p>
          </div>
        )}

        {/* Scan tab */}
        {tab === 'scan' && (
          <div className="p-5 flex flex-col gap-4">
            {scanState === 'idle' && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <rect x="2" y="2" width="8" height="8" rx="1.5" stroke="#3b82f6" strokeWidth="1.8" />
                    <rect x="16" y="2" width="8" height="8" rx="1.5" stroke="#3b82f6" strokeWidth="1.8" />
                    <rect x="2" y="16" width="8" height="8" rx="1.5" stroke="#3b82f6" strokeWidth="1.8" />
                    <path d="M16 16h2M16 20h4M20 16v2M18 22h4M22 18v4" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Ready to scan</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Point your camera at the QR code shown on the other device.
                  </p>
                </div>
                <button
                  onClick={startCamera}
                  className="w-full py-2.5 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Open Camera
                </button>
              </div>
            )}

            {scanState === 'requesting' && (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Requesting camera…</p>
              </div>
            )}

            {scanState === 'scanning' && (
              <div className="flex flex-col gap-3">
                <div className="relative rounded-xl overflow-hidden bg-black aspect-square">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 relative">
                      {/* Corner markers */}
                      {[
                        'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
                        'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
                        'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
                        'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
                      ].map((cls, i) => (
                        <span key={i} className={`absolute w-6 h-6 border-white ${cls}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <p className="text-xs text-center text-neutral-500 dark:text-neutral-400">
                  Align the QR code within the frame
                </p>
                <button
                  onClick={() => { stopCamera(); setScanState('idle'); }}
                  className="w-full py-2 text-sm font-medium rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {scanState === 'found' && found && (
              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950 rounded-xl border border-emerald-200 dark:border-emerald-900">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">QR code detected</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {found.banks.length} bank {found.banks.length === 1 ? 'account' : 'accounts'} ·{' '}
                      {found.loyalty.length} loyalty {found.loyalty.length === 1 ? 'programme' : 'programmes'}
                    </p>
                  </div>
                </div>
                {(banks.length > 0 || loyalty.length > 0) && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                    This will replace your current wallet data.
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setFound(null); setScanState('idle'); }}
                    className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Import
                  </button>
                </div>
              </div>
            )}

            {scanState === 'error' && (
              <div className="flex flex-col items-center gap-4 py-4">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">{errorMsg}</p>
                <button
                  onClick={() => setScanState('idle')}
                  className="px-4 py-2 text-sm font-medium rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
