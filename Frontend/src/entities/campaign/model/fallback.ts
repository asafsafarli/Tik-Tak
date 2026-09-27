import { CAMPAIGN_HREF, type CampaignCard } from "../lib/to-cards";

// API əlçatmaz olduqda göstərilən ehtiyat məzmun.
export const FALLBACK_HERO_SLIDES: CampaignCard[] = [
  {
    id: -1,
    tone: "dark",
    title: "Bravo Club",
    text: "Alış-verişdə yeni həyəcan!",
    imgUrl: null,
    href: CAMPAIGN_HREF,
  },
  {
    id: -2,
    tone: "red",
    title: "Bravo-da Yeni il endirimləri",
    text: "26 dekabr – 8 yanvar",
    imgUrl: null,
    href: CAMPAIGN_HREF,
  },
];

export const FALLBACK_OFFERS: CampaignCard[] = [
  {
    id: -3,
    tone: "stone",
    title: "Qeyri-qidaya endirim!",
    text: "12 dekabr – 8 yanvar",
    imgUrl: null,
    href: CAMPAIGN_HREF,
  },
  {
    id: -4,
    tone: "red",
    title: "Bravo-da Yeni il endirimləri",
    text: "26 dekabr 2024 – 8 yanvar 2025",
    imgUrl: null,
    href: CAMPAIGN_HREF,
  },
];
