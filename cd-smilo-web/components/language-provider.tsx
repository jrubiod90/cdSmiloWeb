'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { dictionary, type Dictionary, type Lang } from '@/lib/i18n'

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  t: Dictionary
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'cdsmilo-lang'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('es')

  // Restore the saved preference on mount (client-only to keep SSR markup stable).
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'es' || saved === 'en') {
      setLang(saved)
    }
  }, [])

  // Keep <html lang> and the stored preference in sync with the active language.
  useEffect(() => {
    document.documentElement.lang = lang
    window.localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const value: LanguageContextValue = {
    lang,
    setLang,
    toggle: () => setLang((prev) => (prev === 'es' ? 'en' : 'es')),
    // Each language literal-narrows to its own shape; they are structurally
    // identical, so present them all as the canonical Dictionary type.
    t: dictionary[lang] as Dictionary,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
