import { useState, type FormEvent } from "react";
import { useSession, type Profile, type UpdateProfilePayload } from "@/entities/session";
import { ApiError } from "@/shared/api";
import { useToast } from "@/shared/ui/toast";

type FieldErrors = Partial<Record<"fullName" | "address" | "passwordRepeat", string>>;

export function useProfileForm(profile: Profile | null) {
  const { updateProfile } = useSession();
  const { show } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearError(...keys: (keyof FieldErrors)[]) {
    setErrors((current) => {
      if (!keys.some((key) => current[key])) return current;
      const next = { ...current };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const changingPassword = password !== "" || passwordRepeat !== "";
    const nextErrors: FieldErrors = {};
    if (!fullName.trim()) nextErrors.fullName = "Adınızı daxil edin";
    if (!address.trim()) nextErrors.address = "Ünvanınızı daxil edin";
    if (changingPassword && password !== passwordRepeat) {
      nextErrors.passwordRepeat = "Şifrələr eyni deyil";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

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
      show("Məlumatlarınız yeniləndi");
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Məlumatlar yenilənmədi", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    fullName,
    setFullName: (value: string) => {
      setFullName(value);
      clearError("fullName");
    },
    address,
    setAddress: (value: string) => {
      setAddress(value);
      clearError("address");
    },
    password,
    setPassword: (value: string) => {
      setPassword(value);
      clearError("passwordRepeat");
    },
    passwordRepeat,
    setPasswordRepeat: (value: string) => {
      setPasswordRepeat(value);
      clearError("passwordRepeat");
    },
    errors,
    isSubmitting,
    handleSubmit,
  };
}
