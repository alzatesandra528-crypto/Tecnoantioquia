import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    cost: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    images: { type: [String], default: [] },
    subtitle: { type: String, default: "" },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
    published: { type: Boolean, default: true },
    variants: [
      {
        color: String,
        capacity: String,
        price: Number,
        stock: Number
      }
    ]
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
