import cron from "node-cron";
import Policy from "../models/Policy.model.js";

// Runs every day at 12:00 AM
cron.schedule("0 0 * * *", async () => {
  console.log("🔄 Policy renewal cron started");

  const today = new Date();

  try {
    // 1️⃣ Mark expired policies
    const expiredResult = await Policy.updateMany(
      {
        endDate: { $lt: today },
        status: "ACTIVE"
      },
      { status: "EXPIRED" }
    );

    // 2️⃣ Find policies expiring in next 7 days
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 7);

    const expiringSoonPolicies = await Policy.find({
      endDate: { $lte: reminderDate, $gte: today },
      status: "ACTIVE",
      renewalReminderSent: false
    }).populate("customer", "name email");

    for (const policy of expiringSoonPolicies) {
      console.log(
        `📧 Reminder: Policy ${policy.policyNumber} for ${policy.customer.name}`
      );

      // Here you will later send email / WhatsApp / SMS

      policy.renewalReminderSent = true;
      await policy.save();
    }

    console.log(
      `✅ Cron completed | Expired: ${expiredResult.modifiedCount}, Reminders: ${expiringSoonPolicies.length}`
    );
  } catch (error) {
    console.error("❌ Policy renewal cron failed:", error.message);
  }
});
