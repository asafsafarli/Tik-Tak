import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/entities/session";
import { ApiError } from "@/shared/api";
import { normalizePhone } from "@/shared/lib/phone";
import { useToast } from "@/shared/ui/toast";

export function useLoginForm() {
  const { login } = useSession();
  const router = useRouter();
  const { show } = useToast();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(normalizePhone(phone), password);
      show("Uğurla daxil oldunuz");
      router.replace("/");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Daxil olmaq mümkün olmadı",
      );
      setIsSubmitting(false);
    }
  }

  return {
    phone,
    setPhone,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  };
}
