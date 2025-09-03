import fs from "fs";
import path from "path";
import Product from "../../models/product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Product details are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    // Check for duplicate image in uploads folder
    const uploadDir = path.resolve("uploads");
    const uploadPath = path.join(uploadDir, req.file.originalname);
    // if image already exists.
    if (fs.existsSync(uploadPath)) {
      //replace the original image to avoid duplicates
      fs.unlinkSync(uploadPath);
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      image: `/uploads/${req.file.originalname}`,
    });

    const createdProduct = await product.save();
    res.status(201).json({
      message: "Product successfully created",
      product: createdProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
