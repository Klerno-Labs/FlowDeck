# 🔑 Get All Credentials - Step by Step

This guide will help you get ALL credentials needed. Each takes 2-5 minutes.

---

## 📋 Credentials Checklist

Copy this checklist and check off as you complete each:

```
[ ] NEXTAUTH_SECRET (generated)
[ ] CRON_SECRET (generated)
[ ] AZURE_AD_CLIENT_ID
[ ] AZURE_AD_CLIENT_SECRET
[ ] AZURE_AD_TENANT_ID
[ ] NEXT_PUBLIC_SANITY_PROJECT_ID
[ ] SANITY_API_TOKEN
[ ] NEXT_PUBLIC_SUPABASE_URL
[ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
[ ] SUPABASE_SERVICE_ROLE_KEY
[ ] RESEND_API_KEY
```

---

## 1️⃣ NEXTAUTH_SECRET (30 seconds)

**What it's for:** Encrypts your authentication tokens

**How to get it:**

### Option A: Online Generator (Easiest)
1. Visit: https://generate-secret.vercel.app/32
2. Copy the generated string
3. Paste in `.env.local` → `NEXTAUTH_SECRET`

### Option B: Command Line
**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}|%{[byte]$_}))
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

✅ **Done!** Paste the output in `.env.local`

---

## 2️⃣ CRON_SECRET (30 seconds)

**What it's for:** Protects your reminder cron job endpoint

**How to get it:**

### Option A: Online
1. Visit: https://www.random.org/strings/?num=1&len=64&digits=on&upperalpha=on&loweralpha=on
2. Copy the generated string
3. Paste in `.env.local` → `CRON_SECRET`

### Option B: Command Line
**Windows PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

**Mac/Linux:**
```bash
openssl rand -hex 32
```

✅ **Done!** Paste in `.env.local`

---

## 3️⃣ Microsoft Azure AD (5 minutes)

**What it's for:** "Sign in with Microsoft" button

### Step-by-Step:

1. **Open Azure Portal:**
   ```
   https://portal.azure.com
   ```
   Sign in with your Microsoft work/school account

2. **Navigate to App Registrations:**
   - Search bar → Type "Azure Active Directory"
   - Left menu → "App registrations"
   - Top → "New registration"

3. **Fill Form:**
   ```
   Name: FTC FlowDeck

   Supported account types:
   ⦿ Accounts in this organizational directory only

   Redirect URI:
   Platform: [Web ▼]
   URL: http://localhost:3000/api/auth/callback/azure-ad
   ```
   Click **"Register"**

4. **Copy First Two Values:**
   On the overview page you'll see:
   ```
   Application (client) ID: abc123...
   Directory (tenant) ID: xyz789...
   ```

   **Copy these:**
   - `Application (client) ID` → `.env.local` → `AZURE_AD_CLIENT_ID`
   - `Directory (tenant) ID` → `.env.local` → `AZURE_AD_TENANT_ID`

5. **Create Client Secret:**
   - Left menu → "Certificates & secrets"
   - Click "New client secret"
   - Description: `FTC FlowDeck`
   - Expires: `24 months`
   - Click "Add"

   **⚠️ IMPORTANT:** Copy the **VALUE** (not the ID!) right now:
   - Copy `Value` → `.env.local` → `AZURE_AD_CLIENT_SECRET`
   - This won't be shown again!

6. **Add Permissions:**
   - Left menu → "API permissions"
   - "Add a permission" → "Microsoft Graph" → "Delegated permissions"
   - Search and select these 4:
     - ✓ `User.Read`
     - ✓ `profile`
     - ✓ `email`
     - ✓ `openid`
   - Click "Add permissions"

✅ **Done!** You have all 3 Azure credentials.

---

## 4️⃣ Sanity.io (3 minutes)

**What it's for:** Content Management System (edit products, PDFs, etc.)

### Step-by-Step:

1. **Open Terminal in Your Project:**
   ```bash
   cd c:\Users\Somli\OneDrive\Desktop\Flowdeck\ftc-flowdeck
   ```

2. **Run Sanity Init:**
   ```bash
   npx sanity init --project-plan free
   ```

3. **Follow Prompts:**
   - **Login/create account?** → Choose Yes (opens browser)
   - **Login method** → Google or GitHub (easier)
   - **Create new project?** → Yes
   - **Project name** → `FTC FlowDeck`
   - **Use default dataset?** → Yes
   - **Output path** → Just press Enter

4. **Copy Project ID:**
   After init, you'll see:
   ```
   Success! Your project is now set up and configured.
   Project ID: abc123xyz (← THIS ONE!)
   ```

   **Copy the Project ID:**
   - `.env.local` → `NEXT_PUBLIC_SANITY_PROJECT_ID`

5. **Get API Token:**
   - Visit: https://www.sanity.io/manage
   - Click your project "FTC FlowDeck"
   - Click "API" tab
   - Click "Tokens" → "Add API token"
   - Name: `FTC FlowDeck Dev`
   - Permissions: `Editor`
   - Click "Add token"

   **Copy the token:**
   - `.env.local` → `SANITY_API_TOKEN`

✅ **Done!** You have both Sanity credentials.

---

## 5️⃣ Supabase (3 minutes)

**What it's for:** Database for email logs and reminders

### Step-by-Step:

1. **Open Supabase:**
   ```
   https://supabase.com
   ```
   Sign up with GitHub (recommended) or email

2. **Create Project:**
   - Click "New Project"
   - **Organization:** Create new or select existing
   - **Name:** `ftc-flowdeck`
   - **Database Password:** Create strong password (save it!)
   - **Region:** Choose closest to you
   - **Plan:** Free
   - Click "Create new project"
   - ⏳ Wait 2 minutes for setup...

3. **Get API Credentials:**
   Once ready:
   - Go to "Settings" (gear icon, bottom left)
   - Click "API"

   You'll see:
   ```
   Project URL: https://abc123.supabase.co
   anon public: eyJhb...
   service_role: eyJhb... (⚠️ secret!)
   ```

   **Copy these 3:**
   - `Project URL` → `.env.local` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `.env.local` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `.env.local` → `SUPABASE_SERVICE_ROLE_KEY`

4. **Create Database Tables:**
   - Left menu → "SQL Editor"
   - Click "+ New query"
   - Open file in VS Code: `src/lib/supabase/schema.sql`
   - Copy ALL contents
   - Paste into Supabase SQL editor
   - Click "Run" (bottom right)

   ✅ Should see: "Success. No rows returned"

5. **Verify Tables:**
   - Go to "Table Editor" (left menu)
   - You should see 3 tables:
     - ✓ email_logs
     - ✓ reminders
     - ✓ analytics_events

✅ **Done!** Database is ready.

---

## 6️⃣ Resend (2 minutes)

**What it's for:** Sending emails with PDF attachments

### Step-by-Step:

1. **Open Resend:**
   ```
   https://resend.com
   ```
   Click "Sign Up" → Sign up with GitHub or email

2. **Get API Key:**
   After signup:
   - Left sidebar → "API Keys"
   - Click "Create API Key"
   - Name: `FTC FlowDeck`
   - Permission: `Sending access`
   - Click "Create"

   **⚠️ Copy immediately:**
   - `.env.local` → `RESEND_API_KEY`

3. **Set From Email (Development):**
   For testing, use Resend's test email:
   ```
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```

4. **For Production (Later):**
   - Resend dashboard → "Domains" → "Add Domain"
   - Enter your domain
   - Update DNS records as shown
   - Once verified, use: `noreply@yourdomain.com`

✅ **Done!** Email is configured.

---

## ✅ Final Verification

**Check your `.env.local` file:**

Open: `c:\Users\Somli\OneDrive\Desktop\Flowdeck\ftc-flowdeck\.env.local`

**Every line should have a real value:**
```
✓ NEXTAUTH_SECRET=XYWFmZGI1Z...    (NOT "YOUR_...")
✓ AZURE_AD_CLIENT_ID=abc123...     (NOT "YOUR_...")
✓ SANITY_API_TOKEN=skABCD...       (NOT "YOUR_...")
... etc
```

**No "YOUR_XXX" should remain!**

---

## 🚀 Ready to Run!

Once all credentials are in `.env.local`:

```bash
cd c:\Users\Somli\OneDrive\Desktop\Flowdeck\ftc-flowdeck
npm run dev
```

Open: http://localhost:3000

🎉 **You should see the login page!**

---

## ⏱️ Time Breakdown

- Secrets generation: 1 minute
- Azure AD: 5 minutes
- Sanity: 3 minutes
- Supabase: 3 minutes
- Resend: 2 minutes

**Total: ~15 minutes**

---

## 🆘 Having Issues?

### "I'm stuck on Azure AD"
- Make sure you're using a work/school Microsoft account (not personal @outlook.com)
- Personal accounts won't have access to Azure Active Directory

### "Sanity init command not working"
- Try: `npm install -g @sanity/cli` first
- Then run: `sanity login` to authenticate

### "Supabase SQL failed"
- Make sure you copied the ENTIRE schema.sql file
- Check for any error messages in red
- Try running one table at a time if needed

### "Still need help?"
- Check `SETUP.md` for detailed screenshots
- See `README.md` for troubleshooting section
- Each service has great documentation and support

---

**You've got this! 💪 All credentials take ~15 minutes total.**
