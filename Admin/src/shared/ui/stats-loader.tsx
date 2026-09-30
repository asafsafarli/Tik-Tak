import { cn } from '@/shared/lib/utils'

const BARS = [0.55, 0.85, 0.4, 1, 0.7]

interface StatsLoaderProps {
  label?: string
  className?: string
}

export function StatsLoader({ label = 'Məlumatlar yüklənir...', className }: StatsLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center gap-3 py-10', className)}
    >
      <div className="flex h-10 items-end gap-1.5" aria-hidden>
        {BARS.map((height, index) => (
          <span
            key={index}
            className="w-2.5 origin-bottom animate-stats-bar rounded-t-[3px] bg-[#92D871]"
            style={{ height: `${height * 100}%`, animationDelay: `${index * 0.12}s` }}
          />
        ))}
      </div>
      <span className="text-[13px] text-neutral-400">{label}</span>
    </div>
  )
}
