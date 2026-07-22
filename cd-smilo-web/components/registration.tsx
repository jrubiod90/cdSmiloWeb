'use client'

import { useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, CalendarClock, Check, ImageUp, Loader2, Send, X } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { registrationEndpoint, seasonOpen } from '@/lib/config'
import { fileToUpload, submitRegistration, type UploadedFile } from '@/lib/registration-upload'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const MAX_FILE_BYTES = 10 * 1024 * 1024

// Teléfono: solo dígitos, espacios, guiones y un "+" inicial; entre 9 y 20 caracteres.
const PHONE_PATTERN = '[0-9+][0-9\\s-]{8,19}'

// Cualquiera de los tres elementos de formulario a los que atamos la validación.
type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

/**
 * Valida DNI (8 dígitos + letra de control), NIE (X/Y/Z + 7 dígitos + letra) o
 * pasaporte (alfanumérico). Comprueba la letra de control del DNI/NIE.
 */
function isValidDni(value: string): boolean {
  const s = value.trim().toUpperCase()
  const controlLetters = 'TRWAGMYFPDXBNJZSQVHLCKE'
  const dni = /^(\d{8})([A-Z])$/
  const nie = /^([XYZ])(\d{7})([A-Z])$/

  const dniMatch = s.match(dni)
  if (dniMatch) {
    return controlLetters[parseInt(dniMatch[1], 10) % 23] === dniMatch[2]
  }
  const nieMatch = s.match(nie)
  if (nieMatch) {
    const prefix = { X: '0', Y: '1', Z: '2' }[nieMatch[1]] ?? '0'
    return controlLetters[parseInt(prefix + nieMatch[2], 10) % 23] === nieMatch[3]
  }
  // Pasaporte u otro documento: alfanumérico, entre 5 y 20 caracteres.
  return /^[A-Z0-9]{5,20}$/.test(s)
}

export function Registration() {
  const { t } = useLanguage()
  const [status, setStatus] = useState<Status>('idle')
  const [needsKit, setNeedsKit] = useState('')
  const [kitMode, setKitMode] = useState('')
  const [size, setSize] = useState('')
  const [stockChecked, setStockChecked] = useState(false)
  const [photoId, setPhotoId] = useState<File | null>(null)
  const [identityDocs, setIdentityDocs] = useState<File[]>([])
  const [attempted, setAttempted] = useState(false)
  const [formError, setFormError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const today = new Date().toISOString().slice(0, 10)

  // Traduce el motivo por el que un control no es válido al idioma activo.
  function validationMessage(el: FormControl): string {
    const v = el.validity
    if (v.valueMissing) {
      return el.tagName === 'SELECT' || (el as HTMLInputElement).type === 'radio'
        ? t.join.vSelect
        : t.join.vRequired
    }
    if (v.typeMismatch && (el as HTMLInputElement).type === 'email') return t.join.vEmail
    if (v.patternMismatch) return t.join.vPhone
    if (v.rangeOverflow || v.rangeUnderflow || v.badInput) return t.join.vDate
    return t.join.vInvalid
  }

  // Handlers genéricos: muestran el mensaje traducido y lo limpian al escribir.
  const bind = {
    onInvalid: (e: FormEvent<FormControl>) =>
      e.currentTarget.setCustomValidity(validationMessage(e.currentTarget)),
    onInput: (e: FormEvent<FormControl>) => e.currentTarget.setCustomValidity(''),
  }

  // DNI/NIE/pasaporte: valida el formato en cada pulsación.
  const bindDni = {
    onInvalid: (e: FormEvent<HTMLInputElement>) =>
      e.currentTarget.setCustomValidity(
        e.currentTarget.validity.valueMissing ? t.join.vRequired : t.join.vDni,
      ),
    onInput: (e: FormEvent<HTMLInputElement>) => {
      const el = e.currentTarget
      el.setCustomValidity(el.value && !isValidDni(el.value) ? t.join.vDni : '')
    },
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return

    const form = event.currentTarget
    const formData = new FormData(form)
    // Text fields; checkboxes with the same name are joined into one cell.
    const fields: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      if (typeof value !== 'string') continue
      fields[key] = key in fields ? `${fields[key]}, ${value}` : value
    }

    // Validaciones que el HTML no cubre: documentos y prendas de juego.
    setAttempted(true)
    if (!photoId || identityDocs.length === 0) {
      setFormError(t.join.validationFiles)
      return
    }
    if (needsKit === 'si' && kitMode === 'sueltas' && !fields.gameGarments) {
      setFormError(t.join.validationGarments)
      return
    }
    if (needsKit === 'si' && !size) {
      setFormError(t.join.validationSize)
      return
    }
    setFormError('')

    setStatus('submitting')
    try {
      const uploads: UploadedFile[] = []
      if (photoId) uploads.push(await fileToUpload('foto-carne', photoId))
      for (let i = 0; i < identityDocs.length; i++) {
        uploads.push(await fileToUpload(`documento-identidad-${i + 1}`, identityDocs[i]))
      }

      const payload = {
        submittedAt: new Date().toISOString(),
        fields,
        files: uploads,
      }

      if (registrationEndpoint) {
        await submitRegistration(registrationEndpoint, payload)
      } else {
        // Demo mode: no endpoint configured yet (see lib/config.ts).
        await new Promise((resolve) => setTimeout(resolve, 600))
      }

      setStatus('success')
      form.reset()
      setNeedsKit('')
      setKitMode('')
      setSize('')
      setStockChecked(false)
      setPhotoId(null)
      setIdentityDocs([])
      setAttempted(false)
      setFormError('')
    } catch {
      setStatus('error')
    }
  }

  const fieldClass =
    'w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
  const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground'
  const sectionClass = 'font-display text-lg font-bold uppercase tracking-wide'

  const optionalTag = () => (
    <span className="ml-1 normal-case text-muted-foreground/70">({t.join.optional})</span>
  )

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
          {seasonOpen ? t.join.title : t.join.closedTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-foreground/80">
          {seasonOpen ? t.join.subtitle : t.join.closedText}
        </p>
      </div>

      {seasonOpen ? (
        <div className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-10">
          {status === 'success' ? (
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
                onClick={() => setStatus('idle')}
                className="mt-6 rounded-full border border-border px-6 py-2.5 font-display text-sm font-semibold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
              >
                {t.join.another}
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
              {/* Datos del jugador/a */}
              <fieldset className="grid gap-5 sm:grid-cols-2">
                <legend className={sectionClass + ' mb-4'}>{t.join.sectionPlayer}</legend>

                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className={labelClass}>
                    {t.join.fullName}
                  </label>
                  <input id="fullName" name="fullName" type="text" required {...bind} className={fieldClass} />
                </div>

                <div>
                  <label htmlFor="dni" className={labelClass}>
                    {t.join.dni}
                  </label>
                  <input id="dni" name="dni" type="text" required {...bindDni} className={fieldClass} />
                </div>

                <div>
                  <label htmlFor="nationality" className={labelClass}>
                    {t.join.nationality}
                  </label>
                  <input id="nationality" name="nationality" type="text" required {...bind} className={fieldClass} />
                </div>

                <div>
                  <label htmlFor="birthDate" className={labelClass}>
                    {t.join.birthDate}
                  </label>
                  <input id="birthDate" name="birthDate" type="date" required max={today} {...bind} className={fieldClass} />
                </div>

                <div>
                  <label htmlFor="sex" className={labelClass}>
                    {t.join.sex}
                  </label>
                  <select id="sex" name="sex" required defaultValue="" {...bind} className={fieldClass}>
                    <option value="" disabled>
                      {t.join.selectSex}
                    </option>
                    {t.join.sexOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>

              {/* Contacto */}
              <fieldset className="grid gap-5 sm:grid-cols-2">
                <legend className={sectionClass + ' mb-4'}>{t.join.sectionContact}</legend>

                <div>
                  <label htmlFor="guardianPhone" className={labelClass}>
                    {t.join.guardianPhones}
                  </label>
                  <input
                    id="guardianPhone"
                    name="guardianPhone"
                    type="tel"
                    required
                    pattern={PHONE_PATTERN}
                    inputMode="tel"
                    {...bind}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="playerPhone" className={labelClass}>
                    {t.join.playerPhone}
                    {optionalTag()}
                  </label>
                  <input
                    id="playerPhone"
                    name="playerPhone"
                    type="tel"
                    pattern={PHONE_PATTERN}
                    inputMode="tel"
                    {...bind}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="guardianEmail" className={labelClass}>
                    {t.join.guardianEmail}
                  </label>
                  <input id="guardianEmail" name="guardianEmail" type="email" required {...bind} className={fieldClass} />
                </div>

                <div>
                  <label htmlFor="playerEmail" className={labelClass}>
                    {t.join.playerEmail}
                    {optionalTag()}
                  </label>
                  <input id="playerEmail" name="playerEmail" type="email" {...bind} className={fieldClass} />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className={labelClass}>
                    {t.join.address}
                    {optionalTag()}
                  </label>
                  <input id="address" name="address" type="text" className={fieldClass} />
                  <p className="mt-1.5 text-xs text-muted-foreground/80">{t.join.addressHint}</p>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="school" className={labelClass}>
                    {t.join.school}
                  </label>
                  <input id="school" name="school" type="text" required {...bind} className={fieldClass} />
                </div>
              </fieldset>

              {/* Deporte */}
              <fieldset className="grid gap-5 sm:grid-cols-2">
                <legend className={sectionClass + ' mb-4'}>{t.join.sectionSport}</legend>

                <div className="flex flex-col">
                  <label htmlFor="sport" className={labelClass}>
                    {t.join.sport}
                  </label>
                  <select id="sport" name="sport" required defaultValue="" {...bind} className={'mt-auto ' + fieldClass}>
                    <option value="" disabled>
                      {t.join.selectSport}
                    </option>
                    {t.join.sportOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="compete" className={labelClass}>
                    {t.join.compete}
                    {optionalTag()}
                  </label>
                  <select id="compete" name="compete" defaultValue="" className={'mt-auto ' + fieldClass}>
                    <option value="" disabled>
                      {t.join.selectOption}
                    </option>
                    <option value="si">{t.join.yes}</option>
                    <option value="no">{t.join.no}</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="previousTeam" className={labelClass}>
                    {t.join.previousTeam}
                    {optionalTag()}
                  </label>
                  <input id="previousTeam" name="previousTeam" type="text" className={fieldClass} />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="otherInfo" className={labelClass}>
                    {t.join.otherInfo}
                    {optionalTag()}
                  </label>
                  <textarea
                    id="otherInfo"
                    name="otherInfo"
                    rows={3}
                    placeholder={t.join.otherInfoPlaceholder}
                    className={fieldClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="needsKit" className={labelClass}>
                    {t.join.needsKit}
                  </label>
                  <select
                    id="needsKit"
                    name="needsKit"
                    required
                    value={needsKit}
                    onInvalid={(e) => e.currentTarget.setCustomValidity(validationMessage(e.currentTarget))}
                    onChange={(event) => {
                      event.currentTarget.setCustomValidity('')
                      setNeedsKit(event.target.value)
                    }}
                    className={fieldClass}
                  >
                    <option value="" disabled>
                      {t.join.selectOption}
                    </option>
                    <option value="si">{t.join.yes}</option>
                    <option value="no">{t.join.no}</option>
                  </select>
                </div>
              </fieldset>

              {/* Ropa (solo si la necesita) */}
              {needsKit === 'si' && (
                <div className="space-y-4">
                  <h3 className={sectionClass}>{t.join.sectionKit}</h3>
                  <div className="space-y-6 rounded-xl border border-border bg-background/50 p-5">
                  <div>
                    <p className={labelClass}>{t.join.kitModeLabel}</p>
                    <div className="space-y-2">
                      {[
                        { value: 'pack', label: t.join.kitModePack },
                        { value: 'sueltas', label: t.join.kitModeLoose },
                      ].map((option) => (
                        <label key={option.value} className="flex items-start gap-3 text-sm">
                          <input
                            type="radio"
                            name="kitMode"
                            value={option.label}
                            required
                            checked={kitMode === option.value}
                            onInvalid={(e) => e.currentTarget.setCustomValidity(t.join.vSelect)}
                            onChange={(e) => {
                              e.currentTarget.setCustomValidity('')
                              setKitMode(option.value)
                            }}
                            className="mt-0.5 size-4 shrink-0 accent-primary"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {kitMode === 'sueltas' && (
                    <div>
                      <p className={labelClass}>{t.join.gameGarmentsLabel}</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {t.join.gameGarments.map((item) => (
                          <label key={item} className="flex items-start gap-3 text-sm">
                            <input
                              type="checkbox"
                              name="gameGarments"
                              value={item}
                              className="mt-0.5 size-4 shrink-0 accent-primary"
                            />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className={labelClass}>{t.join.extrasLabel}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {t.join.extras.map((item) => (
                        <label key={item} className="flex items-start gap-3 text-sm">
                          <input
                            type="checkbox"
                            name="extras"
                            value={item}
                            className="mt-0.5 size-4 shrink-0 accent-primary"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                      <label className="flex items-start gap-3 text-sm">
                        <input
                          type="checkbox"
                          name="extras"
                          value={t.join.stockLabel}
                          checked={stockChecked}
                          onChange={(event) => setStockChecked(event.target.checked)}
                          className="mt-0.5 size-4 shrink-0 accent-primary"
                        />
                        <span>{t.join.stockLabel}</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className={labelClass}>{t.join.sizeLabel}</p>
                    <div className="flex flex-wrap gap-2">
                      {t.join.sizes.map((option) => (
                        <label
                          key={option}
                          className={
                            'cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors ' +
                            (size === option
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50')
                          }
                        >
                          <input
                            type="radio"
                            name="size"
                            value={option}
                            checked={size === option}
                            onChange={() => setSize(option)}
                            className="sr-only"
                          />
                          {option}
                        </label>
                      ))}
                      <label
                        className={
                          'cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors ' +
                          (size === 'diferentes'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50')
                        }
                      >
                        <input
                          type="radio"
                          name="size"
                          value={t.join.sizeDifferent}
                          checked={size === 'diferentes'}
                          onChange={() => setSize('diferentes')}
                          className="sr-only"
                        />
                        {t.join.sizeDifferent}
                      </label>
                    </div>
                  </div>

                  {size === 'diferentes' && (
                    <div>
                      <label htmlFor="sizeDetails" className={labelClass}>
                        {t.join.sizeDetailsLabel}
                      </label>
                      <textarea
                        id="sizeDetails"
                        name="sizeDetails"
                        rows={2}
                        required
                        {...bind}
                        placeholder={t.join.sizeDetailsPlaceholder}
                        className={fieldClass}
                      />
                    </div>
                  )}

                  {stockChecked && (
                    <div>
                      <label htmlFor="stockDetails" className={labelClass}>
                        {t.join.stockDetailsLabel}
                      </label>
                      <textarea
                        id="stockDetails"
                        name="stockDetails"
                        rows={2}
                        required
                        {...bind}
                        placeholder={t.join.stockDetailsPlaceholder}
                        className={fieldClass}
                      />
                    </div>
                  )}
                  </div>
                </div>
              )}

              {/* Documentación */}
              <fieldset className="space-y-5">
                <legend className={sectionClass}>{t.join.sectionDocs}</legend>
                <p className="text-sm leading-relaxed text-muted-foreground">{t.join.docsIntro}</p>

                <SingleFileField
                  label={t.join.photoId}
                  hint={t.join.photoIdHint}
                  chooseLabel={t.join.fileChoose}
                  changeLabel={t.join.fileChange}
                  tooLargeLabel={t.join.fileTooLarge}
                  requiredLabel={t.join.fileRequired}
                  invalid={attempted && !photoId}
                  accept="image/*"
                  file={photoId}
                  onSelect={setPhotoId}
                />

                <MultiFileField
                  label={t.join.identityDocs}
                  hint={t.join.identityDocsHint}
                  addLabel={t.join.fileAdd}
                  removeLabel={t.join.fileRemove}
                  tooLargeLabel={t.join.fileTooLarge}
                  requiredLabel={t.join.fileRequired}
                  invalid={attempted && identityDocs.length === 0}
                  accept="image/*,application/pdf"
                  files={identityDocs}
                  onChange={setIdentityDocs}
                />
              </fieldset>

              {/* Consentimiento */}
              <label className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm leading-relaxed">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  onInvalid={(e) => e.currentTarget.setCustomValidity(t.join.vConsent)}
                  onChange={(e) => e.currentTarget.setCustomValidity('')}
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                />
                <span className="text-muted-foreground">{t.join.consent}</span>
              </label>

              {formError && status !== 'error' && (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                  <p className="text-destructive">{formError}</p>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                  <div>
                    <p className="font-semibold text-destructive">{t.join.errorTitle}</p>
                    <p className="mt-1 text-muted-foreground">{t.join.errorText}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t.join.submitting}
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    {status === 'error' ? t.join.retry : t.join.submit}
                  </>
                )}
              </button>
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

type SingleFileFieldProps = {
  label: string
  hint: string
  chooseLabel: string
  changeLabel: string
  tooLargeLabel: string
  requiredLabel: string
  invalid: boolean
  accept: string
  file: File | null
  onSelect: (file: File | null) => void
}

function SingleFileField({
  label,
  hint,
  chooseLabel,
  changeLabel,
  tooLargeLabel,
  requiredLabel,
  invalid,
  accept,
  file,
  onSelect,
}: SingleFileFieldProps) {
  const [error, setError] = useState('')

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null
    if (selected && selected.size > MAX_FILE_BYTES) {
      setError(tooLargeLabel)
      onSelect(null)
      event.target.value = ''
      return
    }
    setError('')
    onSelect(selected)
  }

  const showError = error || (invalid ? requiredLabel : '')

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <label
        className={
          'flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed bg-background px-4 py-6 text-center transition-colors hover:border-primary/60 ' +
          (invalid ? 'border-destructive/60' : 'border-input')
        }
      >
        <ImageUp className={'size-7 ' + (file ? 'text-primary' : 'text-muted-foreground')} />
        <span className="text-sm font-medium text-foreground">{file ? file.name : chooseLabel}</span>
        <span className={'text-[11px] ' + (showError ? 'text-destructive' : 'text-muted-foreground/70')}>
          {file ? changeLabel : showError || hint}
        </span>
        <input type="file" accept={accept} className="sr-only" onChange={handleChange} />
      </label>
    </div>
  )
}

type MultiFileFieldProps = {
  label: string
  hint: string
  addLabel: string
  removeLabel: string
  tooLargeLabel: string
  requiredLabel: string
  invalid: boolean
  accept: string
  files: File[]
  onChange: (files: File[]) => void
}

function MultiFileField({
  label,
  hint,
  addLabel,
  removeLabel,
  tooLargeLabel,
  requiredLabel,
  invalid,
  accept,
  files,
  onChange,
}: MultiFileFieldProps) {
  const [error, setError] = useState('')
  const showError = error || (invalid ? requiredLabel : '')

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (selected.length === 0) return
    const tooBig = selected.some((file) => file.size > MAX_FILE_BYTES)
    if (tooBig) {
      setError(tooLargeLabel)
      return
    }
    setError('')
    onChange([...files, ...selected])
  }

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      {files.length > 0 && (
        <ul className="mb-3 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => onChange(files.filter((_, i) => i !== index))}
                className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
              >
                <X className="size-3.5" />
                {removeLabel}
              </button>
            </li>
          ))}
        </ul>
      )}
      <label
        className={
          'flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed bg-background px-4 py-6 text-center transition-colors hover:border-primary/60 ' +
          (invalid ? 'border-destructive/60' : 'border-input')
        }
      >
        <ImageUp className={'size-7 ' + (files.length ? 'text-primary' : 'text-muted-foreground')} />
        <span className="text-sm font-medium text-foreground">{addLabel}</span>
        <span className={'text-[11px] ' + (showError ? 'text-destructive' : 'text-muted-foreground/70')}>
          {showError || hint}
        </span>
        <input type="file" accept={accept} multiple className="sr-only" onChange={handleChange} />
      </label>
    </div>
  )
}
