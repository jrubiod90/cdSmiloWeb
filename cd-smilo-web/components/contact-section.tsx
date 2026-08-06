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

// Número del club en formato internacional (sin signos) para tel: y wa.me.
const PHONE_INTL = '34640845020'
const EMAIL = 'cdsmilogranada@gmail.com'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function ContactSection() {
  const { t } = useLanguage()

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
            {/* Dirección */}
            <div className="flex gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <MapPin className="size-5" />
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t.contact.addressLabel}
                </dt>
                <dd className="mt-0.5 font-medium leading-relaxed">{t.contact.address}</dd>
              </div>
            </div>

            {/* Teléfono + WhatsApp */}
            <div className="flex gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Phone className="size-5" />
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t.contact.phoneLabel}
                </dt>
                <dd className="mt-0.5 font-medium leading-relaxed">
                  <a href={`tel:+${PHONE_INTL}`} className="transition-colors hover:text-primary">
                    {t.contact.phone}
                  </a>
                </dd>
                <a
                  href={`https://wa.me/${PHONE_INTL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-[#25D366] hover:text-[#25D366]"
                >
                  <WhatsAppIcon className="size-4 text-[#25D366]" />
                  {t.contact.whatsapp}
                </a>
              </div>
            </div>

            {/* Correo */}
            <div className="flex gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Mail className="size-5" />
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t.contact.emailLabel}
                </dt>
                <dd className="mt-0.5 font-medium leading-relaxed">
                  <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-primary">
                    {t.contact.email}
                  </a>
                </dd>
              </div>
            </div>

            {/* Horario */}
            <div className="flex gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Clock className="size-5" />
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t.contact.hoursLabel}
                </dt>
                <dd className="mt-0.5 font-medium leading-relaxed">{t.contact.hours}</dd>
              </div>
            </div>
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
            src={`${basePath}/images/facility.jpg`}
            alt="C.D. SMILO, Granada"
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
