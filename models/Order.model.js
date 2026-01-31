import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null // allow guest checkout
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },

        variantType: {
          type: String,
          enum: ["audio", "ebook", "print"],
          required: true
        },

        price: {
          type: Number,
          required: true
        },

        quantity: {
          type: Number,
          default: 1
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentIntentId: {
      type: String
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },
    isUnlocked: {
      type: Boolean,
      default: false
    },
     downloadTokens: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        
        token: String,
        expiresAt: Date,
        used: { type: Boolean, default: false }
      }
    ],

    fulfillmentStatus: {
      type: String,
      enum: ["none", "processing", "fulfilled", "shipped"],
      default: "none"
    },

    shippingAddress: {
      name: String,
      address1: String,
      city: String,
      country: String,
      postalCode: String,
      email:String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
