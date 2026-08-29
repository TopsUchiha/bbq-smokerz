import Link from 'next/link'

interface Props {
  siteName: string
  tagline: string
  email: string
  facebook: string
  instagram: string
}

export default function Footer({ siteName, tagline, email, facebook, instagram }: Props) {
  return (
    <footer className="bg-coal-950 border-t border-coal-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          <div>
            <p className="font-display font-bold text-white text-xl mb-2">{siteName}</p>
            <p className="text-coal-400 text-sm">{tagline}</p>
          </div>
          <div>
            <p className="font-display text-white text-sm tracking-wider uppercase mb-3">Links</p>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-coal-400 hover:text-white text-sm transition-colors">Shop Smokers</Link></li>
              <li><Link href="/contact" className="text-coal-400 hover:text-white text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-display text-white text-sm tracking-wider uppercase mb-3">Contact</p>
            {email && <p className="text-coal-400 text-sm mb-1">{email}</p>}
            <div className="flex gap-4 mt-3">
              {facebook && <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-coal-400 hover:text-white text-sm transition-colors">Facebook</a>}
              {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-coal-400 hover:text-white text-sm transition-colors">Instagram</a>}
            </div>
          </div>
        </div>
        <div className="border-t border-coal-800 pt-8 text-center">
          <p className="text-coal-600 text-sm">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
