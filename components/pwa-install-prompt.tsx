"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "waij-pwa-dismissed-at";
const DISMISS_COOLDOWN_MS = 24 * 60 * 60 * 1000; // re-prompt after 24h

function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth <= 820;
}

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-expect-error iOS Safari-only property
    window.navigator.standalone === true
  );
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosMode, setIosMode] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    if (isStandalone() || !isMobileViewport()) return;

    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    if (Date.now() - dismissedAt < DISMISS_COOLDOWN_MS) return;

    if (isIos()) {
      setIosMode(true);
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    else dismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-emerald-700 bg-slate-900 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.25)] sm:hidden">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
          <img src="/icon-192.png" alt="" className="h-full w-full object-contain" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">Install West Africa Impact Jobs</p>
          {iosMode ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-300">
              Tap <Share className="inline h-3.5 w-3.5" /> then "Add to Home Screen"
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-slate-300">Faster access, works offline</p>
          )}
        </div>
        {!iosMode && (
          <Button
            size="sm"
            onClick={install}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700"
          >
            <Download className="mr-1 h-3.5 w-3.5" />
            Install
          </Button>
        )}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
