import Order from "../../models/order.js";

export const getMyOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate(
      "items.product"
    );
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate("items.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product");
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
