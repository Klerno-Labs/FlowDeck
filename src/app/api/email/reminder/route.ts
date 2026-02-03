import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createServerClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scheduledAt, recipientEmail, subject, message, productId } = await request.json();

    if (!scheduledAt) {
      return NextResponse.json({ error: 'Scheduled time is required' }, { status: 400 });
    }

    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate < new Date()) {
      return NextResponse.json({ error: 'Scheduled time must be in the future' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('reminders')
      .insert({
        user_email: session.user.email,
        scheduled_at: scheduledDate.toISOString(),
        recipient_email: recipientEmail || session.user.email,
        subject: subject || 'FTC Product Follow-up',
        message: message || '',
        product_id: productId,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, reminder: data });
  } catch (error: any) {
    console.error('Reminder creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
