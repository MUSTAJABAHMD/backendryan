import Product from "../models/Product.model.js";
import slugify from "slugify";

// 🎧 Get all active audio products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });

    const audioProducts = [];

    products.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.type === "audio") {
          audioProducts.push({
            _id: p._id,
            title: p.title,
            slug: p.slug,
            image: p.coverImage,
            audioImage:p.audioImage,
            variantType: v.type,
            newPrice: `$${v.price.toFixed(2)}`,
            compareAtPrice: v.compareAtPrice || null,
            sale: p.isOnSale,
            narrator: v.audio?.narrator || null,
            duration: v.audio?.duration || null,
            audioPreview: v.audio?.previewKey || null,
            audioZip: v.audio?.fileKey || null
          });
        }
      });
    });


    res.json(audioProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📘 Get product by slug (hide fileKey / zipKey for security)
export const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true
  }).select("-variants.audio.zipKey -variants.ebook.zipKey");

  if (!product) return res.status(404).json({ message: "Not found" });

  res.json(product);
};


export const createProduct = async (req, res) => {
  try {
    const {
      title,
      coverImage,
      audioImage,
      description,
      longDescription,
      series,
      metadata,
      variants,
      isOnSale,
      isActive
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ message: "At least one variant is required" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    if (!variants || variants.length === 0) {
  throw new Error("At least one variant is required");
}

// check: ebook ya audio present hai ya nahi
const hasEbook = variants.some(v => v.type === "ebook");
const hasAudio = variants.some(v => v.type === "audio");

if (!hasEbook && !hasAudio) {
  throw new Error("Product must have at least one Ebook or Audio variant");
}

variants.forEach((v) => {
  // if (!v.type || !v.price) {
  //   throw new Error("Each variant must have type and price");
  // }

  if (v.type === "audio" && !v.audio?.fileKey) {
    v.audio.fileKey="null"
  }

  if (v.type === "ebook" && !v.ebook?.fileKey) {
    v.ebook.fileKey = "null"
  }

 
});


    const product = await Product.create({
      title,
      slug,
      coverImage,
      audioImage,
      description,
      longDescription,
      series,
      metadata,
      variants,
      isOnSale,
      isActive: isActive ?? true
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err.message);
    res.status(500).json({ message: err.message });
  }
};


export const getAllProductsActive = async (req, res) => {
  try {
    const pro = await Product.find({ isActive: true })


    res.status(200).json({
      success: true,
      data: pro
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


export const deleteProduct = async (req, res) => {
  const { id } = req.params

  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: id })

    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found" })
    }

    res.status(200).send(deletedProduct)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      coverImage,
      audioImage,
      description,
      longDescription,
      series,
      metadata,
      variants,
      isOnSale,
      isActive
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ message: "At least one variant is required" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    variants.forEach((v) => {
      if (!v.type || !v.price) {
        throw new Error("Each variant must have type and price");
      }

      if (v.type === "audio" && !v.audio?.fileKey) {
        v.audio.fileKey ="null"
      }

      if (v.type === "ebook" && !v.ebook?.fileKey) {
        v.ebook.fileKey = "null"
      }

      if (v.type === "print" && !v.print?.interiorPdfKey) {
        throw new Error("Print variant requires interiorPdfKey");
      }
    });

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        coverImage,
        audioImage,
        description,
        longDescription,
        series,
        metadata,
        variants,
        isOnSale,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
