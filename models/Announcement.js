import mongoose from "mongoose";

// No admin UI exists yet for this app (same as DiscountCode) — announcements
// are created directly in MongoDB. `active` lets one be pulled without
// deleting its history.
const AnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);
