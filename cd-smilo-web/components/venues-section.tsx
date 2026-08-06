'use client'

import { Building2, MapPin } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

export function VenuesSection() {
  const { t } = useLanguage()

  return (
    <section id="sedes" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {t.venues.tag}
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-balance sm:text-5xl">
          {t.venues.title}
        </h2>
        <p className="mt-4 leading-relaxed text-foreground/80">{t.venues.subtitle}</p>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {t.venues.list.map((venue) => (
          <li key={venue.name}>
            <a
              href={venue.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-center gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Building2 className="size-5" />
              </div>
              <span className="flex-1 font-medium">{venue.name}</span>
              <MapPin className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
