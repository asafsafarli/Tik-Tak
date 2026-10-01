export function CategoryPromo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`hidden aspect-[338/432] w-full max-w-[338px] overflow-hidden lg:block rounded-[10px] ${className}`}
    >
      <img
        src="/fruit.webp"
        alt="Meyvələrə endirim"
        className="size-full object-cover"
      />
    </div>
  );
}
