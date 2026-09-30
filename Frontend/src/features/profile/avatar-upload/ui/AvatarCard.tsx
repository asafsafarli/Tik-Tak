"use client";

import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { UserIcon } from "@/shared/ui/icons";
import { useAvatarUpload } from "../model/use-avatar-upload";

export function AvatarCard({ className = "" }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { imgUrl, fullName, isBusy, handleFileChange, handleRemove } = useAvatarUpload();

  return (
    <section
      aria-label="Profil şəkli"
      className={`flex flex-col items-center rounded-[10px] bg-white p-5 text-center sm:p-6 ${className}`}
    >
      <h2 className="self-start text-[20px] font-medium leading-none text-ink">Profil şəkli</h2>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isBusy}
        aria-label="Şəkil seç"
        className="group relative mt-5 flex size-[128px] items-center justify-center overflow-hidden rounded-full bg-brand-soft"
      >
        {imgUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgUrl} alt={fullName} className="size-full object-cover" />
        ) : (
          <UserIcon className="size-12 text-[#BABBC2]" />
        )}
        <span
          className={`absolute inset-0 flex items-center justify-center bg-black/40 text-white transition-opacity ${
            isBusy ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {isBusy ? (
            <Loader2 className="size-7 animate-spin" />
          ) : (
            <Camera className="size-7" strokeWidth={1.5} />
          )}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isBusy}
        className="mt-5 flex h-10 w-full max-w-[240px] items-center justify-center rounded-[8px] bg-[#92D871] text-[15px] font-medium leading-none text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isBusy ? "Yüklənir..." : imgUrl ? "Şəkli dəyiş" : "Şəkil yüklə"}
      </button>
      {imgUrl ? (
        <button
          type="button"
          onClick={handleRemove}
          disabled={isBusy}
          className="mt-3 text-[14px] leading-none text-[#F0847A] transition-opacity hover:opacity-80 disabled:opacity-60"
        >
          Şəkli sil
        </button>
      ) : null}
      <p className="mt-4 text-[12px] font-light leading-snug text-muted">
        JPG, PNG, WEBP · maks. 5 MB
      </p>
    </section>
  );
}
