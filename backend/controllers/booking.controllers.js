import dotenv from "dotenv";
import Razorpay from "razorpay";
import axios from "axios";
import { URLSearchParams } from "url";
import { sendMail } from "../utils/index.utils.js";
import { Order } from "../models/index.models.js";
dotenv.config();

const sendOrderConfirmation = async ({ number, email }) => {
  const smsMessage = 'Your order booking has been confirmed!';

  try {
    // const smsPromise = sendFast2SMSQuickSMS([number], smsMessage);
    const emailPromise = sendMail({
      email,
      subject: "Order Confirmation",
      html: `<p>Hooray!! Your order has been confirmed! 🎉</p>`
    });

    // const [emailRes, smsRes] = await Promise.all([emailPromise, smsPromise]);
    const [emailRes, smsRes] = await Promise.all([emailPromise]);

    let message = "Order confirmation sent via";
    if (emailRes.success) message += ` email`;
    else throw new Error(`${emailRes.message}`);
    if (smsRes) message += ` & SMS`;
    else throw new Error(`Failed to send SMS`);

    return { success: true, message };
  } catch (error) {
    console.error('An error occurred during order confirmation:', error.message);
    return { success: false, message: error.message };
  }
};

async function sendFast2SMSQuickSMS(numbers, message) {
  const url = 'https://www.fast2sms.com/dev/bulkV2';

  try {
    console.log('Sending Quick SMS...');

    const payload = new URLSearchParams();
    payload.append('message', message);
    payload.append('route', 'q');
    payload.append('numbers', numbers.join(','));

    const response = await axios.post(url, payload.toString(), {
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.return === true;
  } catch (error) {
    console.error('Error sending Quick SMS:', error.response?.data || error.message);
    return false;
  }
}

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const processOrder = async (req, res) => {
  const { currency = "INR", items } = req.body;

  let amount = 0;
  items.forEach(item => {
    amount += item.price * item.quantity;
  });

  try {
    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        items: JSON.stringify(items || []), // Store items in notes for reference
      },
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpayInstance.orders.create(options);
    // console.log("Razorpay order created:");
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

const bookOrder = async (req, res, next) => {
  try {
    // console.log("Booking order:", req.body);
    const { zone, station, trainDetails, items } = req.body;
    const { _id: userId, email, phone} = req.user;

    const order = await Order.create({
      userId,
      zone,
      station,
      trainDetails,
      items
    });

    if (email && phone) {
      const notifyRes = await sendOrderConfirmation({ email, number: phone });

      if (!notifyRes.success) {
        console.warn("Order booked but notification failed:", notifyRes.message);
      }
    }

    res.status(201).json({
      message: "Order booked successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error booking order:", error);
    next(error);
  }
};



export { processOrder, bookOrder };


// const loadRazorpay = async () => {
//   const orderRes = await axios.post("/api/payment/book", {
//     amount: 500, // INR ₹5.00
//   });

//   const options = {
//     key: "RAZORPAY_KEY_ID", // replace with your key
//     amount: orderRes.data.amount,
//     currency: "INR",
//     name: "My Shop",
//     description: "Test Transaction",
//     order_id: orderRes.data.id,
//     handler: async function (response) {
//       // Optionally verify payment on backend
//       await axios.post("/api/payment/send-sms", response);
//       alert("Payment successful!");
//     },
//     prefill: {
//       name: "A.M",
//       email: "am@example.com",
//     },
//   };

//   const rzp = new window.Razorpay(options);
//   rzp.open();
// };
