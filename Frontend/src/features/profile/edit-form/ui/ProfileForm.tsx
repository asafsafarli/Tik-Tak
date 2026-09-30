"use client";

import type { ComponentProps } from "react";
import type { Profile } from "@/entities/session";
import { useProfileForm } from "../model/use-profile-form";

interface FieldProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
}

// Hesab səhifəsi üçün yığcam sahə: 48px hündürlük, 14px label, disabled vəziyyəti var.
function Field({ label, id, error, ...props }: FieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-[14px] font-normal leading-none text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-12 w-full rounded-[10px] border bg-brand-soft px-4 text-[15px] leading-none text-ink outline-none transition-colors placeholder:font-light placeholder:text-[#BABBC2] focus:border-leaf focus:bg-white disabled:cursor-not-allowed disabled:text-muted ${
          error ? "border-[#F0847A]" : "border-transparent"
        }`}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-[13px] leading-none text-[#F0847A]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

// Telefon və e-mail yalnız göstərilir — `PUT /profile` onları qəbul etmir.
export function ProfileForm({ profile }: { profile: Profile | null }) {
  const form = useProfileForm(profile);

  return (
    <form
      onSubmit={form.handleSubmit}
      noValidate
      className="flex flex-col rounded-[10px] bg-white p-5 sm:p-6"
    >
      <h2 className="text-[20px] font-medium leading-none text-ink">Əlaqə məlumatlarınız</h2>

      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
        <Field
          label="Adınız"
          id="full_name"
          placeholder="Adınız"
          autoComplete="name"
          error={form.errors.fullName}
          value={form.fullName}
          onChange={(event) => form.setFullName(event.target.value)}
        />
        <Field
          label="Telefon nömrəsi"
          id="phone"
          placeholder="(+994) __ / ___ / __ / __"
          value={profile?.phone ?? ""}
          disabled
        />
        <Field
          label="E-mail"
          id="email"
          placeholder="E-mail"
          value={profile?.email ?? ""}
          disabled
        />
        <Field
          label="Unvan"
          id="address"
          placeholder="Unvanınız"
          autoComplete="street-address"
          required
          error={form.errors.address}
          value={form.address}
          onChange={(event) => form.setAddress(event.target.value)}
        />
      </div>

      <h2 className="mt-8 text-[20px] font-medium leading-none text-ink">
        Şifrənin yenilənməsi
      </h2>
      <p className="mt-2 text-[12px] font-normal leading-none text-muted">
        Ehtiyac yoxdursa boş buraxın
      </p>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
        <Field
          label="Yeni Şifrə"
          id="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(event) => form.setPassword(event.target.value)}
        />
        <Field
          label="Yeni Şifrənin təkrarı"
          id="password_repeat"
          type="password"
          autoComplete="new-password"
          error={form.errors.passwordRepeat}
          value={form.passwordRepeat}
          onChange={(event) => form.setPasswordRepeat(event.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={form.isSubmitting}
        className="mt-6 flex h-12 w-[360px] max-w-full items-center justify-center self-center rounded-[10px] bg-[#92D871] text-[18px] font-bold leading-none text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {form.isSubmitting ? "Yenilənir..." : "Məlumatları yenilə"}
      </button>
    </form>
  );
}
