import { prisma } from '@/lib/prisma'
import SettingsForm from '@/components/admin/SettingsForm'

export const metadata = { title: 'Settings – Admin' }

export default async function SettingsPage() {
  const settings = await prisma.siteSetting.findMany()
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return (
    <div className="lg:pt-0 pt-14">
      <h1 className="font-display font-bold text-3xl text-white mb-8">Site Settings</h1>
      <SettingsForm settings={map} />
    </div>
  )
}
