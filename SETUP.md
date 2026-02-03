# FTC FlowDeck - Quick Setup Guide

## 🚀 Your Application is Ready!

All dependencies are installed. You just need to get credentials from 5 services (all have free tiers), and you'll be running locally in 15 minutes.

---

## ✅ Step 1: Generate Secrets (2 minutes)

### 1.1 Generate NEXTAUTH_SECRET

**Windows PowerShell:**
```powershell
# Open PowerShell and run:
[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}|%{[byte]$_}))
```

**Git Bash / Linux / Mac:**
```bash
openssl rand -base64 32
```

**Or use online generator:**
https://generate-secret.vercel.app/32

Copy the output → Open `.env.local` → Replace `YOUR_NEXTAUTH_SECRET_GENERATE_THIS`

### 1.2 Generate CRON_SECRET

**Windows PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

**Git Bash / Linux / Mac:**
```bash
openssl rand -hex 32
```

Copy the output → Open `.env.local` → Replace `YOUR_CRON_SECRET_GENERATE_THIS`

---

## ✅ Step 2: Microsoft Azure AD (5 minutes)

### Why: This enables "Sign in with Microsoft" login

1. **Go to Azure Portal:**
   - Visit: https://portal.azure.com
   - Sign in with your Microsoft account

2. **Create App Registration:**
   - Search for "Azure Active Directory"
   - Click "App registrations" → "New registration"
   - **Name:** `FTC FlowDeck`
   - **Supported account types:** Select "Accounts in this organizational directory only"
   - **Redirect URI:**
     - Platform: Web
     - URL: `http://localhost:3000/api/auth/callback/azure-ad`
   - Click "Register"

3. **Copy Credentials:**
   - You'll see the app overview page
   - **Copy "Application (client) ID"** → `.env.local` → `AZURE_AD_CLIENT_ID`
   - **Copy "Directory (tenant) ID"** → `.env.local` → `AZURE_AD_TENANT_ID`

4. **Create Client Secret:**
   - Click "Certificates & secrets" (left menu)
   - Click "New client secret"
   - Description: `FTC FlowDeck Secret`
   - Expires: 24 months
   - Click "Add"
   - **Copy the SECRET VALUE** (not the ID!) → `.env.local` → `AZURE_AD_CLIENT_SECRET`
   - ⚠️ Copy now! It won't be shown again

5. **Add API Permissions:**
   - Click "API permissions" (left menu)
   - Click "Add a permission"
   - Choose "Microsoft Graph"
   - Choose "Delegated permissions"
   - Select: `User.Read`, `profile`, `email`, `openid`
   - Click "Add permissions"
   - Click "Grant admin consent" (if you're admin)

✅ **Done!** You now have Azure AD credentials.

---

## ✅ Step 3: Sanity.io CMS (3 minutes)

### Why: This is your no-code content management system

1. **Install Sanity CLI:**
   ```bash
   npm install -g @sanity/cli
   ```

2. **Initialize Sanity:**
   ```bash
   cd c:\Users\Somli\OneDrive\Desktop\Flowdeck\ftc-flowdeck
   npx sanity init --project-plan free
   ```

3. **Follow the prompts:**
   - **Login:** It will open browser to login with Google/GitHub
   - **Create new project:** Yes
   - **Project name:** `FTC FlowDeck`
   - **Use default dataset configuration:** Yes
   - **Output path:** Just press Enter (current directory)

4. **Copy Project ID:**
   - After setup, it will show your **Project ID**
   - **Copy the Project ID** → `.env.local` → `NEXT_PUBLIC_SANITY_PROJECT_ID`

5. **Get API Token:**
   - Visit: https://www.sanity.io/manage
   - Select your project "FTC FlowDeck"
   - Click "API" tab
   - Click "Tokens" → "Add API token"
   - **Token name:** `FTC FlowDeck Dev`
   - **Permissions:** Editor
   - Click "Add token"
   - **Copy the token** → `.env.local` → `SANITY_API_TOKEN`

✅ **Done!** Your CMS is ready.

---

## ✅ Step 4: Supabase Database (3 minutes)

### Why: This stores email logs and reminders

1. **Create Supabase Project:**
   - Visit: https://supabase.com
   - Click "Start your project" (sign up with GitHub/Google)
   - Click "New Project"
   - **Organization:** Create new or select existing
   - **Project name:** `ftc-flowdeck`
   - **Database Password:** Create a strong password (save it somewhere!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free
   - Click "Create new project"
   - ⏳ Wait 2-3 minutes for setup

2. **Get API Credentials:**
   - Once ready, go to "Settings" → "API"
   - **Copy "Project URL"** → `.env.local` → `NEXT_PUBLIC_SUPABASE_URL`
   - **Copy "anon public key"** → `.env.local` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Copy "service_role key"** → `.env.local` → `SUPABASE_SERVICE_ROLE_KEY`

3. **Create Database Tables:**
   - Go to "SQL Editor"
   - Click "New query"
   - Open file: `src/lib/supabase/schema.sql`
   - Copy ALL contents
   - Paste into Supabase SQL editor
   - Click "Run" (bottom right)
   - ✅ You should see "Success. No rows returned"

4. **Verify Tables Created:**
   - Go to "Table Editor"
   - You should see: `email_logs`, `reminders`, `analytics_events`

✅ **Done!** Your database is ready.

---

## ✅ Step 5: Resend Email (2 minutes)

### Why: This sends emails with PDF attachments

1. **Create Resend Account:**
   - Visit: https://resend.com
   - Click "Sign Up"
   - Sign up with email or GitHub

2. **Get API Key:**
   - After signup, you'll be on the dashboard
   - Click "API Keys" (left sidebar)
   - Click "Create API Key"
   - **Name:** `FTC FlowDeck`
   - **Permission:** Full Access
   - Click "Create"
   - **Copy the API key** → `.env.local` → `RESEND_API_KEY`
   - ⚠️ Copy now! It won't be shown again

3. **For Development:**
   - Use the default email: `onboarding@resend.dev`
   - Update `.env.local`:
     ```
     RESEND_FROM_EMAIL=onboarding@resend.dev
     ```

4. **For Production (Later):**
   - Click "Domains" → "Add Domain"
   - Enter your domain (e.g., `ftc-flowdeck.com`)
   - Add DNS records as instructed
   - Once verified, update `RESEND_FROM_EMAIL` to: `noreply@yourdomain.com`

✅ **Done!** Email sending is configured.

---

## ✅ Step 6: Verify & Run (1 minute)

1. **Check Your .env.local File:**
   - Open: `c:\Users\Somli\OneDrive\Desktop\Flowdeck\ftc-flowdeck\.env.local`
   - Verify ALL values are replaced (no "YOUR_XXX" left)
   - Save the file

2. **Run the Application:**
   ```bash
   cd c:\Users\Somli\OneDrive\Desktop\Flowdeck\ftc-flowdeck
   npm run dev
   ```

3. **Open in Browser:**
   - Visit: http://localhost:3000
   - You should see the login page!

4. **Test Login:**
   - Click "Sign in with Microsoft"
   - Login with your Microsoft account
   - ✅ You should be redirected to the home page with 3 buttons!

---

## 🎨 Step 7: Add Content to CMS (Optional)

### Start Sanity Studio:
```bash
cd c:\Users\Somli\OneDrive\Desktop\Flowdeck\ftc-flowdeck\sanity
npm install
npm run dev
```

Open: http://localhost:3333

### Add Sample Data:

**1. Create Categories:**
- Go to "Products" → "By Category"
- Create 4 categories:
  - LS - LIQUID | SOLID
  - LL - LIQUID | LIQUID
  - GL - GAS | LIQUID
  - GS - GAS | SOLID

**2. Create Product Lines:**
- Under each category, add product lines
- Example for LS:
  - CLARIFY
  - SIEVA
  - TORRENT
  - INVICTA

**3. Create Products:**
- Under each product line, add products
- Upload images from your PDF
- Fill in specifications

**4. Upload PDFs:**
- Go to "PDF Content Library"
- Upload spec sheets, brochures

---

## 🚀 Deploy to Vercel (5 minutes)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: FTC FlowDeck"
   git branch -M main
   git remote add origin https://github.com/your-username/ftc-flowdeck.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Visit: https://vercel.com
   - Sign up with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - **Environment Variables:** Add ALL from `.env.local`
   - Update these for production:
     ```
     NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
     NEXTAUTH_URL=https://your-app.vercel.app
     ```
   - Click "Deploy"

3. **Update Azure AD Redirect URI:**
   - Go back to Azure Portal
   - Your app → "Authentication"
   - Add redirect URI: `https://your-app.vercel.app/api/auth/callback/azure-ad`

✅ **Done!** Your app is live!

---

## 🆘 Troubleshooting

### "OAuth callback URL mismatch"
- Check `NEXTAUTH_URL` matches exactly
- Verify Azure AD redirect URI includes `/api/auth/callback/azure-ad`

### "Sanity images not loading"
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
- Check images are published in Sanity Studio

### "Email not sending"
- Check `RESEND_API_KEY` is valid
- Verify you're using `onboarding@resend.dev` for development

### "Database error"
- Verify you ran the SQL schema in Supabase
- Check all 3 Supabase keys are correct

---

## 📚 Next Steps

✅ Your app is running!
✅ Add content via Sanity Studio
✅ Test all features
✅ Deploy to Vercel
✅ Share with your team!

**Need help?** Check `README.md` and `CMS_GUIDE.md` for detailed guides.
