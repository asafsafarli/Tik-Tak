"use client";

import { TextField } from "@/shared/ui/text-field";
import { Button } from "@/shared/ui/button";
import { useLoginForm } from "../model/use-login-form";

export function LoginForm() {
  const {
    phone,
    setPhone,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <TextField
        id="login-phone"
        label="Telefon nömrəsi"
        type="tel"
        required
        autoComplete="tel"
        placeholder="(+994) __ / ___ / __ / __"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
      />
      <TextField
        id="login-password"
        label="Parol"
        type="password"
        required
        autoComplete="current-password"
        placeholder="********************"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Daxil olunur..." : "Daxil ol"}
      </Button>
    </form>
  );
}
