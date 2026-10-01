import { useState, type ChangeEvent } from "react";
import { useSession } from "@/entities/session";
import { ApiError, uploadFile } from "@/shared/api";
import { useToast } from "@/shared/ui/toast";

const MAX_SIZE_MB = 5;

export function useAvatarUpload() {
  const { profile, updateProfile } = useSession();
  const { show } = useToast();
  const [isBusy, setIsBusy] = useState(false);

  async function save(imgUrl: string | null, successMessage: string) {
    if (!profile) return;
    if (!profile.address?.trim()) {
      show("Şəkil üçün əvvəlcə ünvanınızı yadda saxlayın", "error");
      return;
    }
    await updateProfile({
      full_name: profile.full_name,
      address: profile.address,
      img_url: imgUrl,
    });
    show(successMessage);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      show("Yalnız şəkil faylı seçin", "error");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      show(`Şəklin həcmi ${MAX_SIZE_MB} MB-dan çox olmamalıdır`, "error");
      return;
    }

    setIsBusy(true);
    try {
      await save(await uploadFile(file), "Profil şəkli yeniləndi");
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Şəkil yüklənmədi", "error");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRemove() {
    setIsBusy(true);
    try {
      await save(null, "Profil şəkli silindi");
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Şəkil silinmədi", "error");
    } finally {
      setIsBusy(false);
    }
  }

  return {
    imgUrl: profile?.img_url || null,
    fullName: profile?.full_name ?? "",
    isBusy,
    handleFileChange,
    handleRemove,
  };
}
