/**
 * PostgreSQL email log storage using Neon database
 */

import { query, queryOne } from "./client";

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

export const emailStore = {
  async create(log: Omit<EmailLog, "id" | "created_at">): Promise<EmailLog> {
    const newLog = await queryOne<EmailLog>(
      `INSERT INTO email_logs (
        sender_email,
        recipient_email,
        product_id,
        pdf_content_ids,
        status,
        resend_email_id,
        error_message
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        log.sender_email,
        log.recipient_email,
        log.product_id || null,
        log.pdf_content_ids || null,
        log.status,
        log.resend_email_id || null,
        log.error_message || null,
      ]
    );

    if (!newLog) {
      throw new Error("Failed to create email log");
    }

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
    try {
      const logs = await query<EmailLog>(
        "SELECT * FROM email_logs ORDER BY created_at DESC"
      );
      return logs;
    } catch (error) {
      console.error("Error getting email logs:", error);
      return [];
    }
  },

  async getByRecipient(email: string): Promise<EmailLog[]> {
    try {
      const logs = await query<EmailLog>(
        "SELECT * FROM email_logs WHERE recipient_email = $1 ORDER BY created_at DESC",
        [email]
      );
      return logs;
    } catch (error) {
      console.error("Error getting email logs by recipient:", error);
      return [];
    }
  },
};
