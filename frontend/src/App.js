import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

const App = () => {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    // Create a payment order when the component loads
    fetch('http://localhost:4000/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(data => {
      setOrderId(data.orderId);
      setAmount(data.amount);
      startRazorpayPayment(data.orderId, data.amount);
    });
  }, []);

  const startRazorpayPayment = (orderId, amount) => {
    const options = {
      key: 'your-razorpay-key-id', // Replace with your Razorpay Key ID
      amount: amount, // in paisa
      currency: 'INR',
      order_id: orderId,
      handler: (response) => {
        // Payment success, now verify the payment
        fetch('http://localhost:4000/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(response),
        })
        .then(res => res.json())
        .then(data => {
          setStatus(data.status);
          if (data.status === 'success') {
            window.location.href = '/success';
          } else {
            window.location.href = '/failure';
          }
        });
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Poll the backend for payment status
  useEffect(() => {
    if (orderId) {
      const interval = setInterval(() => {
        fetch(`http://localhost:4000/api/payment-status/${orderId}`)
          .then(res => res.json())
          .then(data => {
            setStatus(data.status);
          });
      }, 3000); // Poll every 3 seconds

      return () => clearInterval(interval);
    }
  }, [orderId]);

  return (
    <div className="App">
      <h1>Scan the QR code to Pay</h1>
      {orderId && <QRCode value={orderId} />}
      <p>Payment status: {status}</p>
    </div>
  );
};

export default App;
