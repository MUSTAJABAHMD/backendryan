import express from "express";
import { downloadProduct } from "../controllers/download.controller.js";

const router = express.Router();

router.get("/:token", downloadProduct);

export default router;
