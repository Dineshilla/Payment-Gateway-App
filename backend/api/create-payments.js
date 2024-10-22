const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,  // Use environment variables for security
  key_secret: process.env.RAZORPAY_SECRET,
});

// This will store the status of each payment
let paymentStatus = {};

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const options = {
        amount: 1000 * 100, // Amount in paisa (1000 = 10 INR)
        currency: "INR",
        receipt: `receipt_${Math.random() * 1000}`,
      };

      const order = await razorpay.orders.create(options);
      paymentStatus[order.id] = 'pending'; // Mark payment as pending
      res.json({ orderId: order.id, amount: options.amount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
