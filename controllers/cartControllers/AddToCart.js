import Cart from "../../models/cart.js";
import Product from "../../models/product.js";

export const addToCart = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized: user not found" });
  }
  const { productId, quantity } = req.body;
  const userId = req.userId;

  try {
    // Check for product in the collection
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Check if user has an existing cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({
        userId,
        products: [{ productId, quantity, price: product.price }],
      });
    } else {
      // Check for existing cart item
      const existingCartItem = cart.products.find(
        (item) => item.productId.toString() === productId
      );
      if (existingCartItem) {
        // Add to the quantity
        existingCartItem.quantity += quantity;
      } else {
        cart.products.push({
          productId,
          quantity,
          price: product.price,
        });
      }
    }
    // Update total item price for each cart item
    cart.products.forEach((item) => {
      item.quantity = Number(item.quantity) || 0;
      item.price = Number(item.price) || 0;
      item.totalItemPrice = item.quantity * item.price;
    });

    // Update total cart price
    cart.totalCartPrice = cart.products.reduce(
      (sum, item) => sum + (Number(item.totalItemPrice) || 0),
      0
    );

    // Save cart
    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
