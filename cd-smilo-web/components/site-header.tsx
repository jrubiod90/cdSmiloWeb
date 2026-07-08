'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { t, lang, toggle } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Absolute anchors so they also work from other routes (e.g. /inscripcion).
  const links = [
    { href: '/#inicio', label: t.nav.home },
    { href: '/#club', label: t.nav.club },
    { href: '/#equipos', label: t.nav.teams },
    { href: '/#contacto', label: t.nav.contact },
  ]

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || open
          ? 'border-b border-border bg-background/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/images/crest.png"
            alt="Escudo C.D SMILO"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
          <span className="font-display text-xl font-bold uppercase leading-none tracking-wide">
            C.D SMILO
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-sm font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label="Change language"
            className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
          >
            <span className={cn(lang === 'es' && 'text-primary')}>ES</span>
            <span className="text-muted-foreground">/</span>
            <span className={cn(lang === 'en' && 'text-primary')}>EN</span>
          </button>

          <Link
            href="/inscripcion"
            className="hidden rounded-full bg-primary px-5 py-2 font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105 sm:inline-block"
          >
            {t.nav.join}
          </Link>

          <button
            type="button"
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 pb-6 pt-2 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 font-display text-base font-medium uppercase tracking-widest text-foreground/90"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/inscripcion"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-primary px-5 py-3 text-center font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground"
          >
            {t.nav.join}
          </Link>
        </nav>
      )}
    </header>
  )
}
