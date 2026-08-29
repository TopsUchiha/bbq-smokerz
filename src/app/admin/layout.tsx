import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'
import SessionProvider from '@/components/admin/SessionProvider'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as { role: string }).role !== 'admin') {
    redirect('/admin/login')
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-coal-950 flex">
        <AdminNav />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </SessionProvider>
  )
}
