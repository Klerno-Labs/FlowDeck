/**
 * Test script to check password reset functionality
 * Run with: node test-password-reset.js
 */

require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testPasswordReset() {
  console.log('=== Testing Password Reset Configuration ===\n');

  // 1. Check environment variables
  console.log('1. Checking environment variables...');
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const nextAuthUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;

  console.log('   RESEND_API_KEY:', resendKey ? '✓ Set' : '✗ Missing');
  console.log('   RESEND_FROM_EMAIL:', fromEmail || 'FTC FlowDeck <onboarding@resend.dev>');
  console.log('   NEXTAUTH_URL:', nextAuthUrl || 'http://localhost:3000');
  console.log('');

  if (!resendKey || resendKey === 'placeholder-for-build') {
    console.error('❌ RESEND_API_KEY is not configured!');
    console.error('   Please set it in .env.local');
    return;
  }

  // 2. Test Resend API
  console.log('2. Testing Resend API...');
  try {
    const resend = new Resend(resendKey);
    const testEmail = 'c.hatfield309@gmail.com';

    console.log(`   Sending test email to ${testEmail}...`);

    const result = await resend.emails.send({
      from: fromEmail || 'FTC FlowDeck <onboarding@resend.dev>',
      to: testEmail,
      subject: 'Test: Password Reset Email',
      html: `
        <h1>Password Reset Test</h1>
        <p>This is a test email to verify the password reset functionality.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${nextAuthUrl}/reset-password?token=test-token-123">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    console.log('   ✓ Email sent successfully!');
    console.log('   Email ID:', result.data?.id);
    console.log('');
    console.log('   Please check your inbox at c.hatfield309@gmail.com');
    console.log('   (Also check spam/junk folder)');
  } catch (error) {
    console.error('   ✗ Failed to send email:');
    console.error('   Error:', error.message);
    if (error.response) {
      console.error('   Response:', JSON.stringify(error.response, null, 2));
    }
  }

  console.log('\n=== Test Complete ===');
}

testPasswordReset().catch(console.error);
