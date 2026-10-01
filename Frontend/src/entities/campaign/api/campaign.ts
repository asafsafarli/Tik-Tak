import { apiFetch } from "@/shared/api";
import type { Campaign } from "../model/types";

export function getCampaigns() {
  return apiFetch<Campaign[]>("/campaigns", { revalidate: 300 });
}
