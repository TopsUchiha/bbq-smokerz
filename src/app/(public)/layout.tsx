import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/utils'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSetting.findMany()
  const siteName = getSetting(settings, 'site_name', 'BBQ Smokerz')
  const footerTagline = getSetting(settings, 'footer_tagline', 'Serious smokers for serious cooks.')
  const contactEmail = getSetting(settings, 'contact_email', '')
  const socialFb = getSetting(settings, 'social_facebook', '')
  const socialIg = getSetting(settings, 'social_instagram', '')

  return (
    <div className="flex flex-col min-h-screen">
      <Header siteName={siteName} />
      <main className="flex-1">{children}</main>
      <Footer
        siteName={siteName}
        tagline={footerTagline}
        email={contactEmail}
        facebook={socialFb}
        instagram={socialIg}
      />
    </div>
  )
}
