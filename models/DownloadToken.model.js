import mongoose from "mongoose";

const DownloadTokenSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  variantType: {
  type: String,
  enum: ["ebook", "audio"],
  required: true
}
,
  expiresAt: {
    type: Date,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("DownloadToken", DownloadTokenSchema);
