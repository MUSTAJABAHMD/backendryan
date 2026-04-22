import express from "express";
import { getAllProducts, getProductBySlug , createProduct, getAllProductsActive,deleteProduct,getProductById,updateProduct, comment,getAllComment } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/slug/:slug", getProductBySlug);
router.post ("/add", createProduct)
router.get("/all",getAllProductsActive)
router.delete("/:id",deleteProduct)
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.post("/comment/:id",comment)
router.get("/comment/all",getAllComment)


export default router;
