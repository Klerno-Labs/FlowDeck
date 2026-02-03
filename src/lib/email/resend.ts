import { Resend } from 'resend';

// Use a placeholder during build time, actual validation happens at runtime
const apiKey = process.env.RESEND_API_KEY || 'placeholder-for-build';

export const resend = new Resend(apiKey);

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'FTC FlowDeck <noreply@ftc-flowdeck.com>';

// Runtime validation helper
export function validateResendConfig() {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'placeholder-for-build') {
    throw new Error(
      '❌ RESEND_API_KEY is not set. ' +
      'Please add it to your environment variables in Vercel: ' +
      'Settings → Environment Variables → Add: ' +
      'RESEND_API_KEY = re_c5YSSvM3_NWPwyqssWtpBs7yAb1jxdMDx'
    );
  }
}
