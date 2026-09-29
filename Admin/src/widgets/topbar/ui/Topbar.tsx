import { Search } from 'lucide-react'
import { useSearch } from '@/shared/lib/search-context'

export function Topbar() {
  const { search, setSearch } = useSearch()

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-100 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-[1560px] items-center gap-4 px-4 sm:gap-8 lg:h-16 2xl:px-0">
        <span className="shrink-0 text-[18px] leading-[100%] font-extrabold tracking-[0.03em] text-neutral-900 sm:text-[22px] lg:text-[26px]">
          TIK TAK <span className="text-[#6FCF54]">ADMİN</span>
        </span>

        <div className="relative flex min-w-0 flex-1 justify-center">
          <div className="relative w-full max-w-[520px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Axtarış"
              className="h-10 w-full rounded-[10px] bg-neutral-100 pr-3 pl-9 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-[#92D871]/40"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
