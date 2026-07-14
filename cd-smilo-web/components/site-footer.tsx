'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/language-provider'
import { basePath } from '@/lib/config'

export function SiteFooter() {
  const { t } = useLanguage()

  const navLinks = [
    { href: '/#inicio', label: t.nav.home },
    { href: '/#club', label: t.nav.club },
    { href: '/#equipos', label: t.nav.teams },
    { href: '/#contacto', label: t.nav.contact },
    { href: '/inscripcion', label: t.nav.join },
  ]

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src={`${basePath}/images/crest.png`}
                alt="Escudo C.D SMILO"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <span className="font-display text-2xl font-bold uppercase tracking-wide">
                C.D SMILO
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
              {t.footer.nav}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
              {t.footer.contact}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>C. Gran Vía de Colón, 61, Centro, 18001 Granada, España</li>
              <li>+34 958 123 456</li>
              <li>info@cdsmilo.es</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} C.D SMILO. {t.footer.rights}
        </div>
      </div>
    </footer>
  )
}
