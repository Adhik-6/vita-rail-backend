import dotenv from "dotenv";
import Razorpay from "razorpay";
import axios from "axios";
import { URLSearchParams } from "url";
import { sendMail } from "../utils/index.utils.js";
dotenv.config();

const sendSms = async (req, res) => {

  const { number, email } = req.body
  console.log("Sending SMS to:", number);
  const smsMessage = 'Your order booking has been confirmed!';

  try {
    const smsSuccess = sendFast2SMSQuickSMS([number], smsMessage);
    const emailSuccess = sendMail({ email, subject: "Order Confirmation", html: `<p>Hooray!! Your order has been confirmed! 🎉</p>` });
    const [emailRes, smsRes] = await Promise.all([emailSuccess, smsSuccess]);

    let message = "Order confirmation sent via";
    if (emailRes.success) message += ` email`;
    else throw new Error(`${emailRes.message}`);
    if (smsRes) message += ` & SMS`;
    else throw new Error(`Failed to send SMS: ${smsRes.message}`);

    res.status(200).json({ message });

  } catch (error) {
    console.error('An error occurred during Quick SMS initiation:', error.message);
    res.status(500).json({ message: 'An error occurred while sending SMS.' });
  }
}

async function sendFast2SMSQuickSMS(numbers, message) {
  const url = 'https://www.fast2sms.com/dev/bulkV2';

  try {
    console.log('Sending Quick SMS...');

    const payload = new URLSearchParams();
    payload.append('message', message);
    payload.append('route', 'q');
    payload.append('numbers', numbers.join(',')); // ensure comma-separated string

    const response = await axios.post(url, payload.toString(), {
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // console.log('Fast2SMS Quick SMS Response:', response.data);

    if (response.data.return === true) {
      // console.log('✅ Quick SMS sent successfully!');
      return true;
    } else {
      console.error('❌ Fast2SMS Quick SMS failed:', response.data.message);
      return false;
    }

  } catch (error) {
    console.error('Error sending Quick SMS:', error.response?.data || error.message);
    throw error;
  }
}

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const bookOrder = async (req, res) => {
  const { amount, currency = "INR", items } = req.body;

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
    console.log("Razorpay order created:");
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};


export { bookOrder, sendSms };


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
