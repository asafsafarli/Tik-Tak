// Kateqoriya detalı səhifəsinin sol sütunundakı endirim kartı. Figma dev-mode
// spec: 338×432 (maks.; dar sütunda nisbəti saxlayıb kiçilir), 0° fırlanma, opacity 1 — `/fruit.svg` bu ölçüdə eksport
// olunub (mətn və yaşıl fon şəklin öz içindədir, ayrıca overlay lazım deyil).
// Hazırda "Meyvələr və Tərəvəzlər" kateqoriyasına xasdır (bax
// `entities/product/model/fallback.ts`) — başqa kateqoriyalar üçün fərqli
// endirim şəkli olanda bu komponent kateqoriyaya görə parametrləşdiriləcək.
// Telefon/planşetdə (lg-dən aşağı) gizlidir — məhsulları aşağı itələməsin.
export function CategoryPromo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`hidden aspect-[338/432] w-full max-w-[338px] overflow-hidden lg:block rounded-[10px] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/fruit.svg"
        alt="Meyvələrə endirim"
        className="size-full object-cover"
      />
    </div>
  );
}
