import Cart from "../../models/cart.js";

export const getCartItems = async (req, res) => {
  const user = req.user;
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate(
      "products.productId"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
