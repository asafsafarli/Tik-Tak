import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/entities/session";
import { ApiError } from "@/shared/api";
import { normalizePhone } from "@/shared/lib/phone";
import { useToast } from "@/shared/ui/toast";

export function useRegisterForm() {
  const { signup } = useSession();
  const router = useRouter();
  const { show } = useToast();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signup(fullName.trim(), normalizePhone(phone), password);
      show("Qeydiyyat uğurla tamamlandı");
      router.replace("/");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Qeydiyyat mümkün olmadı",
      );
      setIsSubmitting(false);
    }
  }

  return {
    fullName,
    setFullName,
    phone,
    setPhone,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  };
}
