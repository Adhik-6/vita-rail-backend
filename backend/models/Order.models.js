import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    ref: "User", // reference to User model
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  items: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"],
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
      },
    }
  ],
  zone: {
    type: String,
    required: true,
    trim: true,
  },
  station: {
    type: String,
    required: true,
    trim: true,
  },
  trainDetails: {
    trainName: {
      type: String,
      required: true,
      trim: true,
    },
    pnr: {
      type: String,
      required: true,
      trim: true,
    },
    seatNumber: {
      type: String,
      required: true,
      trim: true,
    },
    coach: {
      type: String,
      required: true,
      trim: true,
    },
    trainNumber: {
      type: Number,
      required: true,
    }
  }
}, {
  timestamps: true
})

const Order = mongoose.model("Order", orderSchema);

export default Order;