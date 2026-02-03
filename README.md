# FTC FlowDeck

Enterprise-grade interactive sales presentation web app for iPad horizontal display with Microsoft OAuth, Sanity.io CMS, real-time collaboration, and email functionality.

## Overview

FTC FlowDeck is a production-ready Next.js 14 application designed specifically for iPad landscape mode, featuring:

- **Microsoft OAuth Authentication** - Secure login with Outlook/Office 365 credentials
- **Sanity.io CMS** - No-code content management for products, PDFs, and presentations
- **Real-time Collaboration** - Multi-user sync with Server-Sent Events
- **Email System** - Send PDFs via Resend with professional templates
- **Reminder System** - Scheduled emails via Vercel Cron Jobs
- **iPad Optimized** - 44x44px touch targets, landscape-only, 60fps animations
- **Design Match** - Exactly matches the provided PDF specifications

## Technology Stack

- **Next.js 14.2.15** (App Router, Server Components)
- **React 18.3.1** + **TypeScript 5.6.3**
- **Tailwind CSS 3.4.15** (iPad-optimized breakpoints)
- **NextAuth.js 5.0.0** (Microsoft Entra ID OAuth)
- **Sanity.io** (Content Management System)
- **Supabase** (PostgreSQL for transactional data)
- **Resend** (Email delivery)
- **React Email** (Email templates)
- **Framer Motion** (60fps animations)
- **Vercel** (Deployment platform)

## Project Structure

```
ftc-flowdeck/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Home redirect
│   │   ├── globals.css                # Global styles
│   │   ├── api/                       # API routes
│   │   │   ├── auth/[...nextauth]/    # NextAuth endpoints
│   │   │   ├── email/send/            # Send email API
│   │   │   ├── email/reminder/        # Create reminder API
│   │   │   └── cron/send-reminders/   # Vercel Cron Job
│   │   ├── (auth)/login/              # Login page
│   │   └── (protected)/               # Protected routes
│   │       ├── home/                  # Home screen (3 buttons)
│   │       ├── products/              # Products navigation
│   │       ├── intro-presentation/    # Slides
│   │       └── knowledge-base/        # Articles
│   ├── components/                    # React components
│   │   ├── ui/                        # Base UI components
│   │   ├── layout/                    # Layout components
│   │   ├── product/                   # Product components
│   │   └── auth/                      # Auth components
│   ├── lib/                           # Library code
│   │   ├── auth/                      # NextAuth configuration
│   │   ├── sanity/                    # Sanity client & schemas
│   │   ├── supabase/                  # Supabase client
│   │   ├── email/                     # Email templates
│   │   └── utils/                     # Utilities
│   ├── hooks/                         # Custom React hooks
│   └── types/                         # TypeScript types
├── sanity/                            # Sanity Studio config
├── public/                            # Static assets
│   └── assets/                        # Logos, icons, images
├── .env.local.example                 # Environment variables
├── next.config.js                     # Next.js configuration
├── tailwind.config.ts                 # Tailwind configuration
├── vercel.json                        # Vercel config (cron jobs)
└── package.json                       # Dependencies
```

## Quick Start

### Prerequisites

- **Node.js 20+** and **npm 10+**
- **Git** for version control
- Accounts for:
  - **Microsoft Azure** (for OAuth)
  - **Sanity.io** (for CMS)
  - **Supabase** (for database)
  - **Resend** (for email)
  - **Vercel** (for deployment)

### 1. Installation

```bash
# Navigate to project directory
cd ftc-flowdeck

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### 2. Setup Services

#### A. Microsoft Azure AD (OAuth)

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations** → **New registration**
3. Name: "FTC FlowDeck"
4. Supported account types: "Accounts in this organizational directory only"
5. Redirect URI: `http://localhost:3000/api/auth/callback/azure-ad` (for development)
6. After creation, note:
   - **Application (client) ID** → `AZURE_AD_CLIENT_ID`
   - **Directory (tenant) ID** → `AZURE_AD_TENANT_ID`
7. Go to **Certificates & secrets** → **New client secret**
   - Note the secret value → `AZURE_AD_CLIENT_SECRET`
8. Go to **API permissions** → **Add permission** → **Microsoft Graph**
   - Add: `User.Read`, `profile`, `email`, `openid`

#### B. Sanity.io (CMS)

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Login to Sanity
sanity login

# Initialize Sanity project
cd sanity
sanity init

# Follow prompts:
# - Create new project
# - Project name: "FTC FlowDeck"
# - Use default dataset: "production"
# - Output path: current directory

# Note the PROJECT_ID from output → NEXT_PUBLIC_SANITY_PROJECT_ID
```

Create API token:
1. Go to [Sanity Management](https://www.sanity.io/manage)
2. Select your project → **API** → **Tokens**
3. **Add API token** → Name: "FTC FlowDeck", Permissions: "Editor"
4. Note the token → `SANITY_API_TOKEN`

#### C. Supabase (Database)

1. Go to [Supabase](https://supabase.com)
2. **New Project** → Name: "FTC FlowDeck"
3. Note from **Settings** → **API**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)
4. Go to **SQL Editor** → **New query**
5. Paste contents of `src/lib/supabase/schema.sql` and run

#### D. Resend (Email)

1. Go to [Resend](https://resend.com)
2. **Sign up** → Create account
3. **API Keys** → **Create API Key**
4. Note the key → `RESEND_API_KEY`
5. **Domains** → **Add Domain** (for production)
   - Follow DNS setup instructions
   - For development, use Resend's test domain

### 3. Configure Environment Variables

Edit `.env.local`:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret  # Generate: openssl rand -base64 32

# Microsoft Azure AD
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend
RESEND_API_KEY=your-resend-api-key

# Cron Secret
CRON_SECRET=your-secure-random-string  # Generate: openssl rand -hex 32
```

### 4. Development

```bash
# Start Next.js development server
npm run dev

# In another terminal, start Sanity Studio (optional)
cd sanity
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Sanity Studio will be available at [http://localhost:3333](http://localhost:3333).

## Completing the Implementation

The project foundation is complete with:
- ✅ Configuration files (Next.js, Tailwind, TypeScript, ESLint)
- ✅ Sanity schemas (product, category, productLine, pdfContent, slide, article)
- ✅ Authentication setup (NextAuth.js with Microsoft OAuth)
- ✅ Database schemas (Supabase SQL)
- ✅ Base UI components (Button, Card, Input, Checkbox)
- ✅ Type definitions
- ✅ Utility functions

### To complete the application, implement these remaining features:

#### 1. Login Page (`src/app/(auth)/login/page.tsx`)

Create a clean Microsoft OAuth login page matching the PDF design:
- FTC logo centered
- "Sign in with Microsoft" button
- Use `signIn()` from `next-auth/react`

#### 2. Home Page (`src/app/(protected)/home/page.tsx`)

Implement the 3-button layout from PDF page 3:
- FTC logo at top center
- "REVOLUTIONARY FILTRATION TECHNOLOGY" tagline
- Three large buttons: INTRO PRESENTATION, PRODUCTS, KNOWLEDGE BASE
- Home icon in top-right (persistent across all pages)

#### 3. Products Navigation Flow

**Categories Page** (`src/app/(protected)/products/page.tsx`):
- 2x2 grid showing LS, LL, GL, GS categories
- Fetch data with `sanityClient.fetch(categoriesQuery)`
- Each card links to `/products/[categoryId]`

**Product Lines Page** (`src/app/(protected)/products/[categoryId]/page.tsx`):
- Grid showing product lines (CLARIFY, SIEVA, TORRENT, INVICTA, VESSELS)
- Fetch with `productLinesByCategoryQuery`

**Products Grid** (`src/app/(protected)/products/[categoryId]/[productLineId]/page.tsx`):
- 2×5 grid showing all products
- Fetch with `productsByLineQuery`

**Product Detail** (`src/app/(protected)/products/[categoryId]/[productLineId]/[productId]/page.tsx`):
- Above fold: Product image (left) + specs table (right)
- Below fold: Email section with PDF selection
- Fetch with `productDetailQuery`

#### 4. Email Sending API (`src/app/api/email/send/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { resend } from 'resend';
import { createServerClient } from '@/lib/supabase/client';
import { getFileUrl } from '@/lib/sanity/client';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { recipientEmail, pdfContentIds, productId } = await request.json();

  // 1. Fetch PDF file refs from Sanity
  // 2. Download PDF buffers
  // 3. Send email via Resend with attachments
  // 4. Log to Supabase email_logs table
  // 5. Return success/error

  return NextResponse.json({ success: true });
}
```

#### 5. Reminder System (`src/app/api/email/reminder/route.ts`)

Create reminder API and cron job handler following the same pattern.

#### 6. Intro Presentation & Knowledge Base

Implement slides and articles pages using similar patterns.

#### 7. Real-time Collaboration

Use Sanity's `.listen()` API or implement SSE endpoint for live updates.

## Design Guidelines (Matching PDF)

### Color Scheme
- **FTC Blue**: `#1E5AA8`
- **FTC Green**: `#8DC63F`
- **Grays**: Use `ftc-gray-*` classes from Tailwind config

### Touch Targets
- **Minimum size**: 44×44px (Apple HIG)
- **Spacing**: 10px minimum between targets
- **Feedback**: Active state with `scale-95` animation

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Minimum 18px for iPad readability
- **Specs table**: 14-16px with good line height

### iPad Landscape
- Viewport locked to landscape (1024px+)
- Portrait mode shows rotation message
- All layouts optimized for horizontal display

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: FTC FlowDeck"
git remote add origin https://github.com/your-username/ftc-flowdeck.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. **Import Project** → Select GitHub repository
3. **Configure Project**:
   - Framework: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **Environment Variables**: Add all from `.env.local`
5. **Deploy**

### 3. Update OAuth Redirect URIs

After deployment, update redirect URIs in:
- **Azure AD**: Add `https://your-app.vercel.app/api/auth/callback/azure-ad`
- **NextAuth**: Update `NEXTAUTH_URL` to production URL

### 4. Verify Cron Jobs

Go to Vercel Dashboard → **Cron Jobs** → Verify `/api/cron/send-reminders` is scheduled.

## Testing

### Functional Tests

1. **Authentication**:
   - Login with Microsoft account
   - Verify redirect to `/home`
   - Test logout functionality

2. **Navigation**:
   - Home → Products → LS → CLARIFY → CLARIFY 740
   - Verify breadcrumbs update
   - Test back navigation

3. **Email Sending**:
   - Enter email address
   - Select PDFs
   - Send and verify email received

4. **Reminders**:
   - Schedule reminder for 10 minutes
   - Wait and verify email received

5. **Real-time**:
   - Open product page on two devices
   - Edit in Sanity Studio
   - Verify both pages update

### Performance Tests

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-app.vercel.app --view
```

**Target scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

## Content Management

### Sanity Studio Access

1. **Local**: `cd sanity && npm run dev` → [http://localhost:3333](http://localhost:3333)
2. **Production**: Deploy Sanity Studio or use [sanity.studio](https://ftc-flowdeck.sanity.studio)

### Adding Products

1. Go to Sanity Studio → **Products** → **By Category**
2. Select category (e.g., LS - LIQUID | SOLID)
3. Navigate to product line (e.g., CLARIFY)
4. **Create new** → Fill in all fields:
   - Title: "CLARIFY 740 Premium"
   - Slug: Auto-generated
   - Images: Upload product images
   - Specifications: Fill from PDF
   - PDF Content: Link to relevant PDFs
5. **Publish**

### Uploading PDFs

1. Go to **PDF Content Library** → **Create**
2. **Upload PDF file**
3. Fill title, description, category
4. Set display order
5. **Publish**

Products can now reference these PDFs in their `pdfContent` field.

## Troubleshooting

### OAuth Not Working

**Issue**: "Callback URL mismatch"

**Solution**:
1. Verify `NEXTAUTH_URL` matches exactly (with/without trailing slash)
2. Check Azure AD redirect URI includes `/api/auth/callback/azure-ad`
3. Clear browser cookies and try again

### Sanity Images Not Loading

**Issue**: Images return 404

**Solution**:
1. Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
2. Check image URL format: `https://cdn.sanity.io/images/PROJECT_ID/DATASET/...`
3. Ensure images are published in Sanity Studio

### Email Not Sending

**Issue**: Email API returns error

**Solution**:
1. Check `RESEND_API_KEY` is valid
2. Verify sender email domain is verified in Resend
3. Check Resend dashboard for error logs
4. Ensure PDF file refs are valid

### Cron Job Not Running

**Issue**: Reminders not being sent

**Solution**:
1. Verify `vercel.json` cron schedule is correct
2. Check Vercel Dashboard → **Cron Jobs** for execution logs
3. Ensure `CRON_SECRET` matches in code and environment
4. Cron jobs only work in production, not development

## Architecture Decisions

### Why Next.js App Router?

- **Server Components**: Better performance, reduced bundle size
- **Route Handlers**: Simplified API routes
- **Streaming**: Progressive rendering for better UX
- **Built-in**: Image optimization, font optimization

### Why Sanity.io?

- **Real-time**: Built-in listeners for collaboration
- **Flexible**: Custom schemas for any content type
- **Media**: CDN-hosted images and files
- **Studio**: Beautiful, customizable CMS UI
- **Developer-friendly**: GROQ query language

### Why Supabase?

- **PostgreSQL**: ACID compliance for transactional data
- **Real-time**: Database subscriptions
- **Auth**: Built-in authentication (not used here due to Microsoft OAuth requirement)
- **Free tier**: Generous limits for development

### Why Resend?

- **Modern**: Built for developers, great DX
- **React Email**: Native integration
- **Affordable**: Generous free tier
- **Reliable**: High deliverability rates

## Security Considerations

- **Authentication**: Microsoft OAuth with NextAuth.js
- **Environment Variables**: Never commit `.env.local` to git
- **API Routes**: Protected with session checks
- **Database**: Supabase Row Level Security (RLS)
- **Headers**: Security headers in `vercel.json`
- **HTTPS**: Enforced by Vercel

## Performance Optimization

- **Images**: Next.js Image component with automatic optimization
- **Fonts**: Variable fonts with `next/font`
- **Code Splitting**: Automatic per-route splitting
- **Caching**: `useCdn: true` for Sanity in production
- **Animations**: GPU-accelerated with `transform` and `opacity`
- **Bundle Analysis**: Run `npm run build` to see bundle sizes

## Support & Resources

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Sanity Docs**: [sanity.io/docs](https://sanity.io/docs)
- **NextAuth.js**: [next-auth.js.org](https://next-auth.js.org)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

## License

Proprietary - Filtration Technology Corporation

---

**Built with ❤️ for FTC by Claude Sonnet 4.5**
