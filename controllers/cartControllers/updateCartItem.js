import Cart from "../../models/cart.js";

export const updateCartItem = async (req, res) => {
  const { productId, type } = req.body;
  if (!productId || !type) {
    res.status(400).json({ message: "Please provide all fields" });
    return;
  }
  const userid = req.userId;
  try {
    //check for users cart
    const cart = await Cart.findOne({ userId: userid });
    if (!cart) {
      res.status(400).json({ message: "Cart not found" });
      return;
    }
    //check for the specific item in the products array
    const existingCartItem = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (type === "increase") {
      existingCartItem.quantity += 1;
    } else if (type === "decrease" && existingCartItem.quantity > 1) {
      existingCartItem.quantity -= 1;
    } else {
      res
        .status(400)
        .json({ message: "type can be either increase or decrease" });
      return;
    }
    //update totalItemPrice of each member of the cart array
    cart.products.forEach((item) => {
      item.totalItemPrice = item.price * item.quantity;
    });
    //update the totalCartPrice of the cart
    cart.totalCartPrice = cart.products.reduce(
      (sum, item) => sum + item.totalItemPrice,
      0
    );
    //save the cart and return response
    await cart.save();
    await cart.populate("products.productId");
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
