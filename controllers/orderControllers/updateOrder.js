import Order from "../../models/order.js";
import stripe from "../../utils/stripes.js";

//update order status (admin)
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reorder an existing order
export const reOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const originalOrder = await Order.findById(id);
    if (!originalOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // create a new order with the same data (but new ID and status)
    const newOrder = await Order.create({
      user: req.userId,
      items: originalOrder.items,
      totalAmount: originalOrder.totalAmount,
      paymentIntentId: originalOrder.paymentIntentId,
    });

    // initiate payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(newOrder.totalAmount * 100), // convert to cents
      currency: "usd",
      metadata: { userId: String(req.userId), orderId: String(newOrder._id) },
    });

    newOrder.paymentIntentId = paymentIntent.id;
    await newOrder.save();
    res.json({ clientSecret: paymentIntent.client_secret, order: newOrder });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
