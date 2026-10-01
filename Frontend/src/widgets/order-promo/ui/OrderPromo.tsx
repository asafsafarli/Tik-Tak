import { Baloo_2 } from "next/font/google";

const baloo = Baloo_2({
  subsets: ["latin", "latin-ext"],
  weight: ["800"],
  display: "swap",
});

export function OrderPromo({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`relative flex aspect-[387/590] w-full max-w-[387px] flex-col justify-end overflow-hidden rounded-[10px] bg-[#8BC53F] p-6 text-white shadow-[3px_0px_7px_0px_#00000040] sm:p-8 lg:h-[590px] lg:w-[387px] ${className}`}
    >
      <img
        src="/strawberry.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-0 top-[2.54%] h-[57.12%] w-[124.03%] max-w-none rotate-[-11.49deg] object-cover select-none"
      />

      <div
        className={`relative flex flex-col items-center text-center [text-shadow:0_1px_10px_rgba(0,0,0,0.18)] ${baloo.className}`}
      >
        <p className="text-2xl uppercase leading-none tracking-normal sm:text-[30px]">
          Online sifariş et
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <span className="text-center text-[56px] leading-none tracking-normal sm:text-[76px]">
            15
          </span>
          <span className="text-xl uppercase leading-none tracking-normal sm:text-[28px]">
            Dəqiqəyə
            <br />
            Qapında
          </span>
        </div>
      </div>
    </aside>
  );
}
