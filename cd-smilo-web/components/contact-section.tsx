'use client'

import Image from 'next/image'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { basePath } from '@/lib/config'

const socials = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
]

export function ContactSection() {
  const { t } = useLanguage()

  const details = [
    { icon: MapPin, label: t.contact.addressLabel, value: t.contact.address },
    { icon: Phone, label: t.contact.phoneLabel, value: '+34 958 123 456' },
    { icon: Mail, label: t.contact.emailLabel, value: 'info@cdsmilo.es' },
    { icon: Clock, label: t.contact.hoursLabel, value: t.contact.hours },
  ]

  return (
    <section id="contacto" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {t.contact.tag}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-balance sm:text-5xl">
            {t.contact.title}
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-foreground/80">
            {t.contact.subtitle}
          </p>

          <dl className="mt-10 space-y-6">
            {details.map((detail) => {
              const Icon = detail.icon
              return (
                <div key={detail.label} className="flex gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                      {detail.label}
                    </dt>
                    <dd className="mt-0.5 font-medium leading-relaxed">{detail.value}</dd>
                  </div>
                </div>
              )
            })}
          </dl>

          <div className="mt-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {t.contact.followLabel}
            </p>
            <div className="mt-3 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border px-4 py-2 font-display text-xs font-semibold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="relative min-h-80 overflow-hidden rounded-2xl border border-border">
          <Image
            src={`${basePath}/images/facility.png`}
            alt="IES Padre Suárez, Granada"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
          <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 backdrop-blur-sm">
            <MapPin className="size-4 text-primary" />
            <span className="font-display text-sm font-semibold uppercase tracking-widest">
              Granada, España
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
