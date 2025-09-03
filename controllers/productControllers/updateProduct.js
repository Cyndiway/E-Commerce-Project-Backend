import fs from "fs";
import path from "path";
import Product from "../../models/product.js";

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, stock } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If image is uploaded, check for duplicates
    if (req.file) {
      const uploadDir = path.resolve("uploads");
      const uploadPath = path.join(uploadDir, req.file.originalname);

      if (fs.existsSync(uploadPath)) {
        // Remove the newly uploaded duplicate file
        fs.unlinkSync(req.file.path);
        // Skip updating image field if duplicate exists
      } else {
        // Delete old image file if it exists
        if (product.image && fs.existsSync(path.resolve("." + product.image))) {
          fs.unlinkSync(path.resolve("." + product.image));
        }
        // Move uploaded file to original name
        fs.renameSync(req.file.path, uploadPath);
        product.image = `/uploads/${req.file.originalname}`;
      }
    }

    // Update other product fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;

    const updatedProduct = await product.save();
    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
