import type { Campaign } from "../model/types";

export interface CampaignCard {
  id: number;
  tone: "dark" | "red" | "stone";
  title: string;
  text: string | null;
  imgUrl: string | null;
  href: string;
}

function clean(text: string | null): string | null {
  if (!text) return null;
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : null;
}

// Kampaniya detal route-u yoxdur — kartlar kateqoriyalar səhifəsinə aparır,
// oradan istifadəçi (qonaq da) kateqoriya seçib məhsullara baxır.
export const CAMPAIGN_HREF = "/category";

/** Promo hero slayderi üçün bütün kampaniyalar (dark / red növbələşir). */
export function toHeroSlides(campaigns: Campaign[]): CampaignCard[] {
  const tones = ["dark", "red"] as const;
  return campaigns.map((campaign, index) => ({
    id: campaign.id,
    tone: tones[index % tones.length],
    title: campaign.title,
    text: clean(campaign.description),
    imgUrl: campaign.img_url,
    href: CAMPAIGN_HREF,
  }));
}

/**
 * "Xüsusi təkliflər" barmaqlığı üçün kampaniyalar (stone / red növbələşir).
 * Hero slayderi ilk kampaniyalardan başladığı üçün burada sondakılar göstərilir.
 */
export function toOfferCards(
  campaigns: Campaign[],
  limit = 4,
): CampaignCard[] {
  const tones = ["stone", "red"] as const;
  const tail = campaigns.slice(Math.max(0, campaigns.length - limit));
  return tail.map((campaign, index) => ({
    id: campaign.id,
    tone: tones[index % tones.length],
    title: campaign.title,
    text: clean(campaign.description),
    imgUrl: campaign.img_url,
    href: CAMPAIGN_HREF,
  }));
}
