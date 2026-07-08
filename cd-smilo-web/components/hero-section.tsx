'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { teams } from '@/lib/teams'

export function HeroSection() {
  const { t } = useLanguage()

  const stats = [
    { value: `${teams.length}`, label: t.hero.stat1 },
    { value: '600+', label: t.hero.stat2 },
    { value: '15', label: t.hero.stat3 },
  ]

  return (
    <section id="inicio" className="relative flex min-h-screen items-center overflow-hidden">
      <Image
        src="/images/hero.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-primary">
            <MapPin className="size-3.5" />
            {t.hero.location}
          </p>
          <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-balance sm:text-7xl lg:text-8xl">
            {t.hero.titleLine1}
            <br />
            <span className="text-primary">{t.hero.titleLine2}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/80">
            {t.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/inscripcion"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105"
            >
              {t.hero.ctaJoin}
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#equipos"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
            >
              {t.hero.ctaTeams}
            </a>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-4xl font-bold text-primary sm:text-5xl">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
