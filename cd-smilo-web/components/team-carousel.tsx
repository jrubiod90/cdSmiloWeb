'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export type TeamCarouselProps = {
  /** Photo URLs to display. When empty or null, the carousel stays closed. */
  photos: string[] | null
  /** Accessible title for the dialog (e.g. "Benjamín · Masculino · Baloncesto"). */
  title: string
  labels: { close: string; prev: string; next: string; counter: (i: number, total: number) => string }
  onClose: () => void
}

export function TeamCarousel({ photos, title, labels, onClose }: TeamCarouselProps) {
  const [index, setIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef<number | null>(null)

  const open = !!photos && photos.length > 0

  useEffect(() => setMounted(true), [])

  // Reset to the first photo each time a new team is opened.
  useEffect(() => {
    if (open) setIndex(0)
  }, [open, photos])

  const go = useCallback(
    (dir: 1 | -1) => {
      if (!photos) return
      setIndex((i) => (i + dir + photos.length) % photos.length)
    },
    [photos],
  )

  // Keyboard controls + scroll lock while open.
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, go, onClose])

  if (!mounted || !open || !photos) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-foreground sm:text-base">
          {title}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={labels.close}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Stage (stop backdrop close when interacting with the image area) */}
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return
          const dx = e.changedTouches[0].clientX - touchStartX.current
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
          touchStartX.current = null
        }}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-card">
          <Image
            key={photos[index]}
            src={photos[index]}
            alt={`${title} — ${index + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
        </div>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={labels.prev}
              className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={labels.next}
              className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronRight className="size-6" />
            </button>

            {/* Dots + counter */}
            <div className="mt-5 flex items-center justify-center gap-2">
              {photos.map((photo, i) => (
                <button
                  key={photo + i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={labels.counter(i + 1, photos.length)}
                  aria-current={i === index}
                  className={
                    'h-2 rounded-full transition-all ' +
                    (i === index ? 'w-6 bg-primary' : 'w-2 bg-border hover:bg-muted-foreground')
                  }
                />
              ))}
            </div>
          </>
        )}

        <p className="mt-3 text-center text-xs uppercase tracking-widest text-muted-foreground">
          {labels.counter(index + 1, photos.length)}
        </p>
      </div>
    </div>,
    document.body,
  )
}
