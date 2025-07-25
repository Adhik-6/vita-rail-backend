import { User, Product, Orders } from "../models/index.models.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Orders.countDocuments();

    res.status(200).json({
      message: "Admin Dashboard Data",
      data: {
        users: userCount,
        products: productCount,
        orders: orderCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin dashboard data" });
  }
};
