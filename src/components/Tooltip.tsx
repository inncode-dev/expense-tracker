import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

const GAP = 8 // px between trigger and tooltip
const MARGIN = 8 // minimum px between tooltip and viewport edge

interface TooltipProps {
  content: ReactNode
  children: ReactNode
}

interface Position {
  top: number
  left: number
}

/**
 * Shows `content` on hover or keyboard focus, placed where it fits:
 * above the trigger if there is room, below otherwise, and never outside the viewport.
 */
export function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<Position | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const id = useId()

  // useLayoutEffect runs after the DOM is built but BEFORE the browser paints.
  // We need the tooltip's real size to decide where it goes; with useEffect the user
  // would see it flash at the wrong place for one frame before jumping.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !tooltipRef.current) return

    const trigger = triggerRef.current.getBoundingClientRect()
    const tip = tooltipRef.current.getBoundingClientRect()

    const fitsAbove = trigger.top - tip.height - GAP >= MARGIN
    const top = fitsAbove ? trigger.top - tip.height - GAP : trigger.bottom + GAP

    const centred = trigger.left + trigger.width / 2 - tip.width / 2
    const maxLeft = window.innerWidth - tip.width - MARGIN
    const left = Math.max(MARGIN, Math.min(centred, maxLeft))

    setPosition({ top, left })
  }, [open])

  const show = () => setOpen(true)
  const hide = () => {
    setOpen(false)
    setPosition(null)
  }

  return (
    <div
      ref={triggerRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(event) => event.key === 'Escape' && hide()}
      aria-describedby={open ? id : undefined}
    >
      {children}
      {open && (
        <div
          ref={tooltipRef}
          id={id}
          role="tooltip"
          // Invisible on the first pass (position unknown), visible once measured.
          style={{ top: position?.top ?? 0, left: position?.left ?? 0, visibility: position ? 'visible' : 'hidden' }}
          className="pointer-events-none fixed z-10 max-w-64 rounded-md bg-ink px-3 py-2 text-xs text-surface shadow-md dark:bg-paper dark:text-ink"
        >
          {content}
        </div>
      )}
    </div>
  )
}
