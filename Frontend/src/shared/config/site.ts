// Landing üçün statik məzmun.
// Kampaniya blokları (hero + xüsusi təkliflər) artıq API-dən gəlir
// (`@/entities/campaign`). Buradakılar API-yə bağlı olmayan bölmələrdir:
// göstəricilər, footer, sosial linklər, naviqasiya.

export const COMPANY_STATS = [
  { id: "markets", value: "137", label: "Market sayı", icon: "store" as const },
  { id: "regions", value: "11", label: "Region", icon: "map" as const },
  { id: "products", value: "50000+", label: "Məhsul sayı", icon: "cart" as const },
  { id: "staff", value: "5500+", label: "Əməkdaş sayı", icon: "users" as const },
];

export const FOOTER_SECTIONS = [
  {
    title: "Şirkət",
    links: [
      { label: "Xüsusi təkliflər", href: "#" },
      { label: "Haqqımızda", href: "#" },
      { label: "Kartlar", href: "#" },
      { label: "İcarəyə verməyə yeriniz var?", href: "#" },
      { label: "Xəbərlər", href: "#" },
      { label: "Karyera", href: "#" },
      { label: "Müştəri xidmətləri", href: "#" },
    ],
  },
  {
    title: "Digər",
    links: [
      { label: "Onlayn market", href: "#" },
      { label: "Marketlərimiz", href: "#" },
      { label: "Korporativ satış", href: "#" },
    ],
  },
  {
    title: "Hüquq",
    links: [
      { label: "İstifadə şərtləri", href: "#" },
      { label: "İmtina", href: "#" },
    ],
  },
];

export const SOCIAL_LINKS = [
  { id: "facebook", label: "Facebook", href: "#" },
  { id: "instagram", label: "Instagram", href: "#" },
  { id: "youtube", label: "YouTube", href: "#" },
  { id: "linkedin", label: "LinkedIn", href: "#" },
  { id: "telegram", label: "Telegram", href: "#" },
  { id: "tiktok", label: "TikTok", href: "#" },
  { id: "whatsapp", label: "WhatsApp", href: "#" },
];

export const HEADER_NAV = [
  { label: "Hesabım", href: "#", icon: "user" as const },
  { label: "Siyahılarım", href: "/favorites", icon: "favorites" as const },
  { label: "Səbətim", href: "/basket", icon: "basket" as const },
];
