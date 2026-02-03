import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { resend, FROM_EMAIL } from '@/lib/email/resend';
import { SendContentEmail } from '@/lib/email/templates/SendContentEmail';
import { emailStore } from '@/lib/db/emails';
import { sanityClient, getFileUrl } from '@/lib/sanity/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipientEmail, pdfContentIds, productId } = await request.json();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!pdfContentIds || pdfContentIds.length === 0) {
      return NextResponse.json({ error: 'No PDFs selected' }, { status: 400 });
    }

    // Fetch PDF metadata from Sanity
    const pdfQuery = `*[_id in $ids]{
      _id,
      title,
      "fileRef": file.asset._ref,
      "fileUrl": file.asset->url
    }`;
    const pdfs = await sanityClient.fetch(pdfQuery, { ids: pdfContentIds });

    // Fetch product title
    let productTitle = '';
    if (productId) {
      const product = await sanityClient.fetch(
        `*[_id == $id][0]{ title }`,
        { id: productId }
      );
      productTitle = product?.title || '';
    }

    // Download PDFs as buffers
    const attachments = await Promise.all(
      pdfs.map(async (pdf: any) => {
        try {
          const pdfUrl = pdf.fileUrl || getFileUrl(pdf.fileRef);
          const response = await fetch(pdfUrl);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          return {
            filename: `${pdf.title}.pdf`,
            content: buffer,
          };
        } catch (error) {
          console.error(`Failed to fetch PDF ${pdf.title}:`, error);
          return null;
        }
      })
    );

    const validAttachments = attachments.filter((a) => a !== null);

    if (validAttachments.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch PDF files' }, { status: 500 });
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: productTitle
        ? `FTC Product Information - ${productTitle}`
        : 'FTC Product Information',
      react: SendContentEmail({
        recipientEmail,
        senderName: session.user.name || session.user.email || 'FTC Representative',
        productTitle,
      }),
      attachments: validAttachments,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Log to in-memory store
    await emailStore.create({
      sender_email: session.user.email!,
      recipient_email: recipientEmail,
      product_id: productId,
      pdf_content_ids: pdfContentIds,
      status: 'sent',
      resend_email_id: data?.id,
    });

    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (error: any) {
    console.error('Email send error:', error);

    // Log error to in-memory store
    try {
      const session = await auth();
      await emailStore.create({
        sender_email: session?.user?.email || 'unknown',
        recipient_email: 'unknown',
        status: 'failed',
        error_message: error.message,
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
