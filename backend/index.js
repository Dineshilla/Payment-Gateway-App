const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const razorpay = new Razorpay({
  key_id: 'your-razorpay-key-id',  // Your Razorpay Key ID
  key_secret: 'your-razorpay-secret', // Your Razorpay Secret
});

// This will store the status of each payment
let paymentStatus = {};

// Create an order and return the order ID and payment link
app.post('/api/create-payment', async (req, res) => {
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
});

// Verify Razorpay signature and update the payment status
app.post('/api/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', 'your-razorpay-secret') // Replace with your secret key
    .update(body)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    paymentStatus[razorpay_order_id] = 'success';
    res.json({ status: 'success' });
  } else {
    paymentStatus[razorpay_order_id] = 'failed';
    res.json({ status: 'failed' });
  }
});

// Poll for payment status
app.get('/api/payment-status/:orderId', (req, res) => {
  const { orderId } = req.params;
  const status = paymentStatus[orderId] || 'pending';
  res.json({ status });
});

app.listen(4000, () => console.log('Server running on port 4000'));
