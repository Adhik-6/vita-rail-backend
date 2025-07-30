import { User } from "./../models/index.models.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendMail } from "../utils/index.utils.js";
dotenv.config();

const login = async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findOne({ userId }).select("+password");
  if (!user) return res.status(400).json({ message: "User not found" });

  if (!await user.comparePassword(password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.json({
    message: "Login successful",
    token,
    user: { 
      id: user._id, 
      name: user.name,
      dob: user.dob,
      phone: user.phone,
      email: user.email, 
      userId: user.userId,
    },
  });
};

const logout = (req, res) => {
  // In a stateless JWT authentication system, logout is typically handled on the client side
  // by removing the token from local storage or cookies.
  res.json({ message: "Logout successful" });
};

const signup = async (req, res) => {
  const { name, dob, phone, email, userId, password } = req.body;
  const existing = await User.findOne({ userId: userId });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({name,dob,phone,email,userId ,password });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.status(201).json({ 
    message: "Signup successful", 
    token, 
    user: { 
      id: user._id, 
      name: user.name,
      dob: user.dob,
      phone: user.phone,
      email: user.email,
      userId: user.userId,
    }
  });
};

const forgotPassword = async (req, res) => {
  const frontendUrl = process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : process.env.FRONTEND_URL_DEV;
  const { userId } = req.body;
  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const mailRes = await sendMail({
      email: user.email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p> <br> If the above link does not work, copy and paste the following URL into your browser: <br> ${resetLink}`,
    });
    // console.log("Email res:", mailRes);

    if (mailRes.success) {
      return res.json({ message: "Password reset link sent to your email" });
    } else {
      throw new Error(mailRes.message);
    }
  } catch (err) {
    console.error("Error sending password reset link:", err);
    return res.status(500).json({ message: "Error sending password reset link" });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("running");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
    await user.save();
    // console.log("Password reset successful for user:", user.email);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
}



export { login, logout, forgotPassword, signup, resetPassword };


