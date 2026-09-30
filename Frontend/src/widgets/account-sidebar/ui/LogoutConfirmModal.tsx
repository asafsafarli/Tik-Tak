"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";

interface LogoutConfirmModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

// "Hesabdan çıx" basılanda açılan təsdiq modalı. Portal naxışı
// `CheckoutConfirmModal`-dakı kimidir.
export function LogoutConfirmModal({ onConfirm, onClose }: LogoutConfirmModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div aria-hidden className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        className="relative z-10 flex w-[400px] max-w-full flex-col items-center rounded-[20px] bg-white px-6 py-8 text-center"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-[#F0847A]/15">
          <LogOut className="size-6 text-[#F0847A]" strokeWidth={1.75} />
        </span>

        <h2
          id="logout-confirm-title"
          className="mt-5 text-[20px] font-medium leading-none text-[#1A1D28]"
        >
          Hesabdan çıxmaq istəyirsiniz?
        </h2>
        <p className="mt-3 text-[14px] font-light leading-snug text-muted">
          Yenidən daxil olmaq üçün telefon nömrəniz və parolunuz lazım olacaq.
        </p>

        <div className="mt-7 flex w-full flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="flex h-[46px] flex-1 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[16px] font-medium leading-none text-muted transition-colors hover:border-neutral-300 hover:text-ink"
          >
            Ləğv et
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-[46px] flex-1 items-center justify-center rounded-[8px] bg-[#F0847A] text-[16px] font-medium leading-none text-white transition-opacity hover:opacity-90"
          >
            Çıxış et
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
