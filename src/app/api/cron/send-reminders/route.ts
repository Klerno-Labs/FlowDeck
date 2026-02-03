import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';
import { resend, FROM_EMAIL } from '@/lib/email/resend';
import { ReminderEmail } from '@/lib/email/templates/ReminderEmail';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServerClient();

    // Get pending reminders that are due
    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString());

    if (error) throw error;

    if (!reminders || reminders.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No reminders to send',
        processed: 0,
      });
    }

    const results = await Promise.all(
      reminders.map(async (reminder) => {
        try {
          const { data, error: sendError } = await resend.emails.send({
            from: FROM_EMAIL,
            to: reminder.recipient_email || reminder.user_email,
            subject: reminder.subject,
            react: ReminderEmail({
              subject: reminder.subject,
              message: reminder.message,
            }),
          });

          if (sendError) throw sendError;

          // Update status to sent
          await supabase
            .from('reminders')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
            })
            .eq('id', reminder.id);

          return { id: reminder.id, success: true };
        } catch (err: any) {
          console.error(`Failed to send reminder ${reminder.id}:`, err);

          // Mark as failed
          await supabase
            .from('reminders')
            .update({
              status: 'failed',
              error_message: err.message,
            })
            .eq('id', reminder.id);

          return { id: reminder.id, success: false, error: err.message };
        }
      })
    );

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      processed: results.length,
      sent: successCount,
      failed: results.length - successCount,
      results,
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
