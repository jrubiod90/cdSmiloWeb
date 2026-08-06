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
    { href: '/#sedes', label: t.nav.venues },
    { href: '/#contacto', label: t.nav.contact },
    { href: '/inscripcion', label: t.nav.join },
  ]

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center border-b border-border pb-12 text-center">
          <Image
            src={`${basePath}/images/crest.png`}
            alt="Escudo C.D. SMILO"
            width={200}
            height={200}
            className="h-32 w-32 object-contain sm:h-40 sm:w-40"
          />
          <span className="mt-4 font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl">
            C.D. SMILO
          </span>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t.footer.tagline}
          </p>
        </div>

        <div className="grid gap-10 pt-12 sm:grid-cols-2">
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
              <li>{t.contact.address}</li>
              <li>{t.contact.phone}</li>
              <li>{t.contact.email}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} C.D. SMILO. {t.footer.rights}
        </div>
      </div>
    </footer>
  )
}
