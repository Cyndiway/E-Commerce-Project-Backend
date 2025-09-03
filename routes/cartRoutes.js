import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addToCart,
  removeFromCart,
  deleteAllCartItems,
  updateCartItem,
  getCartItems,
} from "../controllers/cartControllers/barrel.js";
const router = express.Router();

router
  // View cart item
  .get("/", protect, getCartItems)

  // Add to cart
  .post("/add", protect, addToCart)

  // Update cart item
  .put("/update", protect, updateCartItem)

  // Delete cart items
  .delete("/remove", protect, removeFromCart)
  .delete("/clear", protect, deleteAllCartItems);

export default router;
