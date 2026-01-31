import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../../models/Product.model.js";

dotenv.config();

const products = [
  {
    title: "The Power of Focus",
    slug: "the-power-of-focus",
    description:
      "A practical guide to improving concentration, productivity, and mental clarity.",
    coverImage: "/images/power-of-focus.jpg",
    isOnSale: true,
    variants: [
  {
    type: "ebook",
    price: 9.99,
    ebook: {
      format: "PDF",
      fileKey: "/ebooks/the-power-of-focus.zip"
    }
  },
  {
    type: "audio",
    price: 4.99,
    compareAtPrice: 9.99,
    audio: {
      narrator: "James Carter",
      duration: "5h 32m",
      previewKey: "/audio/previews/focus-preview.mp3",
      fileKey: "/audio/files/focus.zip"
    }
  }
]

  },
  {
    title: "Mindset Mastery",
    slug: "mindset-mastery",
    description:
      "Develop a growth mindset and unlock your full potential.",
    coverImage: "/images/mindset-mastery.jpg",
    isOnSale: false,
    variants: [
  {
    type: "ebook",
    price: 9.99,
    ebook: {
      format: "PDF",
      fileKey: "/ebooks/the-power-of-focus.zip"
    }
  },
  {
    type: "audio",
    price: 4.99,
    compareAtPrice: 9.99,
    audio: {
      narrator: "James Carter",
      duration: "5h 32m",
      previewKey: "/audio/previews/focus-preview.mp3",
      fileKey: "/audio/files/focus.zip"
    }
  }
]

  },
  {
    title: "Atomic Habits Simplified",
    slug: "atomic-habits-simplified",
    description:
      "Small habits that lead to remarkable results.",
    coverImage: "/images/atomic-habits.jpg",
    isOnSale: true,
    variants: [
  {
    type: "ebook",
    price: 9.99,
    ebook: {
      format: "PDF",
      fileKey: "/ebooks/the-power-of-focus.zip"
    }
  },
  {
    type: "audio",
    price: 4.99,
    compareAtPrice: 9.99,
    audio: {
      narrator: "James Carter",
      duration: "5h 32m",
      previewKey: "/audio/previews/focus-preview.mp3",
      fileKey: "/audio/files/focus.zip"
    }
  }
]

  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("✅ Products imported successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
};

importData();
