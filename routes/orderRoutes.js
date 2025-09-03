import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/authMiddleware.js";

import {
  placeOrder,
  getMyOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  reOrder,
  deleteOrder,
} from "../controllers/orderControllers/barrel.js";

const router = express.Router();

router
  .post("/", protect, placeOrder)

  //get
  .get("/mine", protect, getMyOrder)
  .get("/", protect, isAdmin, getAllOrders)
  .get("/:id", protect, getOrderById)

  //update
  .put("/:id/status", protect, isAdmin, updateOrderStatus)
  .put("/:id", protect, reOrder)

  //delete
  .delete("/:id", protect, isAdmin, deleteOrder);

export default router;
