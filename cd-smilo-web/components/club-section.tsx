'use client'

import Image from 'next/image'
import { Dumbbell, HeartHandshake, Users, GraduationCap } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

const icons = [Dumbbell, HeartHandshake, Users, GraduationCap]

export function ClubSection() {
  const { t } = useLanguage()

  return (
    <section id="club" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/images/team.png"
              alt="Equipo del C.D SMILO"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden rounded-xl border border-border bg-card p-5 shadow-xl sm:block">
            <p className="font-display text-3xl font-bold text-primary">2010</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Granada</p>
          </div>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {t.club.tag}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-balance sm:text-5xl">
            {t.club.title}
          </h2>
          <p className="mt-6 leading-relaxed text-foreground/80">{t.club.p1}</p>
          <p className="mt-4 leading-relaxed text-foreground/80">{t.club.p2}</p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {t.club.values.map((value, i) => {
              const Icon = icons[i]
              return (
                <div
                  key={value.title}
                  className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
                >
                  <Icon className="size-6 text-primary" />
                  <h3 className="mt-3 font-display text-lg font-semibold uppercase tracking-wide">
                    {value.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {value.text}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
