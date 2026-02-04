/**
 * Detailed Resend API test
 * Run with: node test-resend-detailed.js
 */

require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testResendDetailed() {
  console.log('=== Detailed Resend API Test ===\n');

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'FTC FlowDeck <onboarding@resend.dev>';
  const toEmail = 'c.hatfield309@gmail.com';

  console.log('Configuration:');
  console.log('  API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');
  console.log('  From Email:', fromEmail);
  console.log('  To Email:', toEmail);
  console.log('');

  if (!apiKey) {
    console.error('❌ RESEND_API_KEY not set in .env.local');
    return;
  }

  try {
    const resend = new Resend(apiKey);

    console.log('Sending email...');
    const response = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'FTC FlowDeck - Password Reset Test',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Password Reset</title>
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">🔑 Reset Your Password</h1>
            <p>You requested to reset your password for FTC FlowDeck.</p>
            <p>Click the button below to reset your password:</p>
            <a href="http://localhost:3000/reset-password?token=test-123"
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Reset Password
            </a>
            <p>This link will expire in 1 hour.</p>
            <hr style="border: 1px solid #e6ebf1; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </body>
        </html>
      `,
    });

    console.log('\n✅ Email API Response:');
    console.log(JSON.stringify(response, null, 2));

    if (response.data) {
      console.log('\n✅ Success! Email sent with ID:', response.data.id);
      console.log('\nNext steps:');
      console.log('1. Check your email inbox at c.hatfield309@gmail.com');
      console.log('2. Check spam/junk folder');
      console.log('3. Check Gmail promotions tab');
      console.log('4. Wait a few minutes - sometimes emails are delayed');
    } else if (response.error) {
      console.error('\n❌ Email sending failed:');
      console.error('Error:', response.error);
    }

  } catch (error) {
    console.error('\n❌ Exception occurred:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);

    if (error.response) {
      console.error('\nAPI Response:', JSON.stringify(error.response, null, 2));
    }

    if (error.statusCode) {
      console.error('\nStatus Code:', error.statusCode);
    }
  }

  console.log('\n=== Test Complete ===');
}

testResendDetailed().catch(console.error);
