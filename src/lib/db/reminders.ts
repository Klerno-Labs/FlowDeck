/**
 * PostgreSQL reminder storage using Neon database
 */

import { query, queryOne } from "./client";

export interface Reminder {
  id: string;
  created_at: Date;
  scheduled_at: Date;
  user_email: string;
  recipient_email?: string;
  subject: string;
  message?: string;
  product_id?: string;
  status: "pending" | "sent" | "cancelled" | "failed";
  sent_at?: Date;
}

export const reminderStore = {
  async create(
    data: Omit<Reminder, "id" | "created_at" | "status">
  ): Promise<Reminder> {
    const reminder = await queryOne<Reminder>(
      `INSERT INTO reminders (
        scheduled_at,
        user_email,
        recipient_email,
        subject,
        message,
        product_id,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *`,
      [
        data.scheduled_at,
        data.user_email,
        data.recipient_email || null,
        data.subject,
        data.message || null,
        data.product_id || null,
      ]
    );

    if (!reminder) {
      throw new Error("Failed to create reminder");
    }

    console.log("⏰ Reminder created:", {
      scheduled: reminder.scheduled_at,
      to: reminder.recipient_email,
      subject: reminder.subject,
    });

    return reminder;
  },

  async getPending(): Promise<Reminder[]> {
    try {
      const reminders = await query<Reminder>(
        `SELECT * FROM reminders
         WHERE status = 'pending'
         AND scheduled_at <= NOW()
         ORDER BY scheduled_at ASC`
      );
      return reminders;
    } catch (error) {
      console.error("Error getting pending reminders:", error);
      return [];
    }
  },

  async updateStatus(
    id: string,
    status: Reminder["status"],
    sent_at?: Date
  ): Promise<void> {
    try {
      await query(
        `UPDATE reminders
         SET status = $1, sent_at = $2
         WHERE id = $3`,
        [status, sent_at || null, id]
      );

      console.log("⏰ Reminder updated:", {
        id,
        status,
        sent_at,
      });
    } catch (error) {
      console.error("Error updating reminder status:", error);
    }
  },

  async getAll(): Promise<Reminder[]> {
    try {
      const reminders = await query<Reminder>(
        "SELECT * FROM reminders ORDER BY created_at DESC"
      );
      return reminders;
    } catch (error) {
      console.error("Error getting all reminders:", error);
      return [];
    }
  },
};
