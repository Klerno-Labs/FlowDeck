import { NextRequest, NextResponse } from 'next/server';
import { reminderStore } from '@/lib/db/reminders';
import { resend, FROM_EMAIL } from '@/lib/email/resend';
import { ReminderEmail } from '@/lib/email/templates/ReminderEmail';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pending reminders that are due
    const pendingReminders = await reminderStore.getPending();

    let sent = 0;
    let failed = 0;

    // Send each reminder
    for (const reminder of pendingReminders) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: reminder.recipient_email || reminder.user_email,
          subject: reminder.subject,
          react: ReminderEmail({
            message: reminder.message,
            senderEmail: reminder.user_email,
          }),
        });

        await reminderStore.updateStatus(reminder.id, 'sent', new Date());
        sent++;
      } catch (error) {
        console.error(`Failed to send reminder ${reminder.id}:`, error);
        await reminderStore.updateStatus(reminder.id, 'failed');
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: pendingReminders.length,
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
