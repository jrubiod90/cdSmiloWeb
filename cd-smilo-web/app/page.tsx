import { SiteHeader } from '@/components/site-header'
import { HeroSection } from '@/components/hero-section'
import { ClubSection } from '@/components/club-section'
import { TeamsSection } from '@/components/teams-section'
import { ContactSection } from '@/components/contact-section'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <ClubSection />
        <TeamsSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
