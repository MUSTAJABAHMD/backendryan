import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  type: {
  type: String,
  enum: ["audio", "ebook", "print"],
  required: true
},


  price: {
    type: Number,
    required: true
  },

  compareAtPrice: Number,
  currency: {
    type: String,
    default: "USD"
  },

  audio: {
    narrator: String,
    duration: String,        // seconds
    previewKey: String,      // preview mp3
     fileKey: String
  },

  ebook: {
    format: String,       // e.g. PDF
    fileKey: String       // downloadable ZIP
  },

  print: {
  interiorPdfKey: String, // PRIVATE (PDF for Lulu)
  coverPdfKey: String,    // PRIVATE
  trimSize: String,       // e.g. "6x9"
  pageCount: Number
}

}, { _id: false });

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },

  coverImage: String,
  audioImage: String,

  description: String,
  longDescription: String,

  series: {
    name: String,
    order: Number
  },


  metadata: {
    ASIN: String,
    publisher: String,
    publishDate: Date,
    printLength: String,
    fileSize: String,
    accessibility: {
      textToSpeech: Boolean,
      screenReader: Boolean,
      enhancedTypesetting: Boolean
    }
  },

  variants: [VariantSchema],

  isOnSale: Boolean,
  isActive: { type: Boolean, default: true }

}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
