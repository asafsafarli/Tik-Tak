import { useEffect, useRef, useState } from 'react'

const ROLL_INTERVAL = 70
const SETTLE_DURATION = 1200

export function useCountUp(target: number, isLoading: boolean, rollMax = 999) {
  const [value, setValue] = useState(0)
  const valueRef = useRef(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isLoading) {
      if (reduceMotion) return
      const id = window.setInterval(() => {
        valueRef.current = Math.random() * rollMax
        setValue(valueRef.current)
      }, ROLL_INTERVAL)
      return () => window.clearInterval(id)
    }

    if (reduceMotion) {
      valueRef.current = target
      setValue(target)
      return
    }

    const from = valueRef.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / SETTLE_DURATION)
      const eased = 1 - (1 - progress) ** 3
      valueRef.current = from + (target - from) * eased
      setValue(valueRef.current)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, isLoading, rollMax])

  return value
}
