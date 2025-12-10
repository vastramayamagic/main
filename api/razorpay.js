const Razorpay = require("razorpay");
const shortid = require("shortid");

export default async function handler(req, res) {
  if (req.method === "POST") {
    
    // Initialize Razorpay with Environment Variables
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const payment_capture = 1;
    // Amount comes from frontend (Note: In production, calculate this from DB to prevent tampering)
    const { amount } = req.body; 
    const currency = "INR";

    const options = {
      amount: (amount * 100).toString(), // Razorpay expects amount in paise
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    try {
      const response = await razorpay.orders.create(options);
      res.status(200).json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  } else {
    res.status(405).end("Method Not Allowed");
  }
}
