import { useState, type FormEvent } from "react";
import { useSession, type Profile, type UpdateProfilePayload } from "@/entities/session";
import { ApiError } from "@/shared/api";

// Forma profil yüklənəndən sonra mount olunur (bax `ProfileForm`-u render
// edən `key`), ona görə ilkin dəyərlər birbaşa `profile`-dan götürülür —
// effect-də state sinxronlaşdırmağa ehtiyac yoxdur.
export function useProfileForm(profile: Profile | null) {
  const { updateProfile } = useSession();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!fullName.trim()) {
      setError("Adınızı daxil edin");
      return;
    }
    const changingPassword = password !== "" || passwordRepeat !== "";
    if (changingPassword && password !== passwordRepeat) {
      setError("Şifrələr eyni deyil");
      return;
    }

    const payload: UpdateProfilePayload = {
      full_name: fullName.trim(),
      address: address.trim(),
      img_url: profile?.img_url ?? null,
    };
    if (changingPassword) {
      payload.password = password;
      payload.password_repeat = passwordRepeat;
    }

    setIsSubmitting(true);
    try {
      await updateProfile(payload);
      setPassword("");
      setPasswordRepeat("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Məlumatlar yenilənmədi");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    fullName,
    setFullName,
    address,
    setAddress,
    password,
    setPassword,
    passwordRepeat,
    setPasswordRepeat,
    error,
    success,
    isSubmitting,
    handleSubmit,
  };
}
