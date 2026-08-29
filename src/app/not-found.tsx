import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-coal-950 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="font-display font-bold text-ember text-8xl mb-4">404</p>
        <h1 className="font-display font-bold text-white text-3xl mb-4">Page not found</h1>
        <p className="text-coal-400 mb-8">That page doesn't exist or was moved.</p>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  )
}
