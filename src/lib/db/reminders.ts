/**
 * In-memory reminder storage for development
 * For production, connect to a database through Vercel integrations
 */

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

// In-memory storage
const reminders: Reminder[] = [];

export const reminderStore = {
  async create(
    data: Omit<Reminder, "id" | "created_at" | "status">
  ): Promise<Reminder> {
    const reminder: Reminder = {
      id: `reminder-${Date.now()}`,
      created_at: new Date(),
      status: "pending",
      ...data,
    };
    reminders.push(reminder);

    console.log("⏰ Reminder created:", {
      scheduled: reminder.scheduled_at,
      to: reminder.recipient_email,
      subject: reminder.subject,
    });

    return reminder;
  },

  async getPending(): Promise<Reminder[]> {
    const now = new Date();
    return reminders.filter(
      (r) => r.status === "pending" && r.scheduled_at <= now
    );
  },

  async updateStatus(
    id: string,
    status: Reminder["status"],
    sent_at?: Date
  ): Promise<void> {
    const reminder = reminders.find((r) => r.id === id);
    if (reminder) {
      reminder.status = status;
      if (sent_at) reminder.sent_at = sent_at;

      console.log("⏰ Reminder updated:", {
        id,
        status,
        sent_at,
      });
    }
  },

  async getAll(): Promise<Reminder[]> {
    return reminders;
  },
};
