"use client";

import type { ComponentProps } from "react";
import type { Profile } from "@/entities/session";
import { useProfileForm } from "../model/use-profile-form";

interface FieldProps extends ComponentProps<"input"> {
  label: string;
}

// Hesab səhifəsi üçün yığcam sahə: 48px hündürlük, 14px label, disabled vəziyyəti var.
function Field({ label, id, ...props }: FieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-[14px] font-normal leading-none text-ink">
        {label}
      </label>
      <input
        id={id}
        className="h-12 w-full rounded-[10px] border border-transparent bg-brand-soft px-4 text-[15px] leading-none text-ink outline-none transition-colors placeholder:font-light placeholder:text-[#BABBC2] focus:border-leaf focus:bg-white disabled:cursor-not-allowed disabled:text-muted"
        {...props}
      />
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
          value={form.passwordRepeat}
          onChange={(event) => form.setPasswordRepeat(event.target.value)}
        />
      </div>

      {form.error ? (
        <p role="alert" className="mt-6 text-center text-[14px] leading-none text-[#F0847A]">
          {form.error}
        </p>
      ) : null}
      {form.success ? (
        <p role="status" className="mt-6 text-center text-[14px] leading-none text-leaf">
          Məlumatlarınız yeniləndi
        </p>
      ) : null}

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
