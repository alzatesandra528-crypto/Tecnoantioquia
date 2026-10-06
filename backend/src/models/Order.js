import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        quantity: Number,
        unitPrice: Number
      }
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ["pendiente", "confirmado", "entregado"], default: "pendiente" },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
