'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarClock, Check, Send } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { categories } from '@/lib/teams'
import { seasonOpen } from '@/lib/config'

export function Registration() {
  const { t, lang } = useLanguage()
  const [submitted, setSubmitted] = useState(false)

  const sportOptions = [
    { value: 'baloncesto', label: t.teams.basketball },
    { value: 'voleibol', label: t.teams.volleyball },
  ]

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Email-only flow: in production this would POST to an API route / email service.
    setSubmitted(true)
  }

  const fieldClass =
    'w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
  const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground'

  return (
    <section className="mx-auto min-h-screen max-w-3xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="text-center">
        <span
          className={
            'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest ' +
            (seasonOpen
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'border-border bg-card text-muted-foreground')
          }
        >
          <span className={'size-2 rounded-full ' + (seasonOpen ? 'bg-primary' : 'bg-muted-foreground')} />
          {seasonOpen ? t.join.badgeOpen : t.join.badgeClosed}
        </span>
        <h1 className="mt-5 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-balance sm:text-5xl">
          {seasonOpen ? t.join.openTitle : t.join.closedTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-foreground/80">
          {seasonOpen ? t.join.openSubtitle : t.join.closedText}
        </p>
      </div>

      {seasonOpen ? (
        <div className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-10">
          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Check className="size-8" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold uppercase tracking-wide">
                {t.join.successTitle}
              </h2>
              <p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">{t.join.successText}</p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-full border border-border px-6 py-2.5 font-display text-sm font-semibold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
              >
                {t.join.another}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className={labelClass}>
                  {t.join.fullName}
                </label>
                <input id="fullName" name="fullName" type="text" required className={fieldClass} />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  {t.join.email}
                </label>
                <input id="email" name="email" type="email" required className={fieldClass} />
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  {t.join.phone}
                </label>
                <input id="phone" name="phone" type="tel" required className={fieldClass} />
              </div>

              <div>
                <label htmlFor="age" className={labelClass}>
                  {t.join.age}
                </label>
                <input id="age" name="age" type="number" min={7} max={99} required className={fieldClass} />
              </div>

              <div>
                <label htmlFor="sport" className={labelClass}>
                  {t.join.sport}
                </label>
                <select id="sport" name="sport" required defaultValue="" className={fieldClass}>
                  <option value="" disabled>
                    {t.join.selectSport}
                  </option>
                  {sportOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="category" className={labelClass}>
                  {t.join.category}
                </label>
                <select id="category" name="category" required defaultValue="" className={fieldClass}>
                  <option value="" disabled>
                    {t.join.selectCategory}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} · {lang === 'es' ? category.ageEs : category.ageEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="message" className={labelClass}>
                  {t.join.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder={t.join.messagePlaceholder}
                  className={fieldClass}
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  <Send className="size-4" />
                  {t.join.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-border bg-card p-8 sm:p-10">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <CalendarClock className="size-6" />
          </div>
          <h2 className="mt-5 font-display text-xl font-bold uppercase tracking-wide">
            {t.join.trialsInfo}
          </h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">{t.join.trialsInfoText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#contacto"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105"
            >
              {t.join.contactCta}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="size-4" />
              {t.join.backHome}
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}
