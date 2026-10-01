"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const CONFIRM_SECONDS = 180;

interface CheckoutConfirmModalProps {
  isSubmitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

function formatRemaining(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export function CheckoutConfirmModal({
  isSubmitting,
  onConfirm,
  onClose,
}: CheckoutConfirmModalProps) {
  const [remaining, setRemaining] = useState(CONFIRM_SECONDS);

  useEffect(() => {
    const deadline = Date.now() + CONFIRM_SECONDS * 1000;
    const id = window.setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (remaining === 0 && !isSubmitting) onClose();
  }, [remaining, isSubmitting, onClose]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        aria-hidden
        className="absolute inset-0 bg-black/40"
        onClick={isSubmitting ? undefined : onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-confirm-title"
        className="relative z-10 flex w-[614px] max-w-full flex-col items-center rounded-[20px] bg-white px-6 pt-[45px] pb-[79px] text-center"
      >
        <img src="/time.svg" alt="" aria-hidden className="w-[224px] max-w-full" />

        <h2
          id="checkout-confirm-title"
          className="mt-[50px] text-[20px] font-medium leading-none text-[#1A1D28]"
        >
          Sifarişinizi tesdiqləyiniz
        </h2>
        <p className="mt-2 text-[16px] font-light leading-none text-[#1A1D28]">
          vaxtın bitməsinə {formatRemaining(remaining)} qaldı
        </p>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-[14px]">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting || remaining === 0}
            className="flex h-[46px] w-[185px] items-center justify-center rounded-[8px] bg-[#92D871] text-[18px] font-bold leading-none text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Təsdiqlə
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-[46px] w-[185px] items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[18px] font-bold leading-none text-[#D0D0D0] transition-colors hover:border-neutral-300 hover:text-neutral-400 disabled:cursor-not-allowed"
          >
            İndi yox
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
