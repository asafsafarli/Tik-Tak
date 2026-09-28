import { useSearch } from '@/shared/lib/search-context'

export function Topbar() {
  const { search, setSearch } = useSearch()

  return (
    <header className="sticky top-0 z-30 bg-white">
      <div className="mx-auto flex h-[84px] w-full max-w-[1560px] items-center gap-4 px-4 sm:gap-10 2xl:px-0">
        <span className="shrink-0 text-[22px] leading-[100%] sm:text-[32px] lg:text-[40px] font-extrabold tracking-[0.03em] text-neutral-900">
          TIK TAK ADMİN
        </span>

        <div className="flex min-w-0 flex-1 justify-center">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Axtarış"
            className="h-[45px] w-full max-w-[586px] rounded-[10px] bg-neutral-100 px-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>
    </header>
  )
}
