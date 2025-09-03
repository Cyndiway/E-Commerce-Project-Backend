import Cart from "../../models/cart.js";

export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }
    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );

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

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAllCartItems = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }
    cart.products = [];
    cart.totalCartPrice = 0;
    await cart.save();
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
