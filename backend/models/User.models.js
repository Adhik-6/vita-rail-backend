import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  aadhar: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ["user", "admin", "cloudKitchen", "deliveryPerson"],
    default: "user"
  }
})
// userId, aadhar

userSchema.pre('save', async function(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err)
  }
})

const User = mongoose.model("User", userSchema)

export default User
