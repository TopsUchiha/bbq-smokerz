import slugify from 'slugify'

export function toSlug(text: string): string {
  return slugify(text, { lower: true, strict: true })
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
}

export function getSetting(settings: { key: string; value: string }[], key: string, fallback = ''): string {
  return settings.find((s) => s.key === key)?.value ?? fallback
}
