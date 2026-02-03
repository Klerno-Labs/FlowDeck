import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { reminderStore } from '@/lib/db/reminders';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipientEmail, subject, message, scheduledAt, productId } =
      await request.json();

    // Validate inputs
    if (!recipientEmail || !subject || !scheduledAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    // Create reminder in in-memory store
    const reminder = await reminderStore.create({
      user_email: session.user.email!,
      recipient_email: recipientEmail,
      subject,
      message,
      scheduled_at: scheduledDate,
      product_id: productId,
    });

    return NextResponse.json({ success: true, reminder });
  } catch (error: any) {
    console.error('Reminder creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
