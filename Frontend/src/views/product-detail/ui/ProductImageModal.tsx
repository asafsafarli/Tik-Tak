"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.1;

interface ProductImageModalProps {
  imageUrl: string | null;
  title: string;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onClose: () => void;
}

export function ProductImageModal({
  imageUrl,
  title,
  zoom,
  onZoomChange,
  onClose,
}: ProductImageModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  const zoomPercent = ((zoom - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN)) * 100;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div aria-hidden className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 flex w-full max-w-[640px] flex-col gap-4 rounded-[10px] bg-white p-6 shadow-[0px_10px_40px_0px_#00000033]">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-ink">Məhsul şəkli</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Bağla"
            className="flex size-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-ink"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex max-h-[60vh] items-center justify-center overflow-auto rounded-lg bg-neutral-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              style={{ transform: `scale(${zoom})` }}
              className="max-h-[60vh] w-auto origin-center object-contain transition-transform"
            />
          ) : (
            <span aria-hidden className="p-16 text-8xl font-extrabold text-neutral-300">
              {title.charAt(0)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="product-image-zoom" className="shrink-0 text-[14px] text-ink">
            Yaxınlaşdırma:
          </label>
          <div className="relative flex-1">
            <span
              style={{ left: `${zoomPercent}%` }}
              className="pointer-events-none absolute -top-7 -translate-x-1/2 rounded-md bg-ink px-2 py-0.5 text-[12px] font-medium text-white"
            >
              {zoom.toFixed(1)}
            </span>
            <input
              id="product-image-zoom"
              type="range"
              min={ZOOM_MIN}
              max={ZOOM_MAX}
              step={ZOOM_STEP}
              value={zoom}
              onChange={(event) => onZoomChange(Number(event.target.value))}
              className="w-full accent-leaf"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
