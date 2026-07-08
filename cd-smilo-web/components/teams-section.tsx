'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageIcon, UserRound } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { TeamCarousel } from '@/components/team-carousel'
import { categories, teamsBySport, type Gender, type Sport, type Team } from '@/lib/teams'
import { cn } from '@/lib/utils'

const coachImages: Record<Gender, string> = {
  male: '/images/coach-1.png',
  female: '/images/coach-2.png',
}

export function TeamsSection() {
  const { t, lang } = useLanguage()
  const [sport, setSport] = useState<Sport>('baloncesto')
  const [activeTeam, setActiveTeam] = useState<Team | null>(null)

  const sportTabs: { id: Sport; label: string }[] = [
    { id: 'baloncesto', label: t.teams.basketball },
    { id: 'voleibol', label: t.teams.volleyball },
  ]

  const teams = teamsBySport(sport)

  const categoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? ''

  const carouselTitle = (team: Team) =>
    `${categoryName(team.categoryId)} · ${team.gender === 'male' ? t.teams.male : t.teams.female} · ${
      team.sport === 'baloncesto' ? t.teams.basketball : t.teams.volleyball
    }`

  return (
    <section id="equipos" className="scroll-mt-20 border-y border-border bg-card/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {t.teams.tag}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-balance sm:text-5xl">
            {t.teams.title}
          </h2>
          <p className="mt-4 leading-relaxed text-foreground/80">{t.teams.subtitle}</p>
        </div>

        <div className="mt-10 inline-flex rounded-full border border-border bg-background p-1">
          {sportTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSport(tab.id)}
              className={cn(
                'rounded-full px-6 py-2.5 font-display text-sm font-semibold uppercase tracking-widest transition-colors',
                sport === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-12 space-y-12">
          {categories.map((category) => {
            const categoryTeams = teams.filter((team) => team.categoryId === category.id)
            return (
              <div key={category.id}>
                <div className="mb-5 flex items-baseline gap-3 border-b border-border pb-3">
                  <h3 className="font-display text-2xl font-bold uppercase tracking-wide">
                    {category.name}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {lang === 'es' ? category.ageEs : category.ageEn}
                  </span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {categoryTeams.map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => setActiveTeam(team)}
                      aria-label={`${category.name} · ${
                        team.gender === 'male' ? t.teams.male : t.teams.female
                      } — ${t.teams.viewPhotos}`}
                      className="group flex overflow-hidden rounded-xl border border-border bg-card text-left transition-colors hover:border-primary/50 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <div className="relative w-28 shrink-0 overflow-hidden sm:w-32">
                        <Image
                          src={team.image}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
                          <ImageIcon className="size-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-center p-4">
                        <span
                          className={cn(
                            'inline-flex w-fit rounded-full px-2.5 py-0.5 font-display text-[11px] font-semibold uppercase tracking-widest',
                            team.gender === 'male'
                              ? 'bg-primary/15 text-primary'
                              : 'bg-secondary text-secondary-foreground',
                          )}
                        >
                          {team.gender === 'male' ? t.teams.male : t.teams.female}
                        </span>
                        <p className="mt-2 font-display text-lg font-semibold uppercase leading-tight">
                          {category.name}
                        </p>
                        <div className="mt-2 flex items-center gap-2.5">
                          <Image
                            src={coachImages[team.gender]}
                            alt={team.coach}
                            width={32}
                            height={32}
                            className="size-8 rounded-full object-cover"
                          />
                          <div className="leading-tight">
                            <p className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                              <UserRound className="size-3" />
                              {t.teams.coach}
                            </p>
                            <p className="text-sm font-medium">{team.coach}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <TeamCarousel
        photos={activeTeam?.photos ?? null}
        title={activeTeam ? carouselTitle(activeTeam) : ''}
        labels={{
          close: t.teams.close,
          prev: t.teams.prev,
          next: t.teams.next,
          counter: t.teams.photoOf,
        }}
        onClose={() => setActiveTeam(null)}
      />
    </section>
  )
}
