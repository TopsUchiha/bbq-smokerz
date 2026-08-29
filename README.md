# BBQ Smokerz

A production-ready BBQ smoker business website with a full admin panel.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma** ORM
- **PostgreSQL** (Neon or Supabase — works locally and on Vercel)
- **NextAuth v4** (admin authentication)

---

## Local Setup

### 1. Clone and install

```bash
cd Jenkins
npm install
```

### 2. Create a PostgreSQL database

Get a free database from [Neon](https://neon.tech) or [Supabase](https://supabase.com).

Copy the connection string.

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secret:
```bash
openssl rand -base64 32
```

### 4. Run database migrations

```bash
npm run db:push
```

### 5. Seed with sample data

```bash
npm run db:seed
```

This creates:
- Admin account: `admin@bbqsmokerz.com` / `admin123`
- 4 sample products
- 3 categories
- Sample approved reviews
- All site settings

**Change the admin password before going to production.**

### 6. Start the dev server

```bash
npm run dev
```

Visit:
- **Public site**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin

---

## Vercel Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/bbq-smokerz.git
git push -u origin main
```

### 2. Import to Vercel

Go to [vercel.com](https://vercel.com) → New Project → Import your repo.

### 3. Set environment variables in Vercel

In your Vercel project settings → Environment Variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon/Supabase PostgreSQL URL |
| `NEXTAUTH_SECRET` | Random secret (32+ chars) |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |

### 4. Deploy

Vercel auto-deploys on every push to `main`.

After first deploy, run the seed if you want sample data:
```bash
DATABASE_URL="your-prod-url" npm run db:seed
```

---

## Admin Panel

Access at `/admin/login`.

### What the admin can control:

| Section | Capabilities |
|---------|-------------|
| **Products** | Create, edit, delete; set price, images, specs, features, availability, published status, featured |
| **Categories** | Add, rename, hide, delete categories |
| **Reviews** | Approve or delete customer reviews |
| **Messages** | View and manage contact form submissions |
| **Settings** | Edit hero text, about section, shipping info, contact info, social links, footer tagline |

---

## Changing the Admin Password

1. Log into the admin panel
2. Go to Settings (this will be added as a future feature)

Or manually via Prisma Studio:

```bash
npm run db:studio
```

Then update the `password` field with a new bcrypt hash.

To generate a hash:
```js
const bcrypt = require('bcryptjs')
console.log(await bcrypt.hash('your-new-password', 12))
```

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Customer-facing pages
│   │   ├── page.tsx       # Homepage
│   │   ├── products/      # Product listing + detail
│   │   └── contact/       # Contact form
│   ├── admin/             # Admin panel (auth-protected)
│   │   ├── page.tsx       # Dashboard
│   │   ├── products/      # Product management
│   │   ├── categories/    # Category management
│   │   ├── reviews/       # Review moderation
│   │   ├── messages/      # Contact messages
│   │   └── settings/      # Site settings
│   └── api/               # API routes
│       ├── auth/          # NextAuth
│       ├── reviews/       # Public review submission
│       ├── contact/       # Contact form
│       └── admin/         # Protected admin APIs
├── components/
│   ├── public/            # Header, Footer, ReviewCard, ReviewForm
│   └── admin/             # AdminNav, ProductForm, etc.
└── lib/
    ├── prisma.ts          # Database client
    ├── auth.ts            # NextAuth config
    └── utils.ts           # Helpers
```

---

## Security Notes

- All admin API routes check authentication server-side
- Passwords are hashed with bcrypt (cost factor 12)
- User input is validated with Zod
- Sessions use JWT stored in secure HTTP-only cookies
- Never commit `.env.local` — it's in `.gitignore`
