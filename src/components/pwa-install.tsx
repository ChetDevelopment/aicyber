"use client";

import { useState, useEffect } from "react";
import { Download, X, Share2 } from "lucide-react";

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true;
}

export function PwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    // Android Chrome prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS fallback — show after 5s if user is on iOS
    if (isIOS()) {
      setIos(true);
      const timer = setTimeout(() => {
        setShow(true);
      }, 5000);
      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
        clearTimeout(timer);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
      setShow(false);
    });
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-24 right-5 z-50 flex w-[340px] items-center gap-3 rounded-2xl border border-border bg-background p-4 shadow-2xl shadow-primary/10 animate-in slide-in-from-bottom-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl overflow-hidden">
        <img src="/CyberAI.png" alt="" className="h-12 w-12 object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">Install CyberAI</p>
        <p className="text-xs text-muted-foreground">
          {ios
            ? "Tap Share → Add to Home Screen"
            : "Add to home screen for offline access"}
        </p>
      </div>
      {ios ? (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
          <Share2 className="h-4 w-4" />
        </div>
      ) : (
        <button onClick={install}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 shrink-0"
        >
          <Download className="h-4 w-4" />
        </button>
      )}
      <button onClick={() => setShow(false)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
