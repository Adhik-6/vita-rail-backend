import {Order} from "../models/index.models.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId').populate('productId');

    res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};