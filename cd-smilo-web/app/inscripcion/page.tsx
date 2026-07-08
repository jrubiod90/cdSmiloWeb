import { SiteHeader } from '@/components/site-header'
import { Registration } from '@/components/registration'
import { SiteFooter } from '@/components/site-footer'

export default function InscripcionPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Registration />
      </main>
      <SiteFooter />
    </>
  )
}
