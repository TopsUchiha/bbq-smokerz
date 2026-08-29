import type { Metadata } from 'next'
import { Inter, Oswald } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald', weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: { default: 'BBQ Smokerz', template: '%s | BBQ Smokerz' },
  description: 'Custom BBQ smokers built to last. Heavy steel, serious craftsmanship.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className="font-body bg-coal-950 text-white antialiased">{children}</body>
    </html>
  )
}
