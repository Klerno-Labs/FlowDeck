/**
 * In-memory email log storage for development
 * For production, connect to a database through Vercel integrations
 */

export interface EmailLog {
  id: string;
  created_at: Date;
  sender_email: string;
  recipient_email: string;
  product_id?: string;
  pdf_content_ids?: string[];
  status: "sent" | "failed" | "bounced";
  resend_email_id?: string;
  error_message?: string;
}

// In-memory storage
const emailLogs: EmailLog[] = [];

export const emailStore = {
  async create(log: Omit<EmailLog, "id" | "created_at">): Promise<EmailLog> {
    const newLog: EmailLog = {
      id: `email-${Date.now()}`,
      created_at: new Date(),
      ...log,
    };
    emailLogs.push(newLog);

    // Log to console for visibility
    console.log("📧 Email logged:", {
      to: newLog.recipient_email,
      from: newLog.sender_email,
      status: newLog.status,
      product: newLog.product_id,
    });

    return newLog;
  },

  async getAll(): Promise<EmailLog[]> {
    return emailLogs;
  },

  async getByRecipient(email: string): Promise<EmailLog[]> {
    return emailLogs.filter((log) => log.recipient_email === email);
  },
};
