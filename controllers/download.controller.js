import DownloadToken from "../models/DownloadToken.model.js";
import Product from "../models/Product.model.js";
import axios from "axios";

export const downloadProduct = async (req, res) => {
  try {
    const { token } = req.params;

    // 1️⃣ Validate token
    const download = await DownloadToken.findOne({ token });
    console.log("down",download)
    if (!download) {
      return res.status(404).json({ message: "Invalid download link" });
    }

    // 2️⃣ Check expiry
    if (download.expiresAt < new Date()) {
      return res.status(410).json({ message: "Download link expired" });
    }

    // 3️⃣ Fetch product
    const product = await Product.findById(download.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("product lll",product)

    // 4️⃣ Find correct variant
    const variant = product.variants.find(
      v => v.type === download.variantType
    );
console.log("variant ll ",variant)
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    // 5️⃣ Resolve ZIP file URL
    let fileUrl;
    let filename;

    if (variant.type === "ebook") {
      fileUrl = variant.ebook?.fileKey;   // ebook.zip
      filename = `${product.slug}-ebook.zip`;
    }

    if (variant.type === "audio") {
      fileUrl = variant.audio?.fileKey;   // audio.zip
      filename = `${product.slug}-audio.zip`;
    }

    if (!fileUrl) {
      return res.status(404).json({ message: "File not available" });
    }

    // 6️⃣ (Optional) One-time use
    download.used = true;
    await download.save();

    // 7️⃣ Stream ZIP from hosting
    const response = await axios.get(fileUrl, {
      responseType: "stream"
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.setHeader(
      "Content-Type",
      response.headers["content-type"] || "application/zip"
    );

    response.data.pipe(res);

  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ message: "Download failed" });
  }
};
