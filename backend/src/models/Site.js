import mongoose from "mongoose";

const siteSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "landing" },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const Site = mongoose.model("Site", siteSchema);
