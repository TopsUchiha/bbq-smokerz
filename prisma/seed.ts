import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@bbqsmokerz.com' },
    update: {},
    create: {
      email: 'admin@bbqsmokerz.com',
      password: hashedPassword,
      role: 'admin',
    },
  })

  // Categories
  const offsetCat = await prisma.category.upsert({
    where: { slug: 'offset-smokers' },
    update: {},
    create: { name: 'Offset Smokers', slug: 'offset-smokers', order: 1 },
  })
  const trailerCat = await prisma.category.upsert({
    where: { slug: 'trailer-smokers' },
    update: {},
    create: { name: 'Trailer Smokers', slug: 'trailer-smokers', order: 2 },
  })
  const verticalCat = await prisma.category.upsert({
    where: { slug: 'vertical-smokers' },
    update: {},
    create: { name: 'Vertical Smokers', slug: 'vertical-smokers', order: 3 },
  })

  // Products
  await prisma.product.upsert({
    where: { slug: 'classic-offset-24' },
    update: {},
    create: {
      name: 'Classic Offset 24"',
      slug: 'classic-offset-24',
      description: 'A solid 24-inch offset smoker built from 1/4" steel plate. Good for backyard cooks and weekend competitions alike. Holds temperature well and has plenty of cooking space for a full brisket and a rack of ribs.',
      price: 1299,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      images: [],
      categoryId: offsetCat.id,
      featured: true,
      available: true,
      published: true,
      material: '1/4" carbon steel',
      dimensions: '48"L x 24"W x 52"H',
      weight: '185 lbs',
      features: ['Side firebox', 'Heavy-duty grates', 'Thermometer included', 'Adjustable air vents', 'Drain valve'],
    },
  })

  await prisma.product.upsert({
    where: { slug: 'competition-offset-36' },
    update: {},
    create: {
      name: 'Competition Offset 36"',
      slug: 'competition-offset-36',
      description: 'Built for serious cooks who need more real estate. The 36-inch cook chamber gives you room to run multiple cuts at once. The 3/8" firebox is thick enough to hold a consistent burn through a long overnight cook.',
      price: 2499,
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      images: [],
      categoryId: offsetCat.id,
      featured: true,
      available: true,
      published: true,
      material: '1/4" cook chamber, 3/8" firebox',
      dimensions: '64"L x 28"W x 58"H',
      weight: '320 lbs',
      features: ['Extra-thick firebox', 'Two-tier grates', 'Reverse flow option', 'Tuning plates', 'Large ash cleanout'],
    },
  })

  await prisma.product.upsert({
    where: { slug: 'backyard-trailer-smoker' },
    update: {},
    create: {
      name: 'Backyard Trailer Smoker',
      slug: 'backyard-trailer-smoker',
      description: "Take the show on the road. This trailer smoker fits on a standard 5x8 trailer hitch and is ready to roll to catering jobs, tailgates, or competition pits. Built on a welded steel frame with all the right bracing.",
      price: 3799,
      imageUrl: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800',
      images: [],
      categoryId: trailerCat.id,
      featured: true,
      available: true,
      published: true,
      material: '1/4" steel, powder coated',
      dimensions: '84"L x 32"W x 62"H (trailer not included)',
      weight: '580 lbs',
      features: ['Trailer-ready frame', 'Fold-down shelves', 'Warming box', 'Tool hooks', 'LED lighting'],
    },
  })

  await prisma.product.upsert({
    where: { slug: 'vertical-cabinet-smoker' },
    update: {},
    create: {
      name: 'Vertical Cabinet Smoker',
      slug: 'vertical-cabinet-smoker',
      description: 'If you want efficient use of space and even heat distribution, a vertical cabinet is hard to beat. Four adjustable racks let you run ribs, chicken, and sausage all at once without fighting for real estate.',
      price: 1799,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76538249ee8?w=800',
      images: [],
      categoryId: verticalCat.id,
      featured: false,
      available: true,
      published: true,
      material: '3/16" steel',
      dimensions: '24"W x 24"D x 60"H',
      weight: '210 lbs',
      features: ['4 adjustable racks', 'Bottom firebox', 'Even heat distribution', 'Heavy-duty handles', 'Gasket-sealed doors'],
    },
  })

  // Approved reviews
  const products = await prisma.product.findMany()
  for (const p of products) {
    await prisma.review.createMany({
      skipDuplicates: true,
      data: [
        {
          name: 'Marcus T.',
          email: 'marcus@example.com',
          rating: 5,
          comment: "Built like a tank. My brisket game has never been better. Worth every dollar.",
          productId: p.id,
          approved: true,
        },
        {
          name: 'Sandra K.',
          email: 'sandra@example.com',
          rating: 4,
          comment: "Really solid smoker. Holds temp great through a long cook. Shipping took a bit but packaging was excellent.",
          productId: p.id,
          approved: true,
        },
      ],
    })
  }

  // Site settings
  const settings: { key: string; value: string }[] = [
    { key: 'site_name', value: 'BBQ Smokerz' },
    { key: 'hero_headline', value: 'Built to Smoke.\nBuilt to Last.' },
    { key: 'hero_subheadline', value: 'Custom BBQ smokers built around the way you cook. Heavy steel, serious craftsmanship, no shortcuts.' },
    { key: 'hero_cta_primary', value: 'Shop Smokers' },
    { key: 'hero_cta_secondary', value: 'Contact Us' },
    { key: 'about_title', value: 'Why BBQ Smokerz?' },
    { key: 'about_body', value: "We build smokers the right way — thick steel, tight welds, and fittings that actually hold up to years of hard cooking. Every smoker ships fully assembled and ready to fire.\n\nWe don't do thin-walled imports or generic parts. If your name's going on the smoker, we want it to hold up." },
    { key: 'contact_email', value: 'info@bbqsmokerz.com' },
    { key: 'contact_phone', value: '' },
    { key: 'contact_address', value: '' },
    { key: 'footer_tagline', value: 'Serious smokers for serious cooks.' },
    { key: 'shipping_info', value: 'We ship throughout the United States and Canada. Freight shipping is used for all smokers. Delivery times vary by location — contact us for an estimate.' },
    { key: 'social_facebook', value: '' },
    { key: 'social_instagram', value: '' },
  ]

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    })
  }

  console.log('Seed complete.')
  console.log('Admin login: admin@bbqsmokerz.com / admin123')
  console.log('CHANGE THE ADMIN PASSWORD BEFORE GOING TO PRODUCTION.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
