import Cart from "../../models/cart.js";
import Order from "../../models/order.js";
import stripe from "../../utils/stripes.js";

export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate(
      "products.productId"
    );

    if (!cart || cart.products.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const totalAmount = cart.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // convert to cents
      currency: "usd",
      metadata: { userId: req.userId },
    });

    const order = await Order.create({
      user: req.userId,
      items: cart.products,
      totalAmount,
      paymentIntentId: paymentIntent.id,
    });

    // Clear cart
    cart.products = [];
    await cart.save();

    res.json({ clientSecret: paymentIntent.client_secret, order });
  } catch (error) {
    console.error("Place Order Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
