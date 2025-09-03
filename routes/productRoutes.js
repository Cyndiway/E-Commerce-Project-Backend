import express from "express";
import upload from "../middleware/fileUploadMiddleware.js";
import { isAdmin } from "../middleware/authMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  createProduct,
  getAllProducts,
  getAProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productControllers/Barrel.js";

const router = express.Router();

// ROUTES
router
  .get("/", getAllProducts)
  .get("/:id", getAProduct)

  .post("/", protect, isAdmin, upload.single("image"), createProduct)
  .put("/:id", protect, isAdmin, upload.single("image"), updateProduct)
  .delete("/:id", protect, isAdmin, deleteProduct);

export default router;
