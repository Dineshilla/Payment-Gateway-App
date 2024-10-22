const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      paymentStatus[razorpay_order_id] = 'success';
      res.json({ status: 'success' });
    } else {
      paymentStatus[razorpay_order_id] = 'failed';
      res.json({ status: 'failed' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
