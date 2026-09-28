import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  quantity: number;
  unitLabel: string;
  onIncrement: () => void;
  onDecrement: () => void;
  className?: string;
}

export function QuantityStepper({
  quantity,
  unitLabel,
  onIncrement,
  onDecrement,
  className = "",
}: QuantityStepperProps) {
  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-full bg-white px-1.5 py-1 ${className}`}
    >
      <button
        type="button"
        onClick={onDecrement}
        aria-label="Azalt"
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#F0847A] text-white transition-opacity hover:opacity-90"
      >
        <Minus className="size-3.5" strokeWidth={3} />
      </button>
      <span className="whitespace-nowrap text-[13px] font-medium leading-none text-ink">
        {quantity} {unitLabel}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label="Artır"
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-leaf text-white transition-opacity hover:opacity-90"
      >
        <Plus className="size-3.5" strokeWidth={3} />
      </button>
    </div>
  );
}
