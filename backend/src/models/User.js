import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "vendedor", "cliente"], required: true },
    name: { type: String, default: "" }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
