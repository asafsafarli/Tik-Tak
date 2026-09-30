"use client";

import { TextField } from "@/shared/ui/text-field";
import { Button } from "@/shared/ui/button";
import { useRegisterForm } from "../model/use-register-form";

export function RegisterForm() {
  const {
    fullName,
    setFullName,
    phone,
    setPhone,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  } = useRegisterForm();

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <TextField
        id="register-name"
        label="Ad"
        type="text"
        required
        autoComplete="name"
        placeholder="Ad, Soyad"
        className="placeholder:font-normal placeholder:text-[#1A1D28]/[0.27]"
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
      />
      <TextField
        id="register-phone"
        label="Telefon nömrəsi"
        type="tel"
        required
        autoComplete="tel"
        placeholder="(+994) __ / ___ / __ / __"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
      />
      <TextField
        id="register-password"
        label="Parol"
        type="password"
        required
        autoComplete="new-password"
        placeholder="********************"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Göndərilir..." : "Tamamla"}
      </Button>
    </form>
  );
}
