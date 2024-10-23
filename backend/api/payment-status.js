module.exports = async (req, res) => {
    if (req.method === 'GET') {
      const { orderId } = req.query; // Use req.query for GET parameters
      const status = paymentStatus[orderId] || 'pending';
      res.json({ status });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  };
  