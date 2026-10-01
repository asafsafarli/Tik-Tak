import { SiteHeader } from "@/widgets/site-header";
import { PromoHero } from "@/widgets/promo-hero";
import { SpecialOffers } from "@/widgets/special-offers";
import { CompanyStats } from "@/widgets/company-stats";
import { SiteFooter } from "@/widgets/site-footer";
import {
  FALLBACK_HERO_SLIDES,
  FALLBACK_OFFERS,
  getCampaigns,
  toHeroSlides,
  toOfferCards,
} from "@/entities/campaign";

export async function HomePage() {
  const campaigns = await getCampaigns().catch(() => []);

  const heroSlides = toHeroSlides(campaigns);
  const offers = toOfferCards(campaigns);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PromoHero
          slides={heroSlides.length > 0 ? heroSlides : FALLBACK_HERO_SLIDES}
        />
        <SpecialOffers offers={offers.length > 0 ? offers : FALLBACK_OFFERS} />
        <CompanyStats />
      </main>
      <SiteFooter />
    </>
  );
}
